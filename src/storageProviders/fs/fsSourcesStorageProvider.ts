import path from 'node:path';
import { Logger } from '@map-colonies/js-logger';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig, IDataLocation } from '../../common/interfaces';
import { FsStorageProviderBase } from './fsStorageProviderBase';

export class FsSourcesStorageProvider extends FsStorageProviderBase {
  protected readonly fsSourcesLocation: string;

  public constructor(@inject(SERVICES.LOGGER) logger: Logger, @inject(SERVICES.CONFIG) protected readonly config: IConfig) {
    super(config.get<number>('batch_size.tiffDirectoryDeletion'), logger);
    this.fsSourcesLocation = this.config.get<string>('fs.sources_location');
  }

  protected concatDirectories(discreteLocationArray: IDataLocation[]): string[] {
    const directories = discreteLocationArray.map((discrete) => {
      return path.join(this.fsSourcesLocation, discrete.directory);
    });
    return directories;
  }
}
