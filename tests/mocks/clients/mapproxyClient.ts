import { MapproxyClient } from "../../../src/clients/mapproxyClient";

const deleteLayersMock = jest.fn();

const mapproxyClientMock ={
  deleteLayers: deleteLayersMock
} as unknown as MapproxyClient;

export {mapproxyClientMock, deleteLayersMock}
