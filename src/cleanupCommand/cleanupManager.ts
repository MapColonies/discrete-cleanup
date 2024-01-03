// import { IngestionParams } from '@map-colonies/mc-model-types';
import { inject, singleton } from 'tsyringe';
import { JobManagerClient } from '../clients/jobManagerClient';
import { MapproxyClient } from '../clients/mapproxyClient';
import { SERVICES } from '../common/constants';
import { IConfig, IJob, IWithCleanDataIngestionParams, IDataLocation, ITilesLocation } from '../common/interfaces';
import { IStorageProvider } from '../storageProviders/iStorageProvider';

@singleton()
export class CleanupManager {
  private readonly discreteBatchSize: number;
  private readonly newIngestionJobType: string;
  private readonly updateIngestionJobType: string;
  private readonly swapUpdateIngestionJobType: string;
  private readonly exporterJobType: string;
  private readonly sourceBlackList: string[];
  private readonly failedCleanupDelayDays: number;

  public constructor(
    @inject(SERVICES.TILE_PROVIDER) private readonly tileProvider: IStorageProvider,
    @inject(SERVICES.SOURCES_PROVIDER) private readonly sourcesProvider: IStorageProvider,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    private readonly mapproxy: MapproxyClient,
    private readonly jobManager: JobManagerClient
  ) {
    this.discreteBatchSize = config.get<number>('batch_size.discreteLayers');
    this.newIngestionJobType = config.get('new_ingestion_job_type');
    this.updateIngestionJobType = config.get('update_ingestion_job_type');
    this.swapUpdateIngestionJobType = config.get('swap_update_ingestion_job_type');
    this.exporterJobType = config.get('export_job_type');
    this.sourceBlackList = config.get<string[]>('fs.blacklist_sources_location');
    this.failedCleanupDelayDays = this.config.get<number>('failed_cleanup_delay_days.ingestion');
  }

  public async cleanFailedIngestionTasks(): Promise<void> {
    const notCleanedAndFailedNew = await this.jobManager.getFailedAndNotCleanedIngestionJobs(this.newIngestionJobType);
    for (let i = 0; i < notCleanedAndFailedNew.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndFailedNew.slice(i, i + this.discreteBatchSize);
      const expiredBatch = await this.deleteExpiredFailedTasksSources(currentBatch);
      const tilesDirectories = this.getCurrentTilesLocation(currentBatch)
      await this.tileProvider.deleteDiscretes(tilesDirectories);
      const failedDiscreteLayers = await this.mapproxy.deleteLayers(currentBatch);
      const completedDiscretes = expiredBatch.filter((el) => !failedDiscreteLayers.includes(el));
      await this.jobManager.markAsCompletedAndRemoveFiles(completedDiscretes);
    }

    const notCleanedAndFailedUpdate = await this.jobManager.getFailedAndNotCleanedIngestionJobs(this.updateIngestionJobType);
    for (let i = 0; i < notCleanedAndFailedUpdate.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndFailedUpdate.slice(i, i + this.discreteBatchSize);
      const expiredBatch = await this.deleteExpiredFailedTasksSources(currentBatch);
      await this.jobManager.markAsCompletedAndRemoveFiles(expiredBatch);
    }
  }

  public async cleanSuccessfulIngestionTasks(ingestionJobType: string): Promise<void> {
    const notCleanedAndSuccess = await this.jobManager.getSuccessNotCleanedIngestionJobs(ingestionJobType);

    for (let i = 0; i < notCleanedAndSuccess.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndSuccess.slice(i, i + this.discreteBatchSize);
      const blackListFlitteredBatch = this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(currentBatch) : currentBatch;
      const sourcesDirectories = this.getSourcesLocation(blackListFlitteredBatch);
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);
      await this.jobManager.markAsCompletedAndRemoveFiles(currentBatch);
    }
  }

  public async cleanSuccessfulSwappedLayersTasks(ingestionJobType: string): Promise<void> {
    const notCleanedAndSuccess = await this.jobManager.getSuccessNotCleanedIngestionJobs(ingestionJobType);
    for (let i = 0; i < notCleanedAndSuccess.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndSuccess.slice(i, i + this.discreteBatchSize);
      const blackListFlitteredBatch = this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(currentBatch) : currentBatch;
      const notRunningExportFilteredBatch = await this.filterFromRunningExportJobs(blackListFlitteredBatch);
      const sourcesDirectories = this.getSourcesLocation(notRunningExportFilteredBatch);
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);
      const tilesDirectories = this.getSwappedTilesLocation(notRunningExportFilteredBatch)
      await this.tileProvider.deleteDiscretes(tilesDirectories);
      if (notRunningExportFilteredBatch.length) {
        await this.jobManager.markAsCompletedAndRemoveFiles(notRunningExportFilteredBatch);
      }
    }
  }

  public async cleanFailedIncomingSyncTasks(): Promise<void> {
    const FAILED_CLEANUP_DELAY = this.config.get<number>('failed_cleanup_delay_days.sync');
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() - FAILED_CLEANUP_DELAY);
    const notCleanedAndFailed = await this.jobManager.getFailedAndNotCleanedIncomingSyncJobs();
    for (let i = 0; i < notCleanedAndFailed.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndFailed.slice(i, i + this.discreteBatchSize);
      const failedDiscreteLayers = await this.mapproxy.deleteLayers(currentBatch);
      const expiredBatch = this.filterExpiredFailedTasks(currentBatch, deleteDate);
      if (expiredBatch.length > 0) {
        const sourcesDirectories = this.getSourcesLocation(expiredBatch)
        await this.tileProvider.deleteDiscretes(sourcesDirectories);
      }
      const completedDiscretes = expiredBatch.filter((el) => !failedDiscreteLayers.includes(el));
      await this.jobManager.markAsCompleted(completedDiscretes);
    }
  }

  private filterExpiredFailedTasks(tasks: IJob<IWithCleanDataIngestionParams>[], deleteDate: Date): IJob<IWithCleanDataIngestionParams>[] {
    const filteredTasks: IJob<IWithCleanDataIngestionParams>[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const updateDate = new Date(tasks[i].updated);
      if (updateDate <= deleteDate) {
        filteredTasks.push(tasks[i]);
      }
    }
    return filteredTasks;
  }

  private filterBlackListSourcesTasks(tasks: IJob<IWithCleanDataIngestionParams>[]): IJob<IWithCleanDataIngestionParams>[] {
    const filteredTasks: IJob<IWithCleanDataIngestionParams>[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const originDirectory = tasks[i].parameters.originDirectory;
      if (!this.sourceBlackList.includes(originDirectory)) {
        filteredTasks.push(tasks[i]);
      }
    }
    return filteredTasks;
  }

  private async filterFromRunningExportJobs(jobs: IJob<IWithCleanDataIngestionParams>[]): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    const runningExportJobs = await this.jobManager.getInProgressJobs(this.exporterJobType);
    const cleanupReadyJobs: IJob<IWithCleanDataIngestionParams>[] = [];

    for (const swapJob of jobs) {
      const cleanupData = swapJob.parameters.cleanupData;
      const filteredJobs = runningExportJobs.filter(
        (job) => cleanupData?.previousProductVersion === job.version && swapJob.parameters.metadata.productId === job.resourceId
      );
      if (!filteredJobs.length) {
        cleanupReadyJobs.push(swapJob);
      }
    }
    return cleanupReadyJobs;
  }

  private async deleteExpiredFailedTasksSources(tasks: IJob<IWithCleanDataIngestionParams>[]): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() - this.failedCleanupDelayDays);
    const expiredBatch = this.filterExpiredFailedTasks(tasks, deleteDate);
    if (expiredBatch.length > 0) {
      const blackListFilteredBatch = this.sourceBlackList.length > 0 ? this.filterBlackListSourcesTasks(expiredBatch) : expiredBatch;
      const sourcesDirectories = this.getSourcesLocation(blackListFilteredBatch)
      await this.sourcesProvider.deleteDiscretes(sourcesDirectories);
    }
    return expiredBatch;
  }

  private getSourcesLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): IDataLocation[] {
    const sourcesDirectories: IDataLocation[] = discreteArray.map((discrete) => {
      return { directory: discrete.parameters.originDirectory };
    });
    return sourcesDirectories;
  }

  private getCurrentTilesLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): ITilesLocation[] {
    const tilesDirectories: ITilesLocation[] = discreteArray.map((discrete) => {
      return {
        directory: discrete.parameters.metadata.id as string,
        subDirectory: discrete.parameters.metadata.displayPath as string,
      };
    });
    return tilesDirectories;
  }

  private getSwappedTilesLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): ITilesLocation[] {
    const tilesDirectories: ITilesLocation[] = discreteArray
      .filter((v) => v.parameters.cleanupData)
      .map((discrete) => {
        if (discrete.parameters.cleanupData && !discrete.parameters.cleanupData.previousRelativePath){
          throw Error('Cleanup data must have previous relative path')
        }
        return {
          directory: discrete.parameters.metadata.id as string,
          subDirectory: discrete.parameters.cleanupData?.previousRelativePath as string,
        };
      });

    return tilesDirectories;
  }
}
