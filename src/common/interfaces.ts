import { IngestionParams } from '@map-colonies/mc-model-types';
import { JobStatus } from './enums';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface IJob<T> {
  internalId: string | undefined;
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

export interface IWithCleanDataIngestionParams extends IngestionParams {
  cleanupData?: ICleanupData;
}
