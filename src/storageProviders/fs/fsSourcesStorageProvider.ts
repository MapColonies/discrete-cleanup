import path from 'path';
import { Logger } from '@map-colonies/js-logger';
import { IngestionParams } from '@map-colonies/mc-model-types';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig, IJob } from '../../common/interfaces';
import { FsStorageProviderBase } from './fsStorageProviderBase';

export class FsSourcesStorageProvider extends FsStorageProviderBase {
  protected readonly fsSourcesLocation: string;

  public constructor(@inject(SERVICES.LOGGER) logger: Logger, @inject(SERVICES.CONFIG) protected readonly config: IConfig) {
    super(config.get<number>('batch_size.tiffDirectoryDeletion'), logger);
    this.fsSourcesLocation = this.config.get<string>('fs.sources_location');
  }

  protected parseLocation(discreteArray: IJob<IngestionParams>[]): string[] {
    const directories = discreteArray.map((discrete) => {
      return path.join(this.fsSourcesLocation, discrete.parameters.originDirectory);
    });
    return directories;
  }
}
