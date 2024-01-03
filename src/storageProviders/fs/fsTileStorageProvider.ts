import path from 'path';
import { Logger } from '@map-colonies/js-logger';
// import { IngestionParams } from '@map-colonies/mc-model-types';
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
  
  // protected parseLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): string[] {
  //   const directories = discreteArray.map((discrete) => {
  //     return path.join(this.fsTilesLocation, discrete.parameters.metadata.id as string, discrete.parameters.metadata.displayPath as string);
  //   });
  //   return directories;
  // }

  // protected parsePreviousLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): string[] {
  //   const directories = discreteArray
  //     .filter((v) => v.parameters.cleanupData)
  //     .map((directory) => {
  //       return path.join(
  //         this.fsTilesLocation,
  //         directory.parameters.metadata.id as string,
  //         directory.parameters.cleanupData?.previousRelativePath as string
  //       );
  //     });
  //   return directories;
  // }
}
