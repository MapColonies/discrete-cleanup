import { inject, injectable } from 'tsyringe';
import { Logger } from '@map-colonies/js-logger';
import { HttpClient, IHttpRetryConfig } from '@map-colonies/mc-utils';
import { Tracer } from '@opentelemetry/api';
import { SERVICES } from '../common/constants';
import { IConfig, JobResponse } from '../common/interfaces';

@injectable()
export class MapProxyClient extends HttpClient {
  public constructor(
    @inject(SERVICES.CONFIG) private readonly config: IConfig,
    @inject(SERVICES.LOGGER) protected readonly logger: Logger,
    @inject(SERVICES.TRACER) public readonly tracer: Tracer
  ) {
    super(
      logger,
      config.get<string>('serviceUrls.mapproxyApi'),
      'mapproxyApi',
      config.get<IHttpRetryConfig>('httpRetry'),
      config.get<boolean>('disableHttpClientLogs')
    );
  }

  public async deleteLayers(discreteLayers: JobResponse[]): Promise<JobResponse[]> {
    const mapProxyLayersToDelete: string[] = [];
    for (const discrete of discreteLayers) {
      const productType = discrete.productType as string;
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
