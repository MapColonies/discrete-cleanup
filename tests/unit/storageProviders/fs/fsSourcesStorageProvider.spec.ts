import fs from 'node:fs';
import path from 'node:path';
import jsLogger from '@map-colonies/js-logger';
import { FsSourcesStorageProvider } from '../../../../src/storageProviders/fs/fsSourcesStorageProvider';
import { configMock, initConfig, setConfigValue } from '../../../mocks/config';
import { discreteSourcesLocationsArray, urisArray } from '../../../testData';

const logger = jsLogger({ enabled: false });
let deleteDirMock: jest.SpyInstance;
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention
let fsSourcesStorageProvider: FsSourcesStorageProvider;

describe('fsSourcesStorageProvider', () => {
  beforeEach(() => {
    initConfig();
    deleteDirMock = jest.spyOn(fs.promises, 'rm').mockResolvedValue(undefined);
    jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    fsSourcesStorageProvider = new FsSourcesStorageProvider(logger, configMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  describe('deleteDiscretesWithSourcesDeletion', () => {
    beforeAll(() => {
      setConfigValue('disableCleanup.sources', false);
    });

    it('Checks tiffs deletion functionality', async () => {
      await fsSourcesStorageProvider.deleteDiscretes(discreteSourcesLocationsArray);

      expect(deleteDirMock).toHaveBeenCalledTimes(urisArray.length);
      for (const uri of urisArray) {
        expect(deleteDirMock).toHaveBeenCalledWith(uri, { recursive: true, force: true });
      }
    });
  });

  describe('deleteDiscretesWithoutSourcesDeletion', () => {
    beforeAll(() => {
      setConfigValue('disableCleanup.sources', true);
    });
    it('does not delete sources when cleanup is disabled', async () => {
      await fsSourcesStorageProvider.deleteDiscretes(discreteSourcesLocationsArray);
      expect(deleteDirMock).not.toHaveBeenCalled();
    });
  });
});
