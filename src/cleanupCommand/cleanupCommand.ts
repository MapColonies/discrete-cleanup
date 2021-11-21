import { injectable } from 'tsyringe';
import { CommandModule } from 'yargs';
import { CleanupManager } from './cleanupManager';

@injectable()
export class CleanupCommand implements CommandModule {
  public deprecated = false;
  public command = '$0';
  public describe = 'example command';
  public aliases = ['cleanup'];

  public constructor(private readonly cleanupManager: CleanupManager) {}

  public handler = async (): Promise<void> => {
    await this.cleanupManager.cleanFailedTasks();
    await this.cleanupManager.cleanSuccessfulTasks();
  };
}
