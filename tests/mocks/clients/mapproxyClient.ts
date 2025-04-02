import { MapProxyClient } from '../../../src/clients/mapproxyClient';

const deleteLayersMock = jest.fn();

const mapproxyClientMock = {
  deleteLayers: deleteLayersMock,
} as unknown as MapProxyClient;

export { mapproxyClientMock, deleteLayersMock };
