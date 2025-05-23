import { App, Command, HeadingCache } from 'obsidian';

import { toTitleCase } from '../utils';
import { IBasePayload } from '../models';
import { DFrontMatter } from '../lib';

interface INewHeading extends HeadingCache {
  newHeading: string;
}

interface IUpdatHeaders extends IBasePayload {
  cache: Record<string, string>;
  id: string;
  newHeadings: INewHeading[];
  nextCachedHeadings: string;
}

export function formatHeaders(
  app: App,
  cache: Record<string, string>,
): Command {
  return {
    id: 'denote-format-headers',
    name: 'Format Headers',
    callback: async (): Promise<void> => {
      const file = app.workspace.getActiveFile();
      if (!file) return;

      const cachedMetadata = app.metadataCache.getFileCache(file);
      if (!cachedMetadata) return;

      const headings = cachedMetadata.headings;
      if (!headings) return;

      const newHeadings: INewHeading[] = headings.map((heading) => {
        return {
          ...heading,
          newHeading: toTitleCase(heading.heading),
        };
      });

      const headingsToCache = newHeadings.map((heading) => heading.heading);

      const oFrontMatter = await DFrontMatter.getOFrontMatter({ app, file });
      if (typeof oFrontMatter.id !== 'string') return;

      const nextCachedHeadings = headingsToCache.join();
      const currentCachedHeadings = cache[oFrontMatter.id];

      const payload: IUpdatHeaders = {
        app,
        file,
        cache,
        newHeadings,
        nextCachedHeadings,
        id: oFrontMatter.id,
      };

      console.log({ cache });

      // If there is not cache
      if (!currentCachedHeadings) await updateHeaders(payload);

      // If headings in cache are the same
      if (currentCachedHeadings === nextCachedHeadings) return;

      // Otherwise
      await updateHeaders(payload);
    },
  };

  async function updateHeaders(payload: IUpdatHeaders): Promise<void> {
    const { app, file, id, newHeadings, cache, nextCachedHeadings } = payload;

    await app.vault.process(file, (content: string): string => {
      newHeadings.forEach((heading) => {
        content = content.replace(heading.heading, heading.newHeading);
      });

      return content;
    });

    cache[id] = nextCachedHeadings;
  }
}
