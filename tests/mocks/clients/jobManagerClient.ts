import { JobManagerClient } from '../../../src/clients/jobManagerClient';

const getSuccessNotCleanedIngestionJobsMock = jest.fn();
const getFailedAndNotCleanedIngestionJobsMock = jest.fn();
const getFailedAndNotCleanedIncomingSyncJobsMock = jest.fn();
const markAsCompletedMock = jest.fn();
const markAsCompletedAndRemoveFilesMock = jest.fn();

const jobManagerClientMock = {
  getSuccessNotCleanedIngestionJobs: getSuccessNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIngestionJobs: getFailedAndNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIncomingSyncJobs: getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompleted: markAsCompletedMock,
  markAsCompletedAndRemoveFiles: markAsCompletedAndRemoveFilesMock,
} as unknown as JobManagerClient;

export {
  jobManagerClientMock,
  getSuccessNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompletedMock,
  markAsCompletedAndRemoveFilesMock,
};
