import { promises } from 'fs';
import path from 'path';
import jsLogger from '@map-colonies/js-logger';
import { FsSourcesStorageProvider } from '../../../../src/storageProviders/fs/fsSourcesStorageProvider';
import { configMock, initConfig } from '../../../mocks/config';
import { discreteArray, urisArray } from '../../../testData';

const logger = jsLogger({ enabled: false });
let deleteDirMock: jest.SpyInstance;
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention
let fsSourcesStorageProvider: FsSourcesStorageProvider;

describe('fsSourcesStorageProvider', () => {
  beforeEach(() => {
    initConfig();
    deleteDirMock = jest.spyOn(promises, 'rmdir').mockResolvedValue(undefined);
    jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));
    fsSourcesStorageProvider = new FsSourcesStorageProvider(logger, configMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Checks tiffs parser functionality', async () => {
    await fsSourcesStorageProvider.deleteDiscretes(discreteArray);

    expect(deleteDirMock).toHaveBeenCalledTimes(urisArray.length);
    for (const uri of urisArray) {
      expect(deleteDirMock).toHaveBeenCalledWith(uri, { recursive: true });
    }
  });
});
