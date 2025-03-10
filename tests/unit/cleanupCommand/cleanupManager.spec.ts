import jsLogger from '@map-colonies/js-logger';
import { configMock, initConfig, setConfigValue } from '../../mocks/config';
import { createStorageProviderMock } from '../../mocks/storageProviders/providerMockGenerator';
import { mapproxyClientMock, deleteLayersMock } from '../../mocks/clients/mapproxyClient';
import {
  jobManagerClientMock,
  getFailedAndNotCleanedIngestionJobsMock,
  markAsCompletedMock,
  markAsCompletedAndRemoveFilesMock,
  getSuccessNotCleanedJobsMock,
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
      metadata: {
        id: '8ca6057a-e464-4682-8f11-a9754a88171e',
        displayPath: '2c8d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4sed',
      },
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
      metadata: {
        id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
        displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
      },
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
      metadata: {
        id: '2c8d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4sed',
        displayPath: '1r6d6bcd-bbfd-4b2d-9b5d-ab8dfbbd1rfd',
      },
    },
    created: '2021-04-11T12:10:06.614Z',
    updated: '2021-04-11T12:10:06.614Z',
    status: 'Failed',
    reason: '',
    isCleaned: true,
  },
];

const ingestionNewJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
    resourceId: 'new_layer',
    version: '5.0',
    tasks: [],
    parameters: {
      metadata: {
        productId: 'new_layer',
        id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
        displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
      },
      fileNames: ['tile1.jpeg', 'tile2.jpeg', 'tile3.jpeg'],
      originDirectory: 'some_black_directory',
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: false,
  },
];

const updateSwapJobs = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
    resourceId: 'demo_1',
    version: '5.0',
    tasks: [],
    parameters: {
      metadata: {
        productId: 'demo_1',
        id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
        displayPath: '3r3d6bcd-bbfd-4b2d-9b5d-ab8dfbbd5ttt',
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
    internalId: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    reason: '',
    isCleaned: false,
  },
];

describe('CleanupManager', () => {
  const tileProviderMock = createStorageProviderMock();
  const sourcesProviderMock = createStorageProviderMock();

  let manager: CleanupManager;
  let isIncludedInBlacklistSpy: jest.SpyInstance;

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
  });

  beforeEach(() => {
    initConfig();
    setConfigValue('batch_size.discreteLayers', 100);
    setConfigValue('fs.blacklist_sources_location', 'some_black_directory');
    setConfigValue('disableSourcesCleanup', false);
    const logger = jsLogger({ enabled: false });

    manager = new CleanupManager(
      tileProviderMock.providerMock,
      sourcesProviderMock.providerMock,
      configMock,
      logger,
      mapproxyClientMock,
      jobManagerClientMock
    );
    isIncludedInBlacklistSpy = jest.spyOn(CleanupManager.prototype as unknown as { isIncludedInBlacklist: jest.Mock }, 'isIncludedInBlacklist');
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
      const expectedSourceDirectories = [{ directory: expiredJobs[0].parameters.originDirectory }];
      const expectedTilesDirectories = [
        { directory: failedJobs[2].parameters.metadata.id, subDirectory: failedJobs[2].parameters.metadata.displayPath },
      ];

      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectedSourceDirectories);
      expect(isIncludedInBlacklistSpy).toHaveBeenCalledTimes(2);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(1, expiredJobs[0].parameters.originDirectory);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(2, expiredJobs[0].parameters.originDirectory);
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectedTilesDirectories);
      expect(deleteLayersMock).toHaveBeenCalledWith(expiredJobs);
      expect(markAsCompletedMock).toHaveBeenCalledWith(expiredJobs);
    });

    it('will not delete failed expired task that included in the blacklist', async () => {
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(failedJobs);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);
      isIncludedInBlacklistSpy.mockResolvedValue(true);

      await manager.cleanFailedIngestionTasks();

      const expiredJobs = [failedJobs[2]];
      const expectedTilesDirectories = [
        { directory: failedJobs[2].parameters.metadata.id, subDirectory: failedJobs[2].parameters.metadata.displayPath },
      ];

      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([]);
      expect(isIncludedInBlacklistSpy).toHaveBeenCalledTimes(2);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(1, expiredJobs[0].parameters.originDirectory);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(2, expiredJobs[0].parameters.originDirectory);
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectedTilesDirectories);
      expect(deleteLayersMock).toHaveBeenCalledWith(expiredJobs);
      expect(markAsCompletedMock).toHaveBeenCalledWith(expiredJobs);
    });
  });

  describe('cleanWithoutSourceDeletion', () => {
    setConfigValue('disableSourcesCleanup', true);
    it('failed job sources will not be deleted', async () => {
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(failedJobs);
      deleteLayersMock.mockResolvedValue([]);
      await manager.cleanFailedIngestionTasks();

      const expiredJobs = [failedJobs[2]];
      const expectedSourceDirectories = [{ directory: expiredJobs[0].parameters.originDirectory }];

      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(2);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectedSourceDirectories);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveReturnedWith(undefined);
    });

    it('success job sources will not be deleted', async () => {
      getSuccessNotCleanedJobsMock.mockResolvedValue(ingestionNewJobs);
      markAsCompletedAndRemoveFilesMock.mockResolvedValue(undefined);
      await manager.cleanSuccessfulIngestionTasks('Ingestion_New');

      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([]);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveReturnedWith(undefined);
    });
  });

  describe('cleanSuccessIncomingIngestionTasks', () => {
    it('expired success jobs Ingestion_New', async () => {
      getSuccessNotCleanedJobsMock.mockResolvedValue(updateSwapJobs);
      markAsCompletedMock.mockResolvedValue(undefined);
      await manager.cleanSuccessfulIngestionTasks('Ingestion_New');

      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(0);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([{ directory: updateSwapJobs[0].parameters.originDirectory }]);
      expect(deleteLayersMock).toHaveBeenCalledTimes(0);
      expect(markAsCompletedMock).toHaveBeenCalledWith(updateSwapJobs);
    });

    it('expired success jobs Ingestion_New without source deletion', async () => {
      getSuccessNotCleanedJobsMock.mockResolvedValue(ingestionNewJobs);
      markAsCompletedMock.mockResolvedValue(undefined);
      await manager.cleanSuccessfulIngestionTasks('Ingestion_New');

      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([]);
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledTimes(0);
      expect(deleteLayersMock).toHaveBeenCalledTimes(0);
      expect(markAsCompletedMock).toHaveBeenCalledWith(ingestionNewJobs);
    });
  });

  describe('cleanSuccessfulSwappedLayersTasks', () => {
    it('succeeded swap updated jobs will delete old tiles and source files', async () => {
      getSuccessNotCleanedJobsMock.mockResolvedValue(updateSwapJobs);
      getInProgressJobsMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await manager.cleanSuccessfulSwappedLayersTasks('update_swap');
      const expectTilesDirectories = [
        { directory: updateSwapJobs[0].parameters.metadata.id, subDirectory: updateSwapJobs[0].parameters.cleanupData.previousRelativePath },
      ];

      const expectSourceDirectories = [{ directory: updateSwapJobs[0].parameters.originDirectory }];
      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectTilesDirectories);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith(expectSourceDirectories);

      expect(markAsCompletedMock).toHaveBeenCalledWith(updateSwapJobs);
    });

    it('succeeded swap updated jobs wont be delete old tiles and source files because running export', async () => {
      getSuccessNotCleanedJobsMock.mockResolvedValue(updateSwapJobs);
      getInProgressJobsMock.mockResolvedValue(inProgressExportJobs);
      markAsCompletedAndRemoveFilesMock.mockResolvedValue(undefined);

      await manager.cleanSuccessfulSwappedLayersTasks('update_swap');

      expect(tileProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([]);
      expect(sourcesProviderMock.deleteDiscretesMock).toHaveBeenCalledWith([]);
      expect(markAsCompletedAndRemoveFilesMock).toHaveBeenCalledTimes(0);
    });
  });
});
