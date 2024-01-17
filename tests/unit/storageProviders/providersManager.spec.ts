import jsLogger from '@map-colonies/js-logger';
import { getProviders } from '../../../src/storageProviders/providersManager';
import { configMock, initConfig, setConfigValue } from '../../mocks/config';

const logger = jsLogger({ enabled: false });
let pushMock: jest.SpyInstance;
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention

describe('providersManager', () => {
  beforeEach(() => {
    initConfig();
    pushMock = jest.spyOn(Array.prototype, 'push');
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Checks getting S3 tiles location providers', () => {
    setConfigValue('tiles_storage_provider', 'S3');
    const res = getProviders(configMock, logger);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect((res[1].provider as unknown as { useValue: Record<string, unknown> }).useValue.s3Config !== undefined).toBe(true);
    expect((res[1].provider as unknown as { useValue: Record<string, unknown> }).useValue.fsTilesLocation).toBeUndefined();
  });

  it('Checks getting FS tiles location providers', () => {
    setConfigValue('tiles_storage_provider', 'FS');
    setConfigValue('fs.tiles_location', '/tiles');

    const res = getProviders(configMock, logger);

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect((res[1].provider as unknown as { useValue: Record<string, unknown> }).useValue.fsTilesLocation).toBe('/tiles');
    expect((res[1].provider as unknown as { useValue: Record<string, unknown> }).useValue.s3Config === undefined).toBe(true);
  });

  it('Checks getting exception for invalid tiles location providers', () => {
    setConfigValue('tiles_storage_provider', 'notValid');
    const res = () => getProviders(configMock, logger);
    expect(res).toThrow(Error);
    expect(res).toThrow('invalid tile provider configuration: notValid');
  });
});
