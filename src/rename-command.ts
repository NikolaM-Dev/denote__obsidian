import { App, Command } from 'obsidian';

import { getFormatTags, getSlug } from './filename';
import { getFrontMatter, setFrontMatter } from './frontmatter';
import { log, notify } from './log';

export function getRenameCommand(app: App): Command {
  return {
    id: 'denote-rename-file',
    name: 'Rename File',

    callback: async () => await renameFile(app),
  };
}

export async function renameFile(app: App): Promise<void> {
  const file = app.workspace.getActiveFile();

  if (!file) return log('File not found');

  const frontMatter = await getFrontMatter(app, file);
  await setFrontMatter(app, file, frontMatter);

  const title = frontMatter.aliases[0];

  if (!title)
    return notify('⚠️ Alias not found, please add at least one alias');

  const slug = getSlug(title);
  const formattedTags = getFormatTags(frontMatter.tags);

  const newFilename = `${frontMatter.id}--${slug}${formattedTags}.${file.extension}`;

  if (!file.parent) return notify("⚠️ File doesn't have file.parent");

  const newPath = `${file.parent.path}/${newFilename}`;

  await this.app.fileManager.renameFile(file, newPath);
}
