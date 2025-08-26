import { App } from 'obsidian';
import { err, ok, Result } from 'neverthrow';


export class ctx {
  private static _app: App | null = null;
  private static _headingsCache: IHeadingsCache = {};

  static getApp(): Result<App, string> {
    if (!this._app) {
      return err(
        "App wasn't assigned. Ensure the app is properly initialized before accessing this context.",
      );
    }
    return ok(this._app);
  }

  static setApp(app: App | null): void {
    this._app = app;
  }


