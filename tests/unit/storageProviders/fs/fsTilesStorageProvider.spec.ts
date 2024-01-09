import fs from 'node:fs';
import path from 'node:path';
import jsLogger from '@map-colonies/js-logger';
import { FsTileStorageProvider } from '../../../../src/storageProviders/fs/fsTileStorageProvider';
import { configMock, initConfig } from '../../../mocks/config';
import { discreteTilesArray, urisFsArray } from '../../../testData';

const logger = jsLogger({ enabled: false });
let deleteDirMock: jest.SpyInstance;
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention
let fsTileStorageProvider: FsTileStorageProvider;

describe('fsSourcesStorageProvider', () => {
  beforeEach(() => {
    initConfig();
    deleteDirMock = jest.spyOn(fs.promises, 'rm').mockResolvedValue(undefined);
    jest.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));

    fsTileStorageProvider = new FsTileStorageProvider(logger, configMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Checks tiles deletion functionality', async () => {
    await fsTileStorageProvider.deleteDiscretes(discreteTilesArray);

    expect(deleteDirMock).toHaveBeenCalledTimes(urisFsArray.length);
    for (const uri of urisFsArray) {
      expect(deleteDirMock).toHaveBeenCalledWith(uri, { recursive: true, force: true });
    }
  });
});
