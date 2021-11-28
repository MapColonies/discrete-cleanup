import { JobManagerClient } from '../../../src/clients/jobManagerClient';

const getSuccessNotCleanedIngestionJobsMock = jest.fn();
const getFailedAndNotCleanedIngestionJobsMock = jest.fn();
const getFailedAndNotCleanedIncomingSyncJobsMock = jest.fn();
const markAsCompletedMock = jest.fn();

const jobManagerClientMock = {
  getSuccessNotCleanedIngestionJobs: getSuccessNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIngestionJobs: getFailedAndNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIncomingSyncJobs: getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompleted: markAsCompletedMock,
} as unknown as JobManagerClient;

export { jobManagerClientMock, 
  getSuccessNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIngestionJobsMock, 
  getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompletedMock };
