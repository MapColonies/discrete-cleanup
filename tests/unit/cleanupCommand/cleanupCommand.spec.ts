import { CleanupCommand } from '../../../src/cleanupCommand/cleanupCommand';
import {
  cleanupManagerMock,
  cleanFailedIngestionTasksMock,
  cleanSuccessfulIngestionTasksMock,
  cleanFailedIncomingSyncTasksMock,
  cleanSuccessfulSwappedLayersTasksMock,
} from '../../mocks/cleanupCommand/cleanupManager';
import { configMock, initConfig, clearConfig, setConfigValue } from '../../mocks/config';

describe('CleanupCommand', () => {
  let command: CleanupCommand;

  beforeEach(() => {
    initConfig();
    command = new CleanupCommand(configMock, cleanupManagerMock);
  });

  afterEach(() => {
    clearConfig();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handler', () => {
    it('calls all cleanup methods', async () => {
      setConfigValue('cleanupTypes.failedIngestionTasks', true);
      setConfigValue('cleanupTypes.successfulIngestion', true);
      setConfigValue('cleanupTypes.failedIncomingSyncTasks', true);
      setConfigValue('cleanupTypes.successfulSwapUpdate', true);

      await command.handler();

      expect(cleanFailedIngestionTasksMock).toHaveBeenCalledTimes(1);
      expect(cleanSuccessfulIngestionTasksMock).toHaveBeenCalledTimes(2);
      expect(cleanFailedIncomingSyncTasksMock).toHaveBeenCalledTimes(1);
      expect(cleanSuccessfulSwappedLayersTasksMock).toHaveBeenCalledTimes(1);
    });
  });
});
