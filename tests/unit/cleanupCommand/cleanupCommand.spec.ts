import { CleanupCommand } from '../../../src/cleanupCommand/cleanupCommand';
import { cleanupManagerMock,cleanFailedTasksMock,cleanSuccessfulTasksMock } from '../../mocks/cleanupCommand/cleanupManager';

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

      expect(cleanFailedTasksMock).toHaveBeenCalledTimes(1);
      expect(cleanSuccessfulTasksMock).toHaveBeenCalledTimes(1);
    });
  });
});
