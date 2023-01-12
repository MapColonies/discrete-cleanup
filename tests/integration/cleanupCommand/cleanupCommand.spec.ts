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
  getSuccessNotCleanedIngestionJobsMock,
  getFailedAndNotCleanedIncomingSyncJobsMock,
  markAsCompletedMock,
} from '../../mocks/clients/jobManagerClient';
import { mapproxyClientMock, deleteLayersMock } from '../../mocks/clients/mapproxyClient';
import { initConfig, configMock, setConfigValue } from '../../mocks/config';
import { discreteArray } from '../../testData';
import { CleanupCommandCliTrigger } from './helpers/CliTrigger';

describe('CleanupCommand', function () {
  let cli: CleanupCommandCliTrigger;
  let processExitMock: jest.SpyInstance;
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
    it('cleaned uncleaned discretes', async function () {
      jest.setSystemTime(new Date('2021-04-25T13:10:06.614Z'));
      setConfigValue('batch_size.discreteLayers', 100);
      setConfigValue('failed_cleanup_delay_days.ingestion', 14);
      setConfigValue('failed_cleanup_delay_days.sync', 14);
      const failedAndNotCleaned = discreteArray.slice(0, 2);
      const successAndNotCleaned = discreteArray.slice(2, 4);
      const failedSyncAndNotCleaned = discreteArray.slice(4);
      getFailedAndNotCleanedIngestionJobsMock.mockResolvedValue(failedAndNotCleaned);
      getSuccessNotCleanedIngestionJobsMock.mockResolvedValue(successAndNotCleaned);
      getFailedAndNotCleanedIncomingSyncJobsMock.mockResolvedValue(failedSyncAndNotCleaned);
      deleteLayersMock.mockResolvedValue([]);
      markAsCompletedMock.mockResolvedValue(undefined);

      await cli.cleanup();

      expect(tileProvider.deleteDiscretesMock).toHaveBeenCalledTimes(1);
      expect(tileProvider.deleteDiscretesMock).toHaveBeenCalledWith(failedAndNotCleaned);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenCalledTimes(2);
      expect(sourcesProvider.deleteDiscretesMock).toHaveBeenCalledWith(successAndNotCleaned);
    });
  });
});
