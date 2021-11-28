import { CleanupCommand } from '../../../src/cleanupCommand/cleanupCommand';
import { cleanupManagerMock, cleanFailedIngestionTasksMock, cleanSuccessfulIngestionTasksMock, cleanFailedIncomingSyncTasksMock } from '../../mocks/cleanupCommand/cleanupManager';

describe('CleanupCommand', () => {
  let command: CleanupCommand;

  beforeEach(() => {
    command = new CleanupCommand(cleanupManagerMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('handler', () => {
    it('calls all cleanup methods', async () => {
      await command.handler();

      expect(cleanFailedIngestionTasksMock).toHaveBeenCalledTimes(1);
      expect(cleanSuccessfulIngestionTasksMock).toHaveBeenCalledTimes(1);
      expect(cleanFailedIncomingSyncTasksMock).toHaveBeenCalledTimes(1);
    });
  });
});
