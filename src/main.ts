import { App, Plugin } from 'obsidian';

import { getFormatFrontMatterCommand } from './format-front-matter-command';
import { getFormatHeadings } from './format-headings-command';
import { getTitleSchemeRenameFileCommand } from './title-scheme-rename-command';
import { log } from './log';
import { onVerifyFilename } from './on-verify-filename';

export default class Denote extends Plugin {
  readonly app: App;

  async onload(): Promise<void> {
    log('Denote is on');

    this.addCommand(getFormatFrontMatterCommand(this.app));
    this.addCommand(getFormatHeadings(this.app));
    this.addCommand(getTitleSchemeRenameFileCommand(this.app));

    this.app.metadataCache.on('changed', onVerifyFilename);
  }

  async onunload(): Promise<void> {
    console.clear();

    log('Denote is off');
  }
}
