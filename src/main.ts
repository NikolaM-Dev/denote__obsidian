import { App, Plugin } from 'obsidian';

import {
  formatFrontMater,
  formatHeadings,
  fuzzyFindBackLinks,
  fuzzyFindOutgoingLinks,
  renameFile,
} from './features';
import { ctx, logger, wait } from './lib';
import { getCommand } from './obsidian';

export default class Denote extends Plugin {
  readonly app: App;

  async onload(): Promise<void> {
    logger.info({ msg: 'Denote is ON' });

    ctx.setApp(this.app);

    this.setCommands();
    this.setEvents();
  }

  async onunload(): Promise<void> {
    ctx.setApp(null);
    console.clear();

    logger.info({ msg: 'Denote is OFF' });
  }

  private setCommands(): void {
    this.addCommand(
      getCommand({
        id: 'format-heading',
        name: 'Format Heading',

        callback: formatHeadings,
      }),
    );

    this.addCommand(
      getCommand({
        id: 'rename-file',
        name: 'Rename File',

        callback: renameFile,
      }),
    );

    this.addCommand(
      getCommand({
        id: 'format-front-matter',
        name: 'Format Front Matter',

        callback: formatFrontMater,
      }),
    );

    this.addCommand(
      getCommand({
        id: 'fuzzy-find-backlinks',
        name: 'Fuzzy Find BackLinks',

        callback: fuzzyFindBackLinks,
      }),
    );

    this.addCommand(
      getCommand({
        id: 'fuzzy-find-outgoing-links',
        name: 'Fuzzy Find Outgoing Links',

        callback: fuzzyFindOutgoingLinks,
      }),
    );
  }

  private setEvents(): void {
    this.registerEvent(
      this.app.metadataCache.on('changed', async () => {
        await formatHeadings();
        await formatFrontMater();

        // Delay to prevent modify and old cached file
        await wait(200);
        await renameFile();
      }),
    );
  }
}
