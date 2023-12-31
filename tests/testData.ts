// import { IngestionParams } from '@map-colonies/mc-model-types';
import { IJob, IWithCleanDataIngestionParams } from '../src/common/interfaces';

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
        productId: 'demo_1',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
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
        productId: 'demo_2',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
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
        productId: 'demo_3',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
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
        productId: 'demo_4',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
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
        productId: 'demo_5',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
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
        productId: 'demo_6',
        productVersion: 'tiles',
        productType: 'OrthophotoHistory',
      },
    },
    created: '2021-04-25T13:10:06.614Z',
    updated: '2021-04-25T13:10:06.614Z',
    status: 'Completed',
    reason: '',
    isCleaned: true,
  },
] as unknown as IJob<IWithCleanDataIngestionParams>[];

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
] as unknown as IWithCleanDataIngestionParams;

const urisArray = [
  '/tiffs/fakeDir1/fakeDir2',
  '/tiffs/fakeDir3/fakeDir4',
  '/tiffs/fakeDir5/fakeDir6',
  '/tiffs/fakeDir7/fakeDir8',
  '/tiffs/fakeDir9/fakeDir10',
  '/tiffs/fakeDir11/fakeDir12',
];

const s3KeysArray = urisArray.map((uri) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  return { Key: uri };
});

export { discreteArray, swapDiscreteArray, urisArray, s3KeysArray };
