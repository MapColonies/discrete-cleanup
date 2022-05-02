import { configMock, initConfig, setConfigValue } from '../../mocks/config';
import { createStorageProviderMock } from '../../mocks/storageProviders/providerMockGenerator';
import { mapproxyClientMock, deleteLayersMock } from '../../mocks/clients/mapproxyClient';
import {
  jobManagerClientMock,
  getFailedAndNotCleanedIngestionJobsMock,
  markAsCompletedMock,
  markAsCompletedAndRemoveFilesMock,
  getFailedAndNotCleanedIncomingSyncJobsMock,
} from '../../mocks/clients/jobManagerClient';
import { CleanupManager } from '../../../src/cleanupCommand/cleanupManager';

const failedJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    resourceId: 'demo_1',
    version: 'tiles',
    tasks: [],
    parameters: {
      fileNames: ['tile1.png', 'tile2.png', 'tile3.png'],
      originDirectory: 'fakeDir1/fakeDir2',
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Failed',
    reason: '',
    isCleaned: true,
  },
  {
    id: '8ca6057a-e464-4682-8f11-a9754a88171e',
    resourceId: 'demo_2',
    version: 'tiles',
    tasks: [],
    parameters: {
      fileNames: ['tile4.png', 'tile5.png', 'tile6.png'],
      originDirectory: 'fakeDir3/fakeDir4',
    },
    created: '2021-04-11T13:11:06.614Z',
    updated: '2021-04-11T13:11:06.614Z',
    status: 'Failed',
    reason: '',
    isCleaned: true,
  },
  {
    id: 'e429f88c-3c8c-49f7-9afe-aac6fc786467',
    resourceId: 'demo_3',
    version: 'tiles',
    tasks: [],
    parameters: {
      fileNames: ['tile7.png', 'tile8.png', 'tile9.png'],
      originDirectory: 'fakeDir5/fakeDir6',
    },
    created: '2021-04-11T12:10:06.614Z',
    updated: '2021-04-11T12:10:06.614Z',
    status: 'Failed',
    reason: '',
    isCleaned: true,
  },
];

describe('CleanupManager', () => {
  const tileProviderMock = createStorageProviderMock();
  const sourcesProviderMock = createStorageProviderMock();

  let manager: CleanupManager;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
  });

  beforeEach(() => {
    initConfig();
    setConfigValue('batch_size.discreteLayers', 100);
    manager = new CleanupManager(
      tileProviderMock.providerMock,
      sourcesProviderMock.providerMock,
      configMock,
      mapproxyClientMock,
      jobManagerClientMock
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('cleanFailedIngestionTasks', () => {
    it('failed job sources will be deleted only for expired failed jobs', async () => {
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(failedJobs);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await manager.cleanFailedIngestionTasks();

      const expiredJobs = [failedJobs[2]];
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expiredJobs);
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(failedJobs);
      expect(deleteLayersMock).toHaveBeenCalledWith(failedJobs);
      expect(markAsCompletedAndRemoveFilesMock).toHaveBeenCalledWith(expiredJobs);
    });
  });

  describe('cleanFailedIncomingSyncTasks', () => {
    it('expired failed jobs tiles will be deleted', async () => {
      getFailedAndNotCleanedIncomingSyncJobsMock.mockResolvedValue(failedJobs);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await manager.cleanFailedIncomingSyncTasks();

      const expiredJobs = [failedJobs[2]];
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expiredJobs);
      expect(deleteLayersMock).toHaveBeenCalledWith(failedJobs);
      expect(markAsCompletedMock).toHaveBeenCalledWith(expiredJobs);
    });
  });
});
