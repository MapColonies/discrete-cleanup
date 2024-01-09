import { IDataLocation, IJob, ITilesLocation, IWithCleanDataIngestionParams } from '../src/common/interfaces';

const discreteArray = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    resourceId: 'demo_1',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        updateDate: '2021-03-15T08:06:29.117Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile1.png', 'tile2.png', 'tile3.png'],
      originDirectory: 'fakeDir1/fakeDir2',
      metadata: {
        id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
        productId: 'demo_1',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
      },
      cleanupData: {
        previousRelativePath: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
  {
    id: '8ca6057a-e464-4682-8f11-a9754a88171e',
    resourceId: 'demo_2',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        updateDate: '2021-03-15T08:06:29.117Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile4.png', 'tile5.png', 'tile6.png'],
      originDirectory: 'fakeDir3/fakeDir4',
      metadata: {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        productId: 'demo_2',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: '8ca6057a-e464-4682-8f11-a9754a88171e',
      },
      cleanupData: {
        previousRelativePath: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
  {
    id: 'e429f88c-3c8c-49f7-9afe-aac6fc786467',
    resourceId: 'demo_3',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        updateDate: '2021-03-15T08:06:29.117Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile7.png', 'tile8.png', 'tile9.png'],
      originDirectory: 'fakeDir5/fakeDir6',
      metadata: {
        id: 'e429f88c-3c8c-49f7-9afe-aac6fc786467',
        productId: 'demo_3',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
      },
      cleanupData: {
        previousRelativePath: 'e429f88c-3c8c-49f7-9afe-aac6fc786467',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
  {
    id: 'edf1d872-2b8a-4556-a3d6-4bb3f198c00e',
    resourceId: 'demo_4',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        created: '2021-04-25T13:10:06.614Z',
        updated: '2021-04-25T13:10:06.614Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile10.png', 'tile11.png', 'tile12.png'],
      originDirectory: 'fakeDir7/fakeDir8',
      metadata: {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        productId: 'demo_4',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: 'edf1d872-2b8a-4556-a3d6-4bb3f198c00e',
      },
      cleanupData: {
        previousRelativePath: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
  {
    id: 'bab81024-eb0b-4362-a682-25d411f40d34',
    resourceId: 'demo_5',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        created: '2021-04-25T13:10:06.614Z',
        updated: '2021-04-25T13:10:06.614Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile13.png', 'tile14.png', 'tile15.png'],
      originDirectory: 'fakeDir9/fakeDir10',
      metadata: {
        id: 'bab81024-eb0b-4362-a682-25d411f40d34',
        productId: 'demo_5',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
      },
      cleanupData: {
        previousRelativePath: 'bab81024-eb0b-4362-a682-25d411f40d34',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
  {
    id: 'demo_6',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        minZoom: 0,
        maxZoom: 8,
        updateDate: '2021-03-15T08:06:29.117Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile16.png', 'tile17.png', 'tile18.png'],
      originDirectory: 'fakeDir11/fakeDir12',
      metadata: {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        productId: 'demo_6',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
        displayPath: 'bab81024-eb0b-4362-a682-25d411f40d34',
      },
      cleanupData: {
        previousRelativePath: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
] as unknown as IJob<IWithCleanDataIngestionParams>[];

const discreteSourcesLocationsArray = [
  {
    directory: discreteArray[0].parameters.originDirectory,
  },
  {
    directory: discreteArray[1].parameters.originDirectory,
  },
  {
    directory: discreteArray[2].parameters.originDirectory,
  },
  {
    directory: discreteArray[3].parameters.originDirectory,
  },
  {
    directory: discreteArray[4].parameters.originDirectory,
  },
  {
    directory: discreteArray[5].parameters.originDirectory,
  },
] as unknown as IDataLocation[];

const discreteTilesArray = [
  {
    directory: 'uuid1',
    subDirectory: 'uuid11',
  },
  {
    directory: 'uuid2',
    subDirectory: 'uuid22',
  },
  {
    directory: 'uuid3',
    subDirectory: 'uuid33',
  },
  {
    directory: 'uuid4',
    subDirectory: 'uuid44',
  },
  {
    directory: 'uuid5',
    subDirectory: 'uuid55',
  },
  {
    directory: 'uuid6',
    subDirectory: 'uuid66',
  },
] as unknown as ITilesLocation[];

const swapDiscreteArray = [
  {
    id: '37451d7f-aaa3-4bc6-9e68-7cb5eae764b1',
    resourceId: 'demo_1',
    version: 'tiles',
    tasks: [
      {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        parameters: {
          minZoom: 0,
          maxZoom: 8,
        },
        updateDate: '2021-03-15T08:06:29.117Z',
        status: 'Pending',
        reason: '',
        attempts: 0,
      },
    ],
    parameters: {
      fileNames: ['tile1.png', 'tile2.png', 'tile3.png'],
      originDirectory: 'fakeDir1/fakeDir2',
      metadata: {
        id: 'a9ec652c-e3e8-479f-a14d-b504514ab4af',
        productId: 'demo_1',
        productVersion: '5.0',
        productType: 'OrthophotoHistory',
      },
      cleanupData: {
        previousRelativePath: 'a38a5d82-e047-4714-855a-a39d3395899e',
        previousProductVersion: '4.0',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
];

const discreteTilesLocationsArray = [
  {
    directory: discreteArray[0].parameters.metadata.id,
    subDirectory: discreteArray[0].parameters.metadata.displayPath,
  },
  {
    directory: discreteArray[1].parameters.metadata.id,
    subDirectory: discreteArray[1].parameters.metadata.displayPath,
  },
  {
    directory: discreteArray[2].parameters.metadata.id,
    subDirectory: discreteArray[2].parameters.metadata.displayPath,
  },
  {
    directory: discreteArray[3].parameters.metadata.id,
    subDirectory: discreteArray[3].parameters.metadata.displayPath,
  },
  {
    directory: discreteArray[4].parameters.metadata.id,
    subDirectory: discreteArray[4].parameters.metadata.displayPath,
  },
  {
    directory: discreteArray[5].parameters.metadata.id,
    subDirectory: discreteArray[5].parameters.metadata.displayPath,
  },
] as unknown as IDataLocation[];

const urisArray = [
  '/tiffs/fakeDir1/fakeDir2',
  '/tiffs/fakeDir3/fakeDir4',
  '/tiffs/fakeDir5/fakeDir6',
  '/tiffs/fakeDir7/fakeDir8',
  '/tiffs/fakeDir9/fakeDir10',
  '/tiffs/fakeDir11/fakeDir12',
];

const urisFsArray = [
  '/tiffs/uuid1/uuid11',
  '/tiffs/uuid2/uuid22',
  '/tiffs/uuid3/uuid33',
  '/tiffs/uuid4/uuid44',
  '/tiffs/uuid5/uuid55',
  '/tiffs/uuid6/uuid66',
];

const s3KeysArray = urisArray.map((uri) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { Key: uri };
});

export {
  discreteArray,
  discreteSourcesLocationsArray,
  discreteTilesLocationsArray,
  discreteTilesArray,
  swapDiscreteArray,
  urisArray,
  urisFsArray,
  s3KeysArray,
};
