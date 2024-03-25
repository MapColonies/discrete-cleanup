import jsLogger from '@map-colonies/js-logger';
import { container } from 'tsyringe';
import { trace } from '@opentelemetry/api';

import { getApp } from '../../../src/app';
import { JobManagerClient } from '../../../src/clients/jobManagerClient';
import { MapproxyClient } from '../../../src/clients/mapproxyClient';
import { SERVICES } from '../../../src/common/constants';
import { createStorageProviderMock, IStorageProviderMock } from '../../mocks/storageProviders/providerMockGenerator';
import {
  jobManagerClientMock,
  getFailedAndNotCleanedIngestionJobsMock,
  getSuccessNotCleanedJobsMock,
  getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompletedMock,
  getInProgressJobsMock,
} from '../../mocks/clients/jobManagerClient';
import { mapproxyClientMock, deleteLayersMock } from '../../mocks/clients/mapproxyClient';
import { initConfig, configMock, setConfigValue } from '../../mocks/config';
import { discreteArray, swapDiscreteArray } from '../../testData';
import { IDataLocation, ITilesLocation } from '../../../src/common/interfaces';
import { CleanupManager } from '../../../src/cleanupCommand/cleanupManager';
import { CleanupCommandCliTrigger } from './helpers/CliTrigger';

describe('CleanupCommand', function () {
  let cli: CleanupCommandCliTrigger;
  let processExitMock: jest.SpyInstance;
  let isIncludedInBlacklistSpy: jest.SpyInstance;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let tileProvider: IStorageProviderMock;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  let sourcesProvider: IStorageProviderMock;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(function () {
    jest.spyOn(global.console, 'error').mockReturnValue(undefined); // prevent cli error logs from messing with test log on bad path tests
    processExitMock = jest.spyOn(global.process, 'exit');
    processExitMock.mockReturnValueOnce(undefined); //prevent cli exit from killing the test

    initConfig();
    tileProvider = createStorageProviderMock();
    sourcesProvider = createStorageProviderMock();

    container.registerInstance(JobManagerClient, jobManagerClientMock);
    container.registerInstance(MapproxyClient, mapproxyClientMock);

    const app = getApp({
      override: [
        { token: SERVICES.CONFIG, provider: { useValue: configMock } },
        { token: SERVICES.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: SERVICES.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
        { token: SERVICES.TILE_PROVIDER, provider: { useValue: tileProvider.providerMock } },
        { token: SERVICES.SOURCES_PROVIDER, provider: { useValue: sourcesProvider.providerMock } },
        { token: JobManagerClient, provider: { useValue: jobManagerClientMock } },
        { token: MapproxyClient, provider: { useValue: mapproxyClientMock } },
      ],
      useChild: true,
    });

    cli = new CleanupCommandCliTrigger(app);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Happy Path', function () {
    setConfigValue('cleanupTypes.failedIngestionTasks', true);
    setConfigValue('cleanupTypes.successfulIngestion', true);
    setConfigValue('cleanupTypes.failedIncomingSyncTasks', true);
    setConfigValue('cleanupTypes.successfulSwapUpdate', true);

    it('cleaned uncleaned discretes', async function () {
      jest.setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
      setConfigValue('batch_size.discreteLayers', 100);
      setConfigValue('failed_cleanup_delay_days.ingestion', 14);
      setConfigValue('failed_cleanup_delay_days.sync', 14);
      setConfigValue('success_cleanup_delay_days.ingestion', 0);
      const failedAndNotCleaned = discreteArray.slice(0, 2);
      const successAndNotCleaned = discreteArray.slice(2, 4);
      const failedSyncAndNotCleaned = discreteArray.slice(4);
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(failedAndNotCleaned);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce(successAndNotCleaned);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce(successAndNotCleaned);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce(swapDiscreteArray);
      getFailedAndNotCleanedIncomingSyncJobsMock.mockResolvedValue(failedSyncAndNotCleaned);
      getInProgressJobsMock.mockResolvedValue([]);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await cli.cleanup();

      const expectedSwappedTilesLocations = [
        { directory: swapDiscreteArray[0].parameters.metadata.id, subDirectory: swapDiscreteArray[0].parameters.cleanupData.previousRelativePath },
      ];

      const expectedSwappedSourcesLocations = [{ directory: swapDiscreteArray[0].parameters.originDirectory }];

      const expectedSucceededTilesLocations = [
        { directory: successAndNotCleaned[0].parameters.originDirectory },
        { directory: successAndNotCleaned[1].parameters.originDirectory },
      ];

      expect(tileProvider.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedSwappedTilesLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenCalledTimes(3);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedSucceededTilesLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(2, expectedSucceededTilesLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(3, expectedSwappedSourcesLocations);
    });

    it('clean failed expired discretes tasks', async function () {
      jest.setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
      setConfigValue('batch_size.discreteLayers', 100);
      setConfigValue('failed_cleanup_delay_days.ingestion', 14);
      setConfigValue('failed_cleanup_delay_days.sync', 14);
      setConfigValue('success_cleanup_delay_days.ingestion', 0);
      const failedAndNotCleaned = discreteArray.slice(0, 2);
      const expiredFailedData = [
        {
          ...failedAndNotCleaned[0],
          created: '2020-04-25T13:10:06.614Z',
          updated: '2020-04-25T13:10:06.614Z',
        },
      ];
      isIncludedInBlacklistSpy = jest.spyOn(CleanupManager.prototype as unknown as { isIncludedInBlaclist: jest.Mock }, 'isIncludedInBlaclist');
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(expiredFailedData);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getFailedAndNotCleanedIncomingSyncJobsMock.mockResolvedValue([]);
      getInProgressJobsMock.mockResolvedValue([]);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await cli.cleanup();

      const expectedExpiredFailedTilesLocations: ITilesLocation[] = [
        {
          directory: expiredFailedData[0].parameters.metadata.id as string,
          subDirectory: expiredFailedData[0].parameters.metadata.displayPath as string,
        },
      ];

      const expectedExpiredFailedSourceLocations: IDataLocation[] = [{ directory: expiredFailedData[0].parameters.originDirectory }];

      expect(isIncludedInBlacklistSpy).toHaveBeenCalledTimes(2);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(1, expiredFailedData[0].parameters.originDirectory);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(2, expiredFailedData[0].parameters.originDirectory);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedExpiredFailedTilesLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenCalledTimes(2);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedExpiredFailedSourceLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedExpiredFailedSourceLocations);
    });

    it('will not clean failed expired discretes tasks that included in the blacklist', async function () {
      jest.setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
      setConfigValue('batch_size.discreteLayers', 100);
      setConfigValue('failed_cleanup_delay_days.ingestion', 14);
      setConfigValue('failed_cleanup_delay_days.sync', 14);
      setConfigValue('success_cleanup_delay_days.ingestion', 0);
      const failedAndNotCleaned = discreteArray.slice(0, 2);
      const expiredFailedData = [
        {
          ...failedAndNotCleaned[0],
          created: '2020-04-25T13:10:06.614Z',
          updated: '2020-04-25T13:10:06.614Z',
        },
      ];
      isIncludedInBlacklistSpy = jest.spyOn(CleanupManager.prototype as unknown as { isIncludedInBlaclist: jest.Mock }, 'isIncludedInBlaclist');
      isIncludedInBlacklistSpy.mockReturnValue(true);
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(expiredFailedData);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getSuccessNotCleanedJobsMock.mockResolvedValueOnce([]);
      getFailedAndNotCleanedIncomingSyncJobsMock.mockResolvedValue([]);
      getInProgressJobsMock.mockResolvedValue([]);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await cli.cleanup();

      const expectedExpiredFailedTilesLocations: ITilesLocation[] = [
        {
          directory: expiredFailedData[0].parameters.metadata.id as string,
          subDirectory: expiredFailedData[0].parameters.metadata.displayPath as string,
        },
      ];

      expect(isIncludedInBlacklistSpy).toHaveBeenCalledTimes(2);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(1, expiredFailedData[0].parameters.originDirectory);
      expect(isIncludedInBlacklistSpy).toHaveBeenNthCalledWith(2, expiredFailedData[0].parameters.originDirectory);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, expectedExpiredFailedTilesLocations);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenCalledTimes(2);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(1, []);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenNthCalledWith(2, []);
    });
  });
});
