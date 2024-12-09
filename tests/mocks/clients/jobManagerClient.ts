import { JobManagerClient } from '../../../src/clients/jobManagerClient';

const getSuccessNotCleanedJobsMock = jest.fn();
const getFailedAndNotCleanedIngestionJobsMock = jest.fn();
const getInProgressJobsMock = jest.fn();
const markAsCompletedMock = jest.fn();
const markAsCompletedAndRemoveFilesMock = jest.fn();

const jobManagerClientMock = {
  getSuccessNotCleanedJobs: getSuccessNotCleanedJobsMock,
  getFailedAndNotCleanedIngestionJobs: getFailedAndNotCleanedIngestionJobsMock,
  getInProgressJobs: getInProgressJobsMock,
  markAsCompleted: markAsCompletedMock,
  markAsCompletedAndRemoveFiles: markAsCompletedAndRemoveFilesMock,
} as unknown as JobManagerClient;

export {
  jobManagerClientMock,
  getSuccessNotCleanedJobsMock,
  getFailedAndNotCleanedIngestionJobsMock,
  getInProgressJobsMock,
  markAsCompletedMock,
  markAsCompletedAndRemoveFilesMock,
};
