import { err, ok, Result } from 'neverthrow';
import { TFile } from 'obsidian';

import { ctx } from 'src/lib';

enum Extensions {
  MARKDOWN = 'md',
}

export function getActiveFile(): Result<TFile, string> {
  const app = ctx.getApp();
  if (app.isErr()) return err(app.error);

  const activeFile = app.value.workspace.getActiveFile();

  if (!activeFile) return err('Active File is not found');

  return ok(activeFile);
}

export function isMarkdownFile(file: TFile): boolean {
  return file && file.extension === Extensions.MARKDOWN;
}
