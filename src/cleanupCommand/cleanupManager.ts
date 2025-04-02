import { Logger } from '@map-colonies/js-logger';
import { inject, singleton } from 'tsyringe';
import { JobManagerWrapper } from '../clients/jobManagerClient';
import { MapProxyClient } from '../clients/mapproxyClient';
import { SERVICES } from '../common/constants';
import { IConfig, IDataLocation, ITilesLocation, JobResponse } from '../common/interfaces';
import { IStorageProvider } from '../storageProviders/iStorageProvider';
import { extractRootDirectory } from '../common/utils';

@singleton()
export class CleanupManager {
  private readonly discreteBatchSize: number;
  private readonly newIngestionJobType: string;
  private readonly updateIngestionJobType: string;
  private readonly sourceBlackList: string[];
  private readonly successCleanupDelayDays: number;
  private readonly failedCleanupDelayDays: number;

  public constructor(
    @inject(SERVICES.TILE_PROVIDER) private readonly tileProvider: IStorageProvider,
    @inject(SERVICES.SOURCES_PROVIDER) private readonly sourcesProvider: IStorageProvider,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.LOGGER) private readonly logger: Logger,
    private readonly mapproxy: MapProxyClient,
    private readonly jobManager: JobManagerWrapper
  ) {
    this.discreteBatchSize = config.get<number>('batch_size.discreteLayers');
    //TODO: fix the job types from config
    this.newIngestionJobType = config.get('jobDefinitions.jobs.new.type');
    this.updateIngestionJobType = config.get('jobDefinitions.jobs.update.type');
    this.sourceBlackList = config.get<string[]>('fs.blacklist_sources_location');
    this.successCleanupDelayDays = this.config.get<number>('success_cleanup_delay_days.ingestion');
    this.failedCleanupDelayDays = this.config.get<number>('failed_cleanup_delay_days.ingestion');
  }

  public async cleanFailedIngestionTasks(): Promise<void> {
    this.logger.info({ msg: `Running Cleanup for failed expired ingestion jobs of type: ${this.newIngestionJobType}` });
    const notCleanedAndFailedNew = await this.jobManager.getFailedAndNotCleanedIngestionJobs(this.newIngestionJobType);
    for (let i = 0; i < notCleanedAndFailedNew.length; i += this.discreteBatchSize) {
      //for each expired batch - delete sources and then tiles
      const currentBatch = notCleanedAndFailedNew.slice(i, i + this.discreteBatchSize);
      const expiredBatch = await this.deleteExpiredTasksSources(currentBatch, this.failedCleanupDelayDays);
      if (expiredBatch.length === 0) {
        continue;
      }
      this.logger.info({
        msg: `Will execute cleanup to ${expiredBatch.length} failed jobs of type: '${this.newIngestionJobType}'`,
        batch: `${i + 1}/${Math.floor(notCleanedAndFailedNew.length / this.discreteBatchSize + 1)}`,
        jobIds: expiredBatch.map((job) => job.id),
      });
      const tilesDirectories = this.getTilesLocation(expiredBatch);
      await this.tileProvider.deleteDiscretes(tilesDirectories);
      const failedDiscreteLayers = await this.mapproxy.deleteLayers(expiredBatch);
      const completedDiscretes = expiredBatch.filter((el) => !failedDiscreteLayers.includes(el));
      this.logger.info({
        msg: `Complete and mark jobs as 'Completed' with file directories remove for all expired jobs`,
        jobIds: completedDiscretes.map((job) => job.id),
      });
      await this.jobManager.markAsCompleted(completedDiscretes);
    }

    this.logger.info({ msg: `Running Cleanup for failed expired ingestion jobs of type: ${this.updateIngestionJobType}` });
    const notCleanedAndFailedUpdate = await this.jobManager.getFailedAndNotCleanedIngestionJobs(this.updateIngestionJobType);
    for (let i = 0; i < notCleanedAndFailedUpdate.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndFailedUpdate.slice(i, i + this.discreteBatchSize);
      this.logger.info({
        msg: `Will execute cleanup to ${currentBatch.length} failed jobs of type: '${this.updateIngestionJobType}'`,
        batch: `${i + 1}/${Math.floor(notCleanedAndFailedUpdate.length / this.discreteBatchSize + 1)}`,
      });
      const expiredBatch = await this.deleteExpiredTasksSources(currentBatch, this.failedCleanupDelayDays);
      this.logger.info({
        msg: `Complete and mark jobs as 'Completed' ${expiredBatch.length} for all expired jobs`,
        batch: `${i + 1}/${Math.floor(notCleanedAndFailedUpdate.length / this.discreteBatchSize + 1)}`,
        jobIds: expiredBatch.map((job) => job.id),
      });
      await this.jobManager.markAsCompleted(expiredBatch);
    }
  }

  public async cleanSuccessfulIngestionTasks(ingestionJobType: string): Promise<void> {
    this.logger.info({ msg: `Running Cleanup for success ingestion jobs of type: ${ingestionJobType}` });
    const notCleanedAndSuccess = await this.jobManager.getSuccessNotCleanedJobs(ingestionJobType);
    for (let i = 0; i < notCleanedAndSuccess.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndSuccess.slice(i, i + this.discreteBatchSize);
      const blackListFilteredBatch = this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(currentBatch) : currentBatch;
      this.logger.info({
        msg: `Will execute cleanup to ${blackListFilteredBatch.length} success jobs of type: '${ingestionJobType}'`,
        batch: `${i + 1}/${Math.floor(notCleanedAndSuccess.length / this.discreteBatchSize + 1)}`,
        jobIds: blackListFilteredBatch.map((job) => job.id),
      });
      const sourcesToDelete = currentBatch.filter((discrete) => !this.isIncludedInBlacklist(discrete.parameters.inputFiles.originDirectory));
      const ignoredSources = currentBatch.filter((discrete) => this.isIncludedInBlacklist(discrete.parameters.inputFiles.originDirectory));
      this.logger.info({
        msg: `Will execute sources deletion after excluded from blacklist'`,
        sourcesToDelete: sourcesToDelete.length ? sourcesToDelete.map((source) => source.parameters.inputFiles.originDirectory) : [],
        ignoredSources: ignoredSources.length ? ignoredSources.map((source) => source.parameters.inputFiles.originDirectory) : [],
      });
      const expiredBatch = this.filterExpiredFailedTasks(blackListFilteredBatch, this.successCleanupDelayDays);
      const sourcesDirectories = this.getSourcesLocation(expiredBatch);
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);
      await this.jobManager.markAsCompleted(currentBatch);
      this.logger.info({
        msg: `Complete and mark jobs as 'Completed' with file directories remove`,
        batch: `${i + 1}/${Math.floor(notCleanedAndSuccess.length / this.discreteBatchSize + 1)}`,
        jobIds: expiredBatch.map((job) => job.id),
      });
    }
  }

  public async cleanSuccessfulSwappedLayersTasks(swapJobType: string): Promise<void> {
    this.logger.info({ msg: `Running Cleanup for success ingestion swap update jobs of type: ${swapJobType}` });
    const notCleanedAndSuccess = await this.jobManager.getSuccessNotCleanedJobs(swapJobType);
    for (let i = 0; i < notCleanedAndSuccess.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndSuccess.slice(i, i + this.discreteBatchSize);

      // cleaning tiles of all success jobs excluding layer that been exporting on current iteration.
      const notRunningExportFilteredBatch = await this.filterFromRunningExportJobs(currentBatch);
      this.logger.info({
        msg: `Will execute cleanup to ${notRunningExportFilteredBatch.length} success jobs of type: '${swapJobType}'`,
        batch: `${i + 1}/${Math.floor(notCleanedAndSuccess.length / this.discreteBatchSize + 1)}`,
        jobIds: notRunningExportFilteredBatch.map((job) => job.id),
      });
      const tilesDirectories = this.getSwappedTilesLocation(notRunningExportFilteredBatch);
      await this.tileProvider.deleteDiscretes(tilesDirectories);

      // clean source data only for jobs excluded the blacklist
      const blackListFilteredBatch =
        this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(notRunningExportFilteredBatch) : notRunningExportFilteredBatch;
      const sourcesDirectories = this.getSourcesLocation(blackListFilteredBatch);
      const sourcesToDelete = notRunningExportFilteredBatch.filter(
        (discrete) => !this.isIncludedInBlacklist(discrete.parameters.inputFiles.originDirectory)
      );
      const ignoredSources = notRunningExportFilteredBatch.filter((discrete) =>
        this.isIncludedInBlacklist(discrete.parameters.inputFiles.originDirectory)
      );
      this.logger.info({
        msg: `Will execute sources deletion after excluded from blacklist'`,
        sourcesToDelete: sourcesToDelete.length ? sourcesToDelete.map((source) => source.parameters.inputFiles.originDirectory) : [],
        ignoredSources: ignoredSources.length ? ignoredSources.map((source) => source.parameters.inputFiles.originDirectory) : [],
      });
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);

      if (notRunningExportFilteredBatch.length) {
        this.logger.info({
          msg: `Complete and mark jobs as 'Completed' with file directories remove`,
          jobIds: notRunningExportFilteredBatch.map((job) => job.id),
        });
        await this.jobManager.markAsCompleted(notRunningExportFilteredBatch);
      }
    }
  }

  private filterExpiredFailedTasks(tasks: JobResponse[], delayDays: number): JobResponse[] {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() - delayDays);
    const filteredTasks: JobResponse[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const updateDate = new Date(tasks[i].updated);
      if (updateDate <= deleteDate) {
        filteredTasks.push(tasks[i]);
      }
    }
    return filteredTasks;
  }

  private filterBlackListSourcesTasks(tasks: JobResponse[]): JobResponse[] {
    const filteredTasks: JobResponse[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const originDirectory = tasks[i].parameters.inputFiles.originDirectory;
      if (!this.isIncludedInBlacklist(originDirectory)) {
        filteredTasks.push(tasks[i]);
      }
    }
    return filteredTasks;
  }

  private async filterFromRunningExportJobs(jobs: JobResponse[]): Promise<JobResponse[]> {
    const runningExportJobs = await this.jobManager.getProcessingExportJobs();
    const cleanupReadyJobs: JobResponse[] = [];

    for (const swapJob of jobs) {
      const cleanupData = swapJob.parameters.cleanupDataParams;
      const filteredJobs = runningExportJobs.filter(
        (job) =>
          cleanupData?.previousProductVersion === job.version &&
          swapJob.parameters.cleanupDataParams?.previousRelativePath === job.parameters.cleanupDataParams?.directoryPath &&
          swapJob.internalId === job.internalId
      );
      if (!filteredJobs.length) {
        cleanupReadyJobs.push(swapJob);
      }
    }
    return cleanupReadyJobs;
  }

  private async deleteExpiredTasksSources(tasks: JobResponse[], delayDays: number): Promise<JobResponse[]> {
    const expiredBatch = this.filterExpiredFailedTasks(tasks, delayDays);
    if (expiredBatch.length > 0) {
      const blackListFilteredBatch = this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(expiredBatch) : expiredBatch;
      const sourcesDirectories = this.getSourcesLocation(blackListFilteredBatch);
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);
      this.logger.info({
        msg: `Removed sources for expired and non blacklist filtered jobs'`,
        jobIds: blackListFilteredBatch.map((job) => job.id),
        totalExpiredJobs: expiredBatch.map((job) => job.id),
      });
    }
    return expiredBatch;
  }

  private getSourcesLocation(discreteArray: JobResponse[]): IDataLocation[] {
    const sourcesDirectories: IDataLocation[] = discreteArray.map((discrete) => {
      return { directory: discrete.parameters.inputFiles.originDirectory };
    });
    return sourcesDirectories;
  }

  private getTilesLocation(discreteArray: JobResponse[]): ITilesLocation[] {
    return discreteArray
      .map((discrete) => discrete.parameters.cleanupDataParams?.directoryPath) // Extract directoryPath
      .filter((directoryPath): directoryPath is string => !!directoryPath && directoryPath.includes('/')) // Ensure it's non-empty and has a valid structure
      .map((directoryPath) => {
        const [catalogId, displayPath = ''] = directoryPath.split('/'); // Ensure displayPath is always a string
        return {
          directory: catalogId,
          subDirectory: displayPath,
        };
      });
  }
  private getSwappedTilesLocation(discreteArray: JobResponse[]): ITilesLocation[] {
    const tilesDirectories: ITilesLocation[] = discreteArray
      .filter((nonFilteredDiscrete) => nonFilteredDiscrete.parameters.cleanupDataParams)
      .map((discrete) => {
        if (discrete.parameters.cleanupDataParams && !discrete.parameters.cleanupDataParams.previousRelativePath) {
          throw Error('Cleanup data must have previous relative path');
        }
        const [catalogId, displayPath] = (discrete.parameters.cleanupDataParams?.directoryPath ?? '').split('/');
        return {
          directory: catalogId,
          subDirectory: displayPath,
        };
      });

    return tilesDirectories;
  }

  private isIncludedInBlacklist(directory: string): boolean {
    return this.sourceBlackList.includes(extractRootDirectory(directory));
  }
}
