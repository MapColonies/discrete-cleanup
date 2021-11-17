import { CleanupManager } from "../../../src/cleanupCommand/cleanupManager";

const cleanFailedTasksMock = jest.fn();
const cleanSuccessfulTasksMock = jest.fn();

const cleanupManagerMock = {
  cleanFailedTasks: cleanFailedTasksMock,
  cleanSuccessfulTasks: cleanSuccessfulTasksMock
} as unknown as CleanupManager;

export { cleanupManagerMock, cleanSuccessfulTasksMock, cleanFailedTasksMock }
