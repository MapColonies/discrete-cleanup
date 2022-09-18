import path from 'path';
import { Logger } from '@map-colonies/js-logger';
import { IngestionParams } from '@map-colonies/mc-model-types';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig, IJob } from '../../common/interfaces';
import { FsStorageProviderBase } from './fsStorageProviderBase';

export class FsTileStorageProvider extends FsStorageProviderBase {
  protected readonly fsTilesLocation: string;

  public constructor(@inject(SERVICES.LOGGER) logger: Logger, @inject(SERVICES.CONFIG) protected readonly config: IConfig) {
    super(config.get<number>('batch_size.tilesDeletion'), logger);
    this.fsTilesLocation = this.config.get<string>('fs.tiles_location');
  }

  protected parseLocation(discreteArray: IJob<IngestionParams>[]): string[] {
    const directories = discreteArray.map((discrete) => {
      return path.join(this.fsTilesLocation, discrete.parameters.layerRelativePath);
    });
    return directories;
  }
}
