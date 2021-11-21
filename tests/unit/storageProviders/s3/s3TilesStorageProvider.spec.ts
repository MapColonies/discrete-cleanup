import jsLogger from '@map-colonies/js-logger';
import { S3TileStorageProvider } from '../../../../src/storageProviders/s3/s3TileStorageProvider';
import { configMock, initConfig, setConfigValue } from '../../../mocks/config';
import { s3Mock, initS3Mock, listObjectsV2PromiseMock, listObjectsV2Mock } from '../../../mocks/s3';
import { discreteArray, s3KeysArray } from '../../../testData';

jest.mock('aws-sdk', () => {
  return {
    ...jest.requireActual<Record<string, unknown>>('aws-sdk'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    S3: jest.fn(() => s3Mock),
  };
});

const logger = jsLogger({ enabled: false });
//fix linter dont liking variable names with "Provider"
// eslint-disable-next-line @typescript-eslint/naming-convention
let tileStorageProvider: S3TileStorageProvider;

describe('tile deletion', () => {
  beforeEach(() => {
    initConfig();
    initS3Mock();
    setConfigValue('s3', {
      bucket: 'testBucket',
    });
    setConfigValue('batch_size.tilesDeletion', 100);
    tileStorageProvider = new S3TileStorageProvider(configMock, logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Should process next S3 delete batch with correct continuation token', async () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    listObjectsV2PromiseMock
      .mockResolvedValueOnce({
        Contents: s3KeysArray,
        NextContinuationToken: 123456,
      })
      .mockResolvedValueOnce({
        Contents: [],
        NextContinuationToken: 789,
      });
    const testDiscretes = [discreteArray[0]];

    await tileStorageProvider.deleteDiscretes(testDiscretes);

    const expectedPrefix = [
      testDiscretes[0].parameters.metadata.productId as string,
      testDiscretes[0].parameters.metadata.productVersion as string,
      testDiscretes[0].parameters.metadata.productType as string,
    ].join('/');
    expect(listObjectsV2Mock).toHaveBeenCalledTimes(2);
    expect(listObjectsV2Mock).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      MaxKeys: 100,
      Prefix: expectedPrefix,
    });
    expect(listObjectsV2Mock).toHaveBeenCalledWith({
      Bucket: 'testBucket',
      MaxKeys: 100,
      Prefix: expectedPrefix,
      ContinuationToken: 123456,
    });
    /* eslint-enable @typescript-eslint/naming-convention */
  });
});
