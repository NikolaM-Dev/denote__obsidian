import { App } from 'obsidian';
import { err, ok, Result } from 'neverthrow';

interface ICtxValues {
  app: App | null;
}

interface ICtxMethods {
  getApp: () => Result<App, string>;
  setApp: (app: App | null) => void;
}

type ICtx = ICtxValues & ICtxMethods;

export const ctx: ICtx = {
  app: null,

  getApp: (): Result<App, string> => {
    if (!ctx.app) return err("App wasn't assigned");

    return ok(ctx.app);
  },

  setApp: (app: App | null): void => {
    ctx.app = app;
  },
};
