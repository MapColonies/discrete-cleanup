export enum JobStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In-Progress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  EXPIRED = 'Expired',
}

export enum StorageProviderType {
  S3 = 'S3',
  FS = 'FS',
}
