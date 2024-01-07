import fs from 'fs';
import path from 'path';
import jsLogger from '@map-colonies/js-logger';
import { FsSourcesStorageProvider } from '../../../../src/storageProviders/fs/fsSourcesStorageProvider';
import { configMock, initConfig } from '../../../mocks/config';
import { discreteSourcesLocationsArray, urisArray } from '../../../testData';

const logger = jsLogger({ enabled: false });
let deleteDirMock: jest.SpyInstance;
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention
let fsSourcesStorageProvider: FsSourcesStorageProvider;

describe('fsSourcesStorageProvider', () => {
  beforeEach(() => {
    initConfig();
    deleteDirMock = jest.spyOn(fs.promises, 'rmdir').mockResolvedValue(undefined);
    jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    fsSourcesStorageProvider = new FsSourcesStorageProvider(logger, configMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Checks tiffs deletion functionality', async () => {
    await fsSourcesStorageProvider.deleteDiscretes(discreteSourcesLocationsArray);

    expect(deleteDirMock).toHaveBeenCalledTimes(urisArray.length);
    for (const uri of urisArray) {
      expect(deleteDirMock).toHaveBeenCalledWith(uri, { recursive: true });
    }
  });
});
