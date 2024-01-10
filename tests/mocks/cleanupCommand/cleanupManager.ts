import { CleanupManager } from '../../../src/cleanupCommand/cleanupManager';

const cleanFailedIngestionTasksMock = jest.fn();
const cleanSuccessfulIngestionTasksMock = jest.fn();
const cleanFailedIncomingSyncTasksMock = jest.fn();
const cleanSuccessfulSwappedLayersTasksMock = jest.fn();

const cleanupManagerMock = {
  cleanFailedIngestionTasks: cleanFailedIngestionTasksMock,
  cleanSuccessfulIngestionTasks: cleanSuccessfulIngestionTasksMock,
  cleanFailedIncomingSyncTasks: cleanFailedIncomingSyncTasksMock,
  cleanSuccessfulSwappedLayersTasks: cleanSuccessfulSwappedLayersTasksMock,
} as unknown as CleanupManager;

export {
  cleanupManagerMock,
  cleanSuccessfulIngestionTasksMock,
  cleanFailedIngestionTasksMock,
  cleanFailedIncomingSyncTasksMock,
  cleanSuccessfulSwappedLayersTasksMock,
};
