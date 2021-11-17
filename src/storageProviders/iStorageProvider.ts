import { IngestionParams } from '@map-colonies/mc-model-types';
import { IJob } from '../common/interfaces';

export interface IStorageProvider {
  deleteDiscretes: (discreteArray: IJob<IngestionParams>[]) => Promise<void>;
}
