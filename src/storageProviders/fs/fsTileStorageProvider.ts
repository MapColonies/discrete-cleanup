import path from 'node:path';
import { Logger } from '@map-colonies/js-logger';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig, IDataLocation, ITilesLocation } from '../../common/interfaces';
import { FsStorageProviderBase } from './fsStorageProviderBase';

export class FsTileStorageProvider extends FsStorageProviderBase {
  protected readonly fsTilesLocation: string;

  public constructor(@inject(SERVICES.LOGGER) logger: Logger, @inject(SERVICES.CONFIG) protected readonly config: IConfig) {
    super(config.get<number>('batch_size.tilesDeletion'), logger);
    this.fsTilesLocation = this.config.get<string>('fs.tiles_location');
  }

  protected concatDirectories(discreteLocationArray: IDataLocation[]): string[] {
    const directories = discreteLocationArray.map((discrete) => {
      return path.join(this.fsTilesLocation, discrete.directory, (discrete as ITilesLocation).subDirectory);
    });
    return directories;
  }
}
