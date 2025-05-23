import { App, Command } from 'obsidian';

import { DFrontMatter } from '../lib';

export function updateFrontMatterTitle(app: App): Command {
  return {
    id: 'denote-update-front-matter-title',
    name: 'Update FrontMatter Title',
    callback: async (): Promise<void> => {
      const file = app.workspace.getActiveFile();
      if (!file) return;

      const cachedMetadata = app.metadataCache.getFileCache(file);
      if (!cachedMetadata) return;

      const headings = cachedMetadata.headings;
      if (!headings) return;

      const h1 = headings.find((header) => header.level === 1);
      if (!h1) return;

      const oFrontMatter = await DFrontMatter.getOFrontMatter({ app, file });
      if (typeof oFrontMatter.id !== 'string') return;

      await DFrontMatter.updateOFrontMatter({
        app,
        file,
        newFrontMatter: { title: h1.heading },
      });
    },
  };
}
