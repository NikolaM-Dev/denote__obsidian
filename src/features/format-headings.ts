import { App, HeadingCache, TFile } from 'obsidian';

import { ctx, logger, toTitleCase } from 'src/lib';
import { getActiveFile, isMarkdownFile } from 'src/obsidian';
import { hasToSkipFile } from './exclude-files';

interface INewHeading extends HeadingCache {
  newHeading: string;
}

interface IUpdateHeadingsPayload {
  activeFile: TFile;
  app: App;
  headingsToCache: string;
  newHeadings: INewHeading[];
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

  const headingsToCache = newHeadings.map((heading) => heading.heading).join();
  const updateHeadingsPayload: IUpdateHeadingsPayload = {
    activeFile,
    app,
    newHeadings,
    headingsToCache,
  };

  const currentHeadingsCache = ctx.getHeadingsCacheItem(activeFile.path);
  if (!currentHeadingsCache) {
    await updateHeadings(updateHeadingsPayload);

    return;
  }

  if (headingsToCache === currentHeadingsCache) return;

  await updateHeadings(updateHeadingsPayload);
}

async function updateHeadings(payload: IUpdateHeadingsPayload): Promise<void> {
  const { activeFile, app, headingsToCache, newHeadings } = payload;

  await app.vault.process(activeFile, (content: string): string => {
    newHeadings.forEach((heading) => {
      content = content.replace(heading.heading, heading.newHeading);
    });

    return content;
  });

  ctx.setHeadingsCacheItem(activeFile.path, headingsToCache);
}
