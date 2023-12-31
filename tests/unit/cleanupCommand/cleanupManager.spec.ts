import { configMock, initConfig, setConfigValue } from '../../mocks/config';
import { createStorageProviderMock } from '../../mocks/storageProviders/providerMockGenerator';
import { mapproxyClientMock, deleteLayersMock } from '../../mocks/clients/mapproxyClient';
import {
  jobManagerClientMock,
  getFailedAndNotCleanedIngestionJobsMock,
  markAsCompletedMock,
  markAsCompletedAndRemoveFilesMock,
  getFailedAndNotCleanedIncomingSyncJobsMock,
  getSuccessNotCleanedIngestionJobsMock,
  getInProgressJobsMock,
} from '../../mocks/clients/jobManagerClient';
import { CleanupManager } from '../../../src/cleanupCommand/cleanupManager';

const failedJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    displayPath: '2c8d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4sed',
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
    displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
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
    displayPath: '1r6d6bcd-bbfd-4b2d-9b5d-ab8dfbbd1rfd',
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

const updateSwapJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    displayPath: '2c8d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4sed',
    resourceId: 'demo_1',
    version: '5.0',
    tasks: [],
    parameters: {
      metadata: {
        productId: 'demo_1',
      },
      fileNames: ['tile1.png', 'tile2.png', 'tile3.png'],
      originDirectory: 'fakeDir1/fakeDir2',
      cleanupData: {
        previousRelativePath: 'a38a5d82-e047-4714-855a-a39d3395899e',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: false,
  },
];

const inProgressExportJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    displayPath: '2c8d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4sed',
    resourceId: 'demo_1',
    version: '4.0',
    tasks: [],
    parameters: {
      fileNames: ['tile1.png', 'tile2.png', 'tile3.png'],
      originDirectory: 'fakeDir1/fakeDir2',
      cleanupData: {
        previousRelativePath: 'a38a5d82-e047-4714-855a-a39d3395899e',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'In-Progress',
    reason: '',
    isCleaned: false,
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
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expiredJobs, false);
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(failedJobs, false);
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
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expiredJobs, false);
      expect(deleteLayersMock).toHaveBeenCalledWith(failedJobs);
      expect(markAsCompletedMock).toHaveBeenCalledWith(expiredJobs);
    });
  });

  describe('cleanSuccessfulSwappedLayersTasks', () => {
    it('succeeded swap updated jobs will delete old tiles and source files', async () => {
      getSuccessNotCleanedIngestionJobsMock.mockResolvedValue(updateSwapJobs);
      getInProgressJobsMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await manager.cleanSuccessfulSwappedLayersTasks('update_swap');

      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(updateSwapJobs, true);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(updateSwapJobs, false);

      expect(markAsCompletedAndRemoveFilesMock).toHaveBeenCalledWith(updateSwapJobs);
    });

    it('succeeded swap updated jobs wont be delete old tiles and source files because running export', async () => {
      getSuccessNotCleanedIngestionJobsMock.mockResolvedValue(updateSwapJobs);
      getInProgressJobsMock.mockResolvedValue(inProgressExportJobs);
      markAsCompletedAndRemoveFilesMock.mockResolvedValue(undefined);

      await manager.cleanSuccessfulSwappedLayersTasks('update_swap');

      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([], true);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([], false);
      expect(markAsCompletedAndRemoveFilesMock).toHaveBeenCalledTimes(0);
    });
  });
});
