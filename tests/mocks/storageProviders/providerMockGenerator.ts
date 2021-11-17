import { IStorageProvider } from "../../../src/storageProviders/iStorageProvider";

export interface IStorageProviderMock {
  providerMock: IStorageProvider,
  deleteDiscretesMock: jest.Mock
}

export function createStorageProviderMock():IStorageProviderMock {
  const deleteDiscretesMock = jest.fn();
  return {
    providerMock: {
      deleteDiscretes: deleteDiscretesMock
    } as unknown as IStorageProvider,
    deleteDiscretesMock
  }
}
