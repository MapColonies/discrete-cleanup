import { Logger } from '@map-colonies/js-logger';
import { inject, singleton } from 'tsyringe';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import { Argv } from 'yargs';
import { SERVICES } from './common/constants';
import { registerExternalValues, RegisterOptions } from './containerConfig';
import { CleanupCommand } from './cleanupCommand/cleanupCommand';

@singleton()
export class App {
  public cli: Argv;

  public constructor(@inject(SERVICES.LOGGER) private readonly logger: Logger, private readonly cleanupCommand: CleanupCommand) {
    this.cli = this.createYargsCli();
  }

  public async run(args: string[]): Promise<void> {
    await Promise.resolve(this.cli.parse(hideBin(args)));
  }

  private createYargsCli(): Argv {
    return yargs().usage('Usage: $0 <command> [options]').command(this.cleanupCommand).help('h').alias('h', 'help').strict();
  }
}

export function getApp(registerOptions?: RegisterOptions): App {
  const container = registerExternalValues(registerOptions);
  const app = container.resolve(App);
  return app;
}
