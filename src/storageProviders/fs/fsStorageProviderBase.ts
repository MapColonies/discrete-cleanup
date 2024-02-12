import { promises } from 'node:fs';
import { Logger } from '@map-colonies/js-logger';
import { inject } from 'tsyringe';
import { IStorageProvider } from '../iStorageProvider';
import { IDataLocation } from '../../common/interfaces';
import { SERVICES } from '../../common/constants';
import { IConfig } from '../../common/interfaces';

export abstract class FsStorageProviderBase implements IStorageProvider {
  private readonly disableSourcesCleanup: boolean;
  public constructor(@inject(SERVICES.CONFIG) protected readonly config: IConfig, protected batchSize: number, protected logger: Logger) {
    this.disableSourcesCleanup = this.config.get<boolean>('disableCleanup.sources');
  }

  public async deleteDiscretes(discreteLocationArray: IDataLocation[]): Promise<void> {
    if (this.disableSourcesCleanup) {
      this.logger.info({ msg: 'Sources cleanup is disabled' });
      return;
    }
    const directories = this.concatDirectories(discreteLocationArray);
    this.logger.info({ msg: `Deleting FS directories for provided directories`, directories });
    let batchArray = [];
    for (let i = 0; i < directories.length; i += this.batchSize) {
      batchArray = directories.slice(i, i + this.batchSize);
      this.logger.info(`Deleting directories from FS in path: [${batchArray.join(',')}]`);

      const promiseDeleteArray = batchArray.map(async (directory: string) => promises.rm(directory, { recursive: true, force: true }));
      await Promise.all(promiseDeleteArray);
    }
  }

  protected abstract concatDirectories(discreteLocationArray: IDataLocation[]): string[];
}
