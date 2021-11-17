import { App } from '../../../../src/app';

export class CleanupCommandCliTrigger {
  public constructor(private readonly app: App) {}

  public async callCli(args: string[]): Promise<void> {
    await Promise.resolve(this.app.cli.parse(args));
  }

  public async cleanup(): Promise<void> {
    await this.callCli(['cleanup']);
  }
}
