import { IngestionParams } from '@map-colonies/mc-model-types';
import { JobStatus } from './enums';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface IJob<T> {
  id: string;
  resourceId: string;
  version: string;
  description?: string;
  parameters: T;
  reason?: string;
  created: Date;
  updated: Date;
  status: JobStatus;
  percentage?: number;
  isCleaned: boolean;
  priority: number;
  tasks?: unknown[];
}
export interface ICleanupData {
  previousRelativePath: string;
  previousProductVersion: string;
}

export interface IDataLocation {
  directory: string;
}
export interface ITilesLocation extends IDataLocation {
  subDirectory: string;
}
// TODO - Temporary implementation till it will be implemented inside mc-models on IngestionParams interface.
export interface IWithCleanDataIngestionParams extends IngestionParams {
  cleanupData?: ICleanupData;
}
