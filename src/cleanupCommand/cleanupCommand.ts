import { inject, injectable } from 'tsyringe';
import { CommandModule } from 'yargs';
import { SERVICES } from '../common/constants';
import { IConfig } from '../common/interfaces';
import { CleanupManager } from './cleanupManager';

@injectable()
export class CleanupCommand implements CommandModule {
  public deprecated = false;
  public command = '$0';
  public describe = 'example command';
  public aliases = ['cleanup'];

  private readonly updateIngestionJobType: string;
  private readonly swapUpdateIngestionJobType: string;
  private readonly newIngestionJobType: string;

  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, private readonly cleanupManager: CleanupManager) {
    this.newIngestionJobType = config.get('jobTypes.new_ingestion_job_type');
    this.updateIngestionJobType = config.get('jobTypes.update_ingestion_job_type');
    this.swapUpdateIngestionJobType = config.get('jobTypes.swap_update_ingestion_job_type');
  }

  public handler = async (): Promise<void> => {
    if (this.config.get<boolean>('cleanupTypes.failedIngestionTasks')) {
      await this.cleanupManager.cleanFailedIngestionTasks();
    }
    if (this.config.get<boolean>('cleanupTypes.successfulIngestion')) {
      await this.cleanupManager.cleanSuccessfulIngestionTasks(this.newIngestionJobType);
      await this.cleanupManager.cleanSuccessfulIngestionTasks(this.updateIngestionJobType);
    }
    if (this.config.get<boolean>('cleanupTypes.successfulSwapUpdate')) {
      await this.cleanupManager.cleanSuccessfulSwappedLayersTasks(this.swapUpdateIngestionJobType);
    }
  };
}
