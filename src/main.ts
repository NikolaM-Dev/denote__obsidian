import { App, Plugin } from 'obsidian';

import { getFormatFrontMatterCommand } from './format-front-matter-command';
import { log } from './log';

export default class Denote extends Plugin {
  readonly app: App;

  async onload(): Promise<void> {
    log('Denote is on');

    this.addCommand(getFormatFrontMatterCommand(this.app));
  }

  async onunload(): Promise<void> {
    console.clear();

    log('Denote is off');
  }
}
