import path from 'node:path';
import { Logger } from '@map-colonies/js-logger';
import { inject } from 'tsyringe';
import { SERVICES } from '../../common/constants';
import { IConfig, IDataLocation } from '../../common/interfaces';
import { FsStorageProviderBase } from './fsStorageProviderBase';

export class FsSourcesStorageProvider extends FsStorageProviderBase {
  protected readonly fsSourcesLocation: string;
  protected readonly disableSourcesCleanup: boolean;

  public constructor(@inject(SERVICES.LOGGER) logger: Logger, @inject(SERVICES.CONFIG) protected readonly config: IConfig) {
    super(config.get<number>('batch_size.tiffDirectoryDeletion'), logger);
    this.fsSourcesLocation = this.config.get<string>('fs.sources_location');
    this.disableSourcesCleanup = this.config.get<boolean>('disableSourcesCleanup');
  }

  public async deleteDiscretes(discreteLocationArray: IDataLocation[]): Promise<void> {
    if (this.disableSourcesCleanup) {
      this.logger.info({ msg: 'sources deletion is disabled' });
      return;
    }
    await super.deleteDiscretes(discreteLocationArray);
  }

  protected concatDirectories(discreteLocationArray: IDataLocation[]): string[] {
    const directories = discreteLocationArray.map((discrete) => {
      return path.join(this.fsSourcesLocation, discrete.directory);
    });
    return directories;
  }
}
