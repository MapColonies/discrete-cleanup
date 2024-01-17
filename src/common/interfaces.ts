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
<<<<<<< HEAD
export interface ITilesLocation extends IDataLocation {
  subDirectory: string;
}
=======

export interface ITilesLocation extends IDataLocation {
  subDirectory: string;
}

>>>>>>> 5c8989efdb51f70b11666503d227ad33a78d7209
export interface IWithCleanDataIngestionParams extends IngestionParams {
  cleanupData?: ICleanupData;
}
