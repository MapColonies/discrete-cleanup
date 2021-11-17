import { Logger } from '@map-colonies/js-logger';
import { SERVICES } from '../common/constants';
import { StorageProviderType } from '../common/enums';
import { IConfig } from '../common/interfaces';
import { InjectionObject } from '../common/dependencyRegistration';
import { FsTileStorageProvider } from './fs/fsTileStorageProvider';
import { S3TileStorageProvider } from './s3/s3TileStorageProvider';
import { FsSourcesStorageProvider } from './fs/fsSourcesStorageProvider';

export function getProviders(config: IConfig, logger: Logger): InjectionObject<unknown>[] {
  const providers: InjectionObject<unknown>[] = [{ token: SERVICES.SOURCES_PROVIDER, provider: FsSourcesStorageProvider }];
  const tilesProviderType = config.get<string>('tiles_storage_provider');
  switch (tilesProviderType.toUpperCase()) {
    case StorageProviderType.FS:
      providers.push({ token: SERVICES.TILE_PROVIDER, provider: FsTileStorageProvider });
      break;
    case StorageProviderType.S3:
      providers.push({ token: SERVICES.TILE_PROVIDER, provider: S3TileStorageProvider });
      break;
    default:
      logger.error(`invalid tile provider configuration: ${tilesProviderType}`);
      throw new Error(`invalid tile provider configuration: ${tilesProviderType}`);
  }
  return providers;
}
