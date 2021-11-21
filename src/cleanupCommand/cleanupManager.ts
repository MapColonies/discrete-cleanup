import { IngestionParams } from '@map-colonies/mc-model-types';
import { inject, singleton } from 'tsyringe';
import { JobManagerClient } from '../clients/jobManagerClient';
import { MapproxyClient } from '../clients/mapproxyClient';
import { SERVICES } from '../common/constants';
import { IConfig, IJob } from '../common/interfaces';
import { IStorageProvider } from '../storageProviders/iStorageProvider';

@singleton()
export class CleanupManager {
  private readonly discreteBatchSize: number;

  public constructor(
    @inject(SERVICES.TILE_PROVIDER) private readonly tileProvider: IStorageProvider,
    @inject(SERVICES.SOURCES_PROVIDER) private readonly sourcesProvider: IStorageProvider,
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    private readonly mapproxy: MapproxyClient,
    private readonly jobManager: JobManagerClient
  ) {
    this.discreteBatchSize = config.get<number>('batch_size.discreteLayers');
  }

  public async cleanFailedTasks(): Promise<void> {
    const FAILED_CLEANUP_DELAY = this.config.get<number>('failed_cleanup_delay_days');
    const deleteDate = new Date();
    deleteDate.setDate(deleteDate.getDate() - FAILED_CLEANUP_DELAY);
    const notCleanedAndFailed = await this.jobManager.getFailedAndNotCleanedJobs();

    for (let i = 0; i < notCleanedAndFailed.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndFailed.slice(i, i + this.discreteBatchSize);
      const expiredBatch = this.filterExpiredFailedTasks(currentBatch, deleteDate);
      if (expiredBatch.length > 0) {
        await this.sourcesProvider.deleteDiscretes(expiredBatch);
      }
      await this.tileProvider.deleteDiscretes(currentBatch);
      const failedDiscreteLayers = await this.mapproxy.deleteLayers(currentBatch);
      const completedDiscretes = expiredBatch.filter((el) => !failedDiscreteLayers.includes(el));
      await this.jobManager.markAsCompleted(completedDiscretes);
    }
  }

  public async cleanSuccessfulTasks(): Promise<void> {
    const notCleanedAndSuccess = await this.jobManager.getSuccessNotCleanedJobs();
    for (let i = 0; i < notCleanedAndSuccess.length; i += this.discreteBatchSize) {
      const currentBatch = notCleanedAndSuccess.slice(i, i + this.discreteBatchSize);
      await this.sourcesProvider.deleteDiscretes(currentBatch);
      await this.jobManager.markAsCompleted(currentBatch);
    }
  }

  private filterExpiredFailedTasks(tasks: IJob<IngestionParams>[], deleteDate: Date): IJob<IngestionParams>[] {
    const filteredTasks: IJob<IngestionParams>[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const updateDate = new Date(tasks[i].updated);
      if (updateDate <= deleteDate) {
        filteredTasks.push(tasks[i]);
      }
    }
    return filteredTasks;
  }
}
