import { CleanupManager } from '../../../src/cleanupCommand/cleanupManager';

const cleanFailedIngestionTasksMock = jest.fn();
const cleanSuccessfulIngestionTasksMock = jest.fn();
const cleanSuccessfulSwappedLayersTasksMock = jest.fn();

const cleanupManagerMock = {
  cleanFailedIngestionTasks: cleanFailedIngestionTasksMock,
  cleanSuccessfulIngestionTasks: cleanSuccessfulIngestionTasksMock,
  cleanSuccessfulSwappedLayersTasks: cleanSuccessfulSwappedLayersTasksMock,
} as unknown as CleanupManager;

export { cleanupManagerMock, cleanSuccessfulIngestionTasksMock, cleanFailedIngestionTasksMock, cleanSuccessfulSwappedLayersTasksMock };
