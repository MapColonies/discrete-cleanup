import { inject, singleton } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { IngestionParams } from '@map-colonies/mc-model-types';
import { SERVICES } from '../common/constants';
import { IConfig, IJob } from '../common/interfaces';

@singleton()
export class JobManagerClient extends HttpClient {
  private readonly ingestionJobType: string;

  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get<string>('job_manager.url'), 'JobManager', config.get<IHttpRetryConfig>('httpRetry'));
    this.ingestionJobType = config.get('ingestion_job_type');
  }

  public async getSuccessNotCleanedJobs(): Promise<IJob<IngestionParams>[]> {
    return this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Completed',
      type: this.ingestionJobType,
    });
  }

  public async getFailedAndNotCleanedJobs(): Promise<IJob<IngestionParams>[]> {
    return this.get<IJob<IngestionParams>[]>('/jobs', {
      isCleaned: false,
      status: 'Failed',
      type: this.ingestionJobType,
    });
  }

  public async markAsCompleted(notCleaned: IJob<IngestionParams>[]): Promise<void> {
    const updateArray = [];
    for (const discrete of notCleaned) {
      updateArray.push(this.put(`/jobs/${discrete.id}`, { isCleaned: true }));
    }
    await Promise.all(updateArray);
  }
}
