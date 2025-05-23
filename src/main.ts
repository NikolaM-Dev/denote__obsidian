import { App, Plugin } from 'obsidian';

import {
  formatHeaders,
  onRenameFile,
  updateFrontMatterTitle,
} from './features';

export default class Denote extends Plugin {
  readonly app: App;

  private headingsCache: Record<string, string> = {};

  async onload(): Promise<void> {
    this.registerEvent(onRenameFile(this.app));
    this.addCommand(formatHeaders(this.app, this.headingsCache));
    this.addCommand(updateFrontMatterTitle(this.app));
  }
}
