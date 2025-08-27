import { App, TFile } from 'obsidian';
import { format } from '@formkit/tempo';

import {
  IFrontMatter,
  getActiveFile,
  getFrontMatter,
  isMarkdownFile,
  setFrontMatter,
} from 'src/obsidian';
import {
  TimeUnit,
  areObjectEquals,
  ctx,
  logger,
  msToFraction,
  toTitleCase,
} from 'src/lib';
import { hasToSkipFile } from './exclude-files';

export async function formatFrontMater(): Promise<void> {
  logger.debug({ icon: '⏺️', msg: 'Running Format FrontMatter' });

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

  const frontMatterResult = await getFrontMatter(activeFile);
  if (frontMatterResult.isErr()) {
    logger.error({ msg: frontMatterResult.error });
    return;
  }
  let { value: frontMatter } = frontMatterResult;

  const updatedFrontMatter = getUpdatedFrontMatter(
    activeFile,
    app,
    structuredClone(frontMatter),
  );

  if (areObjectEquals(frontMatter, updatedFrontMatter)) return;

  await setFrontMatter(activeFile, updatedFrontMatter);
}

function getUpdatedFrontMatter(
  activeFile: TFile,
  app: App,
  frontMatter: IFrontMatter,
): IFrontMatter {
  const predefinedTags: Record<string, string> = {
    Inbox: 'inbox',
    Projects: 'type/project',
    Resources: 'resource',
    Sources: 'zk/ln',
    Zettelkasten: 'zk/pn',
  };

  frontMatter.id = getFrontMatterId(activeFile);
  frontMatter.aliases = frontMatter.aliases ?? [];
  frontMatter.tags = frontMatter.tags ?? [];

  Object.entries(predefinedTags).forEach(([key, value]) => {
    if (activeFile.path.includes(key + '/')) {
      frontMatter.tags.push(value);
    }
  });

  frontMatter.tags = sortTags(frontMatter.tags);
  frontMatter.createdAt = getFrontMatterCreatedAt(activeFile);
  frontMatter.updatedAt = getFrontMatterUpdatedAt(activeFile);

  const cachedMetadata = app.metadataCache.getFileCache(activeFile);
  if (cachedMetadata) {
    const headings = cachedMetadata.headings;
    if (headings) {
      const h1 = headings.find((heading) => heading.level === 1);
      if (h1) {
        frontMatter.aliases = [toTitleCase(h1.heading)];
      }
    }
  }

  return frontMatter;
}

export function getFrontMatterId(file: TFile): string {
  return format(new Date(file.stat.ctime), 'YYYYMMDDTHHmmss');
}

export function getFrontMatterCreatedAt(file: TFile): string {
  return format(new Date(file.stat.ctime), '[[YYYY-MM-DD]]');
}

export function getFrontMatterUpdatedAt(file: TFile): string {
  let time: number = file.stat.mtime;

  const cachedMTime = ctx.getUpdatedAtCacheItem(file.path);
  if (cachedMTime) {
    const minTimeToUpdate = cachedMTime + msToFraction(1, TimeUnit.MINUTE);
    if (minTimeToUpdate >= time) time = cachedMTime;
  }

  ctx.setUpdatedAtCacheItem(file.path, time);
  return format(new Date(time), 'YYYY-MM-DD, HH:mm:ss');
}

export function sortTags(tags: string[]): string[] {
  const uniqueTags = [...new Set(tags)];

  return uniqueTags.sort((a, b) => a.localeCompare(b));
}
