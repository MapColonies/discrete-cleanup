import { IDataLocation } from '../common/interfaces';

export interface IStorageProvider {
  deleteDiscretes: (discreteLocationArray: IDataLocation[]) => Promise<void>;
}
