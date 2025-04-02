import { IJobResponse } from '@map-colonies/mc-priority-queue';
import { ExportJobParameters, IngestionNewJobParams, IngestionSwapUpdateJobParams, IngestionUpdateJobParams } from '@map-colonies/raster-shared';

export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
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

export type ExportJobResponse = IJobResponse<ExportJobParameters, unknown>;

export type JobResponse = IJobResponse<IngestionNewJobParams | IngestionUpdateJobParams | IngestionSwapUpdateJobParams, unknown>;

export type IJobResponseWithoutParams = Omit<JobResponse, 'parameters'>;
