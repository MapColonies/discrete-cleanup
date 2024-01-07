import { promises, existsSync } from 'fs';
import { Logger } from '@map-colonies/js-logger';
import { IStorageProvider } from '../iStorageProvider';
import { IDataLocation } from '../../common/interfaces';

export abstract class FsStorageProviderBase implements IStorageProvider {
  public constructor(protected batchSize: number, protected logger: Logger) {}

  public async deleteDiscretes(discreteLocationArray: IDataLocation[]): Promise<void> {
    const directories = this.concatDirectories(discreteLocationArray);
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

  protected abstract concatDirectories(discreteLocationArray: IDataLocation[]): string[];
}
