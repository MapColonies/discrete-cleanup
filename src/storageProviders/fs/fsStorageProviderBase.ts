import { promises, existsSync } from 'fs';
import { Logger } from '@map-colonies/js-logger';
// import { IngestionParams } from '@map-colonies/mc-model-types';
import { IJob, IWithCleanDataIngestionParams } from '../../common/interfaces';
import { IStorageProvider } from '../iStorageProvider';

export abstract class FsStorageProviderBase implements IStorageProvider {
  public constructor(protected batchSize: number, protected logger: Logger) {}

  public async deleteDiscretes(discreteArray: IJob<IWithCleanDataIngestionParams>[], isSwappedDeletion = false): Promise<void> {
    const directories = isSwappedDeletion ? this.parsePreviousLocation(discreteArray) : this.parseLocation(discreteArray);
    let batchArray = [];
    for (let i = 0; i < directories.length; i += this.batchSize) {
      batchArray = directories.slice(i, i + this.batchSize);
      this.logger.info(`Deleting directories from FS in path: [${batchArray.join(',')}]`);
      const promiseDeleteArray = batchArray.map(async (directory: string) =>
        existsSync(directory) ? promises.rmdir(directory, { recursive: true }) : this.logger.warn(`Current directory: ${directory} is not exists!`)
      );
      await Promise.all(promiseDeleteArray);
    }
  }

  protected abstract parseLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): string[];
  protected abstract parsePreviousLocation(discreteArray: IJob<IWithCleanDataIngestionParams>[]): string[];
}
