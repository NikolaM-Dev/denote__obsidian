import { HeadingCache } from 'obsidian';

import { ctx, logger, toTitleCase } from 'src/lib';
import { getActiveFile, isMarkdownFile } from 'src/obsidian';
import { hasToSkipFile } from './exclude-files';

interface INewHeading extends HeadingCache {
  newHeading: string;
}

export async function formatHeadings(): Promise<void> {
  logger.debug({ icon: '⏺️', msg: 'Running Format Headings' });

  const appResult = ctx.getApp();
  if (appResult.isErr()) {
    logger.error({ msg: appResult.error });

    return;
  }
  const { value: app } = appResult;

  const fileResult = getActiveFile();
  if (fileResult.isErr()) {
    logger.warn({ msg: 'File not found' });

    return;
  }
  const { value: activeFile } = fileResult;

  if (hasToSkipFile(activeFile))
    return logger.debug({ msg: 'File skipped', icon: '⏭️' });

  if (!isMarkdownFile(activeFile)) {
    logger.debug({ msg: "File isn't a Markdown format", showToast: false });

    return;
  }

  const cachedMetadata = app.metadataCache.getFileCache(activeFile);
  if (!cachedMetadata) return;

  const headings = cachedMetadata.headings;
  if (!headings) return;

  const newHeadings: INewHeading[] = headings.map((heading) => {
    return {
      ...heading,
      newHeading: toTitleCase(heading.heading),
    };
  });

  await app.vault.process(fileResult.value, (content: string): string => {
    newHeadings.forEach((heading) => {
      content = content.replace(heading.heading, heading.newHeading);
    });

    return content;
  });
}
