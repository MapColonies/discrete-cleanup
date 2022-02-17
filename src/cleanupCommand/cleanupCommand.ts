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

  public constructor(@inject(SERVICES.CONFIG) private readonly config: IConfig, private readonly cleanupManager: CleanupManager) {}

  public handler = async (): Promise<void> => {
    if (this.config.get<boolean>('cleanupTypes.failedIngestionTasks')) {
      await this.cleanupManager.cleanFailedIngestionTasks();
    }
    if (this.config.get<boolean>('cleanupTypes.successfulIngestion')) {
      await this.cleanupManager.cleanSuccessfulIngestionTasks();
    }
    if (this.config.get<boolean>('cleanupTypes.failedIncomingSyncTasks')) {
      await this.cleanupManager.cleanFailedIncomingSyncTasks();
    }
  };
}
