// import { IngestionParams } from '@map-colonies/mc-model-types';
import { IJob, IWithCleanDataIngestionParams } from '../common/interfaces';

export interface IStorageProvider {
  deleteDiscretes: (discreteArray: IJob<IWithCleanDataIngestionParams>[], isSwappedDeletion: boolean) => Promise<void>;
}
