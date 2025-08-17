import { App, Command } from 'obsidian';

import { cleanAndValidateFilename, getFile, skipLogic } from './utils';
import { notify } from './log';

export function getTitleSchemeRenameFileCommand(app: App): Command {
  return {
    id: 'title-scheme-rename-file',
    name: 'Rename File Using Title Scheme',

    callback: async () => await renameFile(app),
  };
}

async function renameFile(app: App): Promise<void> {
  const file = getFile(app);
  if (!file) return;

  if (skipLogic(file)) return;

  if (!file.parent) return notify("⚠️ File doesn't have file.parent");

  const cache = app.metadataCache.getFileCache(file);
  if (!cache) return;
  if (!cache.headings) return;

  const h1 = cache.headings.find((heading) => heading.level === 1);
  if (!h1) return;

  const newFilename = cleanAndValidateFilename(h1.heading);
  if (newFilename === file.basename) return;

  const newPath = `${file.parent.path}/${newFilename}.${file.extension}`;

  await app.fileManager.renameFile(file, newPath);
}
