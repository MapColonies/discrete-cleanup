import { inject, singleton } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { SERVICES } from '../common/constants';
import { IConfig, IJob, IWithCleanDataIngestionParams } from '../common/interfaces';

@singleton()
export class MapproxyClient extends HttpClient {
  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, @inject(SERVICES.LOGGER) logger: Logger) {
    super(logger, config.get<string>('mapproxy_api.url'), 'mapproxy-api', config.get<IHttpRetryConfig>('httpRetry'));
  }

  public async deleteLayers(discreteLayers: IJob<IWithCleanDataIngestionParams>[]): Promise<IJob<IWithCleanDataIngestionParams>[]> {
    const mapProxyLayersToDelete: string[] = [];

    for (const discrete of discreteLayers) {
      const productType = discrete.parameters.metadata.productType as string;
      this.logger.info(`Deleting layer: [${discrete.resourceId}-${productType}]`);
      mapProxyLayersToDelete.push(`${discrete.resourceId}-${productType}`);
    }
    this.logger.info(`Deleting layers [${mapProxyLayersToDelete.join(',')}] from mapproxy`);

    try {
      //axios default query param array parsing breaks the openApi validator and the mc-utils currently dont allows overriding the parser externally
      const queryParams = mapProxyLayersToDelete.map((layer) => `layerNames=${layer}`).join('&');
      const removeLayersUrl = `/layer?${queryParams}`;
      await this.delete(removeLayersUrl);
      return [];
    } catch (err) {
      const error = err as Error;
      this.logger.error(`Could not delete layers from mapproxy: ${error.message}`);
      return discreteLayers;
    }
  }
}
