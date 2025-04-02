import { IDataLocation, ITilesLocation, JobResponse } from '../src/common/interfaces';

const discreteArray =
[
  {
    id: "9eb84872-f6d7-422c-a438-92cf399b477e",
    resourceId: "discrete_test_swap",
    version: "1.0",
    type: "Ingestion_New",
    description: "",
    parameters: {
      metadata: {
        srs: "4326",
        region: [
          "string",
        ],
        srsName: "WGS84GEO",
        catalogId: "533d6147-a2c0-49a1-a6da-cb2e9fc99d0b",
        productId: "discrete_test_swap",
        description: "string",
        displayPath: "fa27ae00-4aa5-4e53-89fd-e48b2654a46f",
        productName: "string",
        productType: "Orthophoto",
        producerName: "string",
        tileMimeType: "image/png",
        transparency: "TRANSPARENT",
        classification: "6",
        productSubType: "string",
        tileOutputFormat: "PNG",
        layerRelativePath: "533d6147-a2c0-49a1-a6da-cb2e9fc99d0b/fa27ae00-4aa5-4e53-89fd-e48b2654a46f",
      },
      partsData: [
        {
          cities: [
            "string",
          ],
          sensors: [
            "string",
          ],
          sourceId: "avi",
          countries: [
            "string",
          ],
          footprint: {
            type: "Polygon",
            coordinates: [
              [
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
              ],
            ],
          },
          sourceName: "string",
          description: "string",
          resolutionMeter: 8000,
          resolutionDegree: 0.703125,
          imagingTimeEndUTC: "2024-01-28T13:47:43.427Z",
          imagingTimeBeginUTC: "2024-01-28T13:47:43.427Z",
          sourceResolutionMeter: 8000,
          horizontalAccuracyCE90: 10,
        },
      ],
      inputFiles: {
        fileNames: [
          "blueMarble.gpkg",
        ],
        originDirectory: "test_dir",
      },
      additionalParams: {
        jobTrackerServiceURL: "http://raster-core-dev-job-tracker-service",
        polygonPartsEntityName: "discrete_test_swap_orthophoto",
      },
    },
    status: "Failed",
    percentage: 75,
    reason: "Job completed successfully",
    domain: "RASTER",
    isCleaned: false,
    priority: 1000,
    expirationDate: null,
    internalId: "533d6147-a2c0-49a1-a6da-cb2e9fc99d0b",
    producerName: null,
    productName: "string",
    productType: "Orthophoto",
    additionalIdentifiers: null,
    taskCount: 4,
    completedTasks: 4,
    failedTasks: 0,
    expiredTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    abortedTasks: 0,
    created: "2025-04-02T07:28:45.793Z",
    updated: "2025-04-02T07:28:54.015Z",
  },
  {
    id: "3d03bd59-e669-4b23-9dcb-525e5645597f",
    resourceId: "discrete_test_swap_new",
    version: "1.0",
    type: "Ingestion_New",
    description: "",
    parameters: {
      metadata: {
        srs: "4326",
        grid: "2x1",
        scale: 100000000,
        region: [
          "string",
        ],
        srsName: "WGS84GEO",
        catalogId: "cdfd7aed-2e24-46c3-8d9b-38ef2003699a",
        productId: "discrete_test_swap_new",
        description: "string",
        displayPath: "f46d347a-ee72-4880-9f44-8c6224155aec",
        productName: "string",
        productType: "RasterVectorBest",
        producerName: "string",
        tileMimeType: "image/png",
        transparency: "TRANSPARENT",
        classification: "6",
        productSubType: "עבירות",
        tileOutputFormat: "PNG",
        layerRelativePath: "cdfd7aed-2e24-46c3-8d9b-38ef2003699a/f46d347a-ee72-4880-9f44-8c6224155aec",
      },
      partsData: [
        {
          cities: [
            "string",
          ],
          sensors: [
            "string",
          ],
          sourceId: "avi",
          countries: [
            "string",
          ],
          footprint: {
            type: "Polygon",
            coordinates: [
              [
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
              ],
            ],
          },
          sourceName: "string",
          description: "string",
          resolutionMeter: 8000,
          resolutionDegree: 0.703125,
          imagingTimeEndUTC: "2024-01-28T13:47:43.427Z",
          imagingTimeBeginUTC: "2024-01-28T13:47:43.427Z",
          sourceResolutionMeter: 8000,
          horizontalAccuracyCE90: 10,
        },
      ],
      inputFiles: {
        fileNames: [
          "blueMarble.gpkg",
        ],
        originDirectory: "test_dir",
      },
      additionalParams: {
        jobTrackerServiceURL: "http://raster-core-dev-job-tracker-service",
        polygonPartsEntityName: "discrete_test_swap_new_rastervectorbest",
      },
    },
    status: "Failed",
    percentage: 75,
    reason: "Job completed successfully",
    domain: "RASTER",
    isCleaned: false,
    priority: 1000,
    expirationDate: null,
    internalId: "cdfd7aed-2e24-46c3-8d9b-38ef2003699a",
    producerName: null,
    productName: "string",
    productType: "RasterVectorBest",
    additionalIdentifiers: null,
    taskCount: 4,
    completedTasks: 4,
    failedTasks: 0,
    expiredTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    abortedTasks: 0,
    created: "2025-04-02T07:29:58.303Z",
    updated: "2025-04-02T07:30:03.108Z",
  },
  {
    id: "9108ce22-c057-4e64-9ddd-ae30a9aa0600",
    resourceId: "discrete_test",
    version: "1.0",
    type: "Ingestion_New",
    description: "",
    parameters: {
      metadata: {
        srs: "4326",
        scale: 100000000,
        region: [
          "string",
        ],
        srsName: "WGS84GEO",
        productId: "discrete_test",
        description: "string",
        productName: "string",
        productType: "Orthophoto",
        producerName: "string",
        transparency: "TRANSPARENT",
        classification: "6",
        productSubType: "string",
        layerRelativePath: "a655783e-5a6f-45eb-ad5a-d683e51134f3/6208a279-f2dc-44a7-8929-a62c741abacb",
      },
      partsData: [
        {
          cities: [
            "string",
          ],
          sensors: [
            "string",
          ],
          sourceId: "avi",
          countries: [
            "string",
          ],
          footprint: {
            type: "Polygon",
            coordinates: [
              [
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.29430955805424,
                ],
                [
                  34.86824157112912,
                  32.30543192283443,
                ],
                [
                  34.85149443279957,
                  32.30543192283443,
                ],
              ],
            ],
          },
          sourceName: "string",
          description: "string",
          resolutionMeter: 8000,
          resolutionDegree: 0.703125,
          imagingTimeEndUTC: "2024-01-28T13:47:43.427Z",
          imagingTimeBeginUTC: "2024-01-28T13:47:43.427Z",
          sourceResolutionMeter: 8000,
          horizontalAccuracyCE90: 10,
        },
      ],
      inputFiles: {
        fileNames: [
          "blueMarble.gpkg",
        ],
        originDirectory: "test_dir",
      },
      additionalParams: {
        jobTrackerServiceURL: "http://raster-core-dev-job-tracker-service",
        polygonPartsEntityName: "discrete_test_orthophoto",
      },
    },
    status: "Failed",
    percentage: 75,
    reason: "Job completed successfully",
    domain: "RASTER",
    isCleaned: false,
    priority: 1000,
    expirationDate: null,
    internalId: "a655783e-5a6f-45eb-ad5a-d683e51134f3",
    producerName: null,
    productName: "string",
    productType: "Orthophoto",
    additionalIdentifiers: null,
    taskCount: 4,
    completedTasks: 4,
    failedTasks: 0,
    expiredTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    abortedTasks: 0,
    created: "2025-04-02T07:16:34.263Z",
    updated: "2025-04-02T07:16:45.286Z",
  },
] as JobResponse[];

const discreteSourcesLocationsArray = [
  {
    directory: discreteArray[0].parameters.inputFiles.originDirectory,
  },
  {
    directory: discreteArray[1].parameters.inputFiles.originDirectory,
  },
  {
    directory: discreteArray[2].parameters.inputFiles.originDirectory,
  },
  {
    directory: discreteArray[3].parameters.inputFiles.originDirectory,
  },
  {
    directory: discreteArray[4].parameters.inputFiles.originDirectory,
  },
  {
    directory: discreteArray[5].parameters.inputFiles.originDirectory,
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
  '/tiles/uuid1/uuid11',
  '/tiles/uuid2/uuid22',
  '/tiles/uuid3/uuid33',
  '/tiles/uuid4/uuid44',
  '/tiles/uuid5/uuid55',
  '/tiles/uuid6/uuid66',
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
