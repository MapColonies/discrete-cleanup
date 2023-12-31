import { inject, singleton } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
// import { IngestionParams } from '@map-colonies/mc-model-types';
import { SERVICES } from '../common/constants';
import { IConfig, IJob, IWithCleanDataIngestionParams } from '../common/interfaces';

@singleton()
export class JobManagerClient extends HttpClient {
  private readonly incomingSyncJobType: string;

  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get<string>('job_manager.url'), 'JobManager', config.get<IHttpRetryConfig>('httpRetry'));
    this.incomingSyncJobType = config.get('incoming_sync_job_type');
  }

  public async getSuccessNotCleanedIngestionJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Completed',
      type: jobType,
      shouldReturnTasks: false,
    });
  }

  public async getFailedAndNotCleanedIngestionJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Failed',
      type: jobType,
      shouldReturnTasks: false,
    });
  }

  public async getInProgressJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'In-Progress',
      type: jobType,
      shouldReturnTasks: false,
    });
  }

  public async getFailedAndNotCleanedIncomingSyncJobs(): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    const failed = await this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Failed',
      type: this.incomingSyncJobType,
      shouldReturnTasks: false,
    });
    const expired = await this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Expired',
      type: this.incomingSyncJobType,
      shouldReturnTasks: false,
    });
    return failed.concat(expired);
  }

  public async markAsCompleted(notCleaned: IJob<IWithCleanDataIngestionParams>[]): Promise<void> {
    const updateArray = [];
    for (const discrete of notCleaned) {
      updateArray.push(this.put(`/jobs/${discrete.id}`, { isCleaned: true }));
    }
    await Promise.all(updateArray);
  }

  public async markAsCompletedAndRemoveFiles(notCleaned: IJob<IWithCleanDataIngestionParams>[]): Promise<void> {
    const updateArray = [];
    for (const discrete of notCleaned) {
      const parameters = discrete.parameters as { fileNames?: string[] };
      delete parameters.fileNames;
      updateArray.push(
        this.put(`/jobs/${discrete.id}`, {
          isCleaned: true,
          parameters,
        })
      );
    }
    await Promise.all(updateArray);
  }
}
