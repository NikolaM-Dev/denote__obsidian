import { App, Command, HeadingCache } from 'obsidian';

import { getFile, skipLogic, toTitleCase } from './utils';

interface INewHeading extends HeadingCache {
  newHeading: string;
}

export function getFormatHeadings(app: App): Command {
  return {
    id: 'denote-format-headings',
    name: 'Format Headings',

    callback: async () => await formatHeadings(app),
  };
}

async function formatHeadings(app: App): Promise<void> {
  const file = getFile(app);
  if (!file) return;

  if (skipLogic(file)) return;

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

  await app.vault.process(file, (content: string): string => {
    newHeadings.forEach((heading) => {
      content = content.replace(heading.heading, heading.newHeading);
    });

    return content;
  });
}
