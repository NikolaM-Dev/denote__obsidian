import { App } from 'obsidian';
import { err, ok, Result } from 'neverthrow';

export type IHeadingsCache = Record<string, string>;
export type IUpdatedAtCache = Record<string, number>;

export class ctx {
  private static _app: App | null = null;
  private static _headingsCache: IHeadingsCache = {};
  private static _updatedAtCache: IUpdatedAtCache = {};

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

  static getHeadingsCacheItem(id: string): string | null {
    return this._headingsCache[id];
  }

  static setHeadingsCacheItem(id: string, cache: string): void {
    this._headingsCache[id] = cache;
  }

  static getUpdatedAtCacheItem(id: string): number | null {
    return this._updatedAtCache[id];
  }

  static setUpdatedAtCacheItem(id: string, cache: number): void {
    this._updatedAtCache[id] = cache;
  }
}
