import { inject, singleton } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { IngestionParams } from '@map-colonies/mc-model-types';
import { SERVICES } from '../common/constants';
import { IConfig, IJob } from '../common/interfaces';

@singleton()
export class JobManagerClient extends HttpClient {
  private readonly ingestionJobType: string;
  private readonly incomingSyncJobType: string;

  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get<string>('job_manager.url'), 'JobManager', config.get<IHttpRetryConfig>('httpRetry'));
    this.ingestionJobType = config.get('ingestion_job_type');
    this.incomingSyncJobType = config.get('incoming_sync_job_type');
  }

  public async getSuccessNotCleanedIngestionJobs(): Promise<IJob<IngestionParams>[]> {
    return this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Completed',
      type: this.ingestionJobType,
      shouldReturnTasks: false,
    });
  }

  public async getFailedAndNotCleanedIngestionJobs(): Promise<IJob<IngestionParams>[]> {
    return this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Failed',
      type: this.ingestionJobType,
      shouldReturnTasks: false,
    });
  }

  public async getFailedAndNotCleanedIncomingSyncJobs(): Promise<IJob<IngestionParams>[]> {
    const failed = await this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Failed',
      type: this.incomingSyncJobType,
      shouldReturnTasks: false,
    });
    const expired = await this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Expired',
      type: this.incomingSyncJobType,
      shouldReturnTasks: false,
    });
    return failed.concat(expired);
  }

  public async markAsCompleted(notCleaned: IJob<IngestionParams>[]): Promise<void> {
    const updateArray = [];
    for (const discrete of notCleaned) {
      updateArray.push(this.put(`/jobs/${discrete.id}`, { isCleaned: true }));
    }
    await Promise.all(updateArray);
  }
}
