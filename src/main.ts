import { App, Plugin } from 'obsidian';

import { getRenameCommand } from './rename-command';
import { log } from './log';

export default class Denote extends Plugin {
  readonly app: App;

  async onload(): Promise<void> {
    log('[DENOTE]: Denote is on');

    this.addCommand(getRenameCommand(this.app));
  }

  async onunload(): Promise<void> {
    console.clear();

    log('[DENOTE]: Denote is off');
  }
}
