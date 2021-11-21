import { JobManagerClient } from '../../../src/clients/jobManagerClient';

const getSuccessNotCleanedJobsMock = jest.fn();
const getFailedAndNotCleanedJobsMock = jest.fn();
const markAsCompletedMock = jest.fn();

const jobManagerClientMock = {
  getSuccessNotCleanedJobs: getSuccessNotCleanedJobsMock,
  getFailedAndNotCleanedJobs: getFailedAndNotCleanedJobsMock,
  markAsCompleted: markAsCompletedMock,
} as unknown as JobManagerClient;

export { jobManagerClientMock, getFailedAndNotCleanedJobsMock, getSuccessNotCleanedJobsMock, markAsCompletedMock };
