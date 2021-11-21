import { promises } from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { IngestionParams } from '@map-colonies/mc-model-types';
import { IJob } from '../../common/interfaces';
import { IStorageProvider } from '../iStorageProvider';

export abstract class FsStorageProviderBase implements IStorageProvider {
  public constructor(protected batchSize: number, protected logger: Logger) {}

  public async deleteDiscretes(discreteArray: IJob<IngestionParams>[]): Promise<void> {
    const directories = this.parseLocation(discreteArray);
    let batchArray = [];
    for (let i = 0; i < directories.length; i += this.batchSize) {
      batchArray = directories.slice(i, i + this.batchSize);
      this.logger.info(`Deleting directories from FS in path: [${batchArray.join(',')}]`);
      const promiseDeleteArray = batchArray.map(async (directory: string) => promises.rmdir(directory, { recursive: true }));
      await Promise.all(promiseDeleteArray);
    }
  }
  protected abstract parseLocation(discreteArray: IJob<IngestionParams>[]): string[];
}
