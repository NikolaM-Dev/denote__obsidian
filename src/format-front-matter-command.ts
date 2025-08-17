import { App, Command } from 'obsidian';

import { getFile, skipLogic } from './utils';
import { getFrontMatter, setFrontMatter } from './frontmatter';

export function getFormatFrontMatterCommand(app: App): Command {
  return {
    id: 'denote-format-front-matter',
    name: 'Format FrontMatter',

    callback: async () => await formatFrontMater(app),
  };
}

async function formatFrontMater(app: App): Promise<void> {
  const file = getFile(app);
  if (!file) return;

  if (skipLogic(file)) return;

  const frontMatter = await getFrontMatter(app, file);
  await setFrontMatter(app, file, frontMatter);
}
