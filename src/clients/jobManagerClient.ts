import { inject, singleton } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { SERVICES } from '../common/constants';
import { JobStatus } from '../common/enums'; //TODO - should be imported as part of mc-priority-queue package
import { IConfig, IJob, IWithCleanDataIngestionParams } from '../common/interfaces';

@singleton()
export class JobManagerClient extends HttpClient {
  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get<string>('job_manager.url'), 'JobManager', config.get<IHttpRetryConfig>('httpRetry'));
  }

  public async getSuccessNotCleanedJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.getJobs(jobType, JobStatus.COMPLETED);
  }

  public async getFailedAndNotCleanedIngestionJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.getJobs(jobType, JobStatus.FAILED);
  }

  public async getInProgressJobs(jobType: string): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.getJobs(jobType, JobStatus.IN_PROGRESS);
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

  /**
   * This function execute GET request to job-manager API
   * @param jobType job-manager's type of job, for example 'Ingestion_New'
   * @param jobStatus job-manager's operation status, for example 'In-Progress'
   * @param isCleaned find job that wasn't cleaned up - default false
   * @param shouldReturnTasks return job with tasks object - default false
   * @returns
   */
  private async getJobs(
    jobType: string,
    jobStatus: JobStatus,
    isCleaned = false,
    shouldReturnTasks = false
  ): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    return this.get<IJob<IWithCleanDataIngestionParams>[]>('/jobs', {
      isCleaned: isCleaned,
      status: jobStatus,
      type: jobType,
      shouldReturnTasks: shouldReturnTasks,
    });
  }
}
