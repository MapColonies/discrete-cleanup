import { inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import config from 'config';
import { Tracer } from '@opentelemetry/api';
import { IFindJobsByCriteriaBody, IFindJobsRequest, JobManagerClient, OperationStatus } from '@map-colonies/mc-priority-queue';
import { IHttpRetryConfig } from '@map-colonies/mc-utils';
import { IngestionNewJobParams, IngestionUpdateJobParams, IngestionSwapUpdateJobParams } from '@map-colonies/raster-shared';
import { SERVICES } from '../common/constants';
import { ExportJobResponse, IJobResponseWithoutParams, JobResponse } from '../common/interfaces';

@injectable()
export class JobManagerWrapper extends JobManagerClient {
  private readonly exportJobType: string;
  private readonly jobDomain: string;
  public constructor(@inject(SERVICES.LOGGER) protected readonly logger: Logger, @inject(SERVICES.TRACER) public readonly tracer: Tracer) {
    super(
      logger,
      config.get<string>('serviceUrls.jobManager'),
      config.get<IHttpRetryConfig>('httpRetry'),
      'jobManagerClient',
      config.get<boolean>('disableHttpClientLogs')
    );

    this.exportJobType = config.get<string>('jobDefinitions.jobs.export.type');
    this.jobDomain = config.get<string>('domain');
  }

  public async getFailedAndNotCleanedIngestionJobs(jobType: string): Promise<JobResponse[]> {
    return this.getJobsByQueryParams(jobType, OperationStatus.FAILED);
  }

  public async getSuccessNotCleanedJobs(jobType: string): Promise<JobResponse[]> {
    return this.getJobsByQueryParams(jobType, OperationStatus.COMPLETED);
  }

  public async getProcessingExportJobs(): Promise<ExportJobResponse[]> {
    const criteria: IFindJobsByCriteriaBody = {
      isCleaned: false,
      types: [this.exportJobType],
      shouldReturnTasks: false,
      statuses: [OperationStatus.IN_PROGRESS, OperationStatus.PENDING],
      domain: this.jobDomain,
    };

    this.logger.debug({ msg: `Getting processing export jobs `, ...criteria });
    const jobs: ExportJobResponse[] = await this.post<ExportJobResponse[]>('/jobs/find', criteria);
    return jobs;
  }

  public async markAsCompleted(notCleaned: JobResponse[]): Promise<void> {
    const updateArray = [];
    for (const discrete of notCleaned) {
      updateArray.push(this.put(`/jobs/${discrete.id}`, { isCleaned: true }));
    }
    await Promise.all(updateArray);
  }

  public async markAsCompletedAndRemoveFiles(notCleaned: JobResponse[]): Promise<void> {
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

  private async getJobsByQueryParams(jobType: string, status: OperationStatus): Promise<JobResponse[]> {
    const queryParams: IFindJobsRequest = {
      type: jobType,
      status,
      isCleaned: false,
      shouldReturnTasks: false,
    };

    const res = await this.get<IJobResponseWithoutParams[] | undefined>('/jobs', queryParams as Record<string, unknown>);
    if (!res) {
      return [];
    }

    return this.getJobsWithParams(res);
  }

  private async getJobsWithParams(jobs: IJobResponseWithoutParams[]): Promise<JobResponse[]> {
    const jobsWithParams = await Promise.all(jobs.map(async (job) => this.getJobByJobId(job.id)));
    this.logger.info({ msg: `Got ${jobsWithParams.length} jobs with params` });
    return jobsWithParams;
  }

  private async getJobByJobId(jobId: string): Promise<JobResponse> {
    this.logger.debug({ msg: `Getting export job by id`, jobId });
    const job = await this.getJob<IngestionNewJobParams | IngestionUpdateJobParams | IngestionSwapUpdateJobParams, unknown>(jobId);
    return job;
  }

  // /**
  //  * This function execute GET request to job-manager API
  //  * @param jobType job-manager's type of job, for example 'Ingestion_New'
  //  * @param jobStatus job-manager's operation status, for example 'In-Progress'
  //  * @param isCleaned find job that wasn't cleaned up - default false
  //  * @param shouldReturnTasks return job with tasks object - default false
  //  * @returns
  //  */
  //   private async getJobs(
  //     jobType: string,
  //     jobStatus: JobStatus,
  //     isCleaned = false,
  //     shouldReturnTasks = false
  //   ): Promise<JobResponse[]> {
  //     return this.get<JobResponse[]>('/jobs', {
  //       isCleaned: isCleaned,
  //       status: jobStatus,
  //       type: jobType,
  //       shouldReturnTasks: shouldReturnTasks,
  //     });
  //   }
  // }
  // function withSpanAsyncV4(target: JobManagerWrapper, propertyKey: 'getSuccessNotCleanedJobs', descriptor: TypedPropertyDescriptor<(jobType: string) => Promise<JobResponse[]>>): void | TypedPropertyDescriptor<(jobType: string) => Promise<JobResponse[]>> {
  //   throw new Error('Function not implemented.');
  // }
}
