import { Plugin, TAbstractFile, TFile } from 'obsidian';

import {
  ensureFileIsReadyToModify,
  getFrontMatter,
  getNewFilename,
  getSanitizedFrontMatter,
  hasAnExcludedTag,
  isTFile,
  sanitizeCreatedAt,
  sanitizeId,
  sanitizeTags,
  sanitizeTimeStamp,
  sanitizeTitle,
  toTitleCase,
} from './utils';
import { IDenoteSettings } from './settings';
import { IFrontMatter } from './models';

export default class DenoteRenamer extends Plugin {
  private cachedHeadigns: Record<string, string> = {};
  private settings: IDenoteSettings = {
    renameFile: { excludedDirectories: ['4-archives/templates/obsidian'] },
    sanitizeFrontMatter: {
      excludedTags: [
        'journal/daily',
        'journal/monthly',
        'journal/quaterly',
        'journal/weekly',
        'journal/yearly',
      ],
    },
  };

  async onload(): Promise<void> {
    const onModify = this.app.vault.on(
      'modify',
      async (file: TAbstractFile): Promise<void> => {
        if (!isTFile(file)) return;

        await ensureFileIsReadyToModify(file);

        const skipProcess = await this.onSanitizeFrontMatter(file);

        await this.onFormatHeadings(file, skipProcess);
        await this.onRenameFile(file);
      },
    );

    this.registerEvent(onModify);
  }

  private async onSanitizeFrontMatter(file: TFile): Promise<boolean> {
    const frontMatter = await getFrontMatter(file, this.app);

    const tags = sanitizeTags(frontMatter.tags);
    const skipProcess = hasAnExcludedTag(
      this.settings.sanitizeFrontMatter.excludedTags,
      tags,
    );

    const createdAt = sanitizeCreatedAt(frontMatter.createdAt, file.stat.ctime);
    const id = sanitizeId(frontMatter.id, file.stat.ctime);
    const updatedAt = sanitizeTimeStamp(file.stat.mtime);

    this.app.fileManager.processFrontMatter(
      file,
      (frontMatter: IFrontMatter) => {
        if (!skipProcess) {
          const title = sanitizeTitle(frontMatter.title);
          frontMatter.title = title;
        }

        frontMatter.createdAt = createdAt;
        frontMatter.id = id;
        frontMatter.tags = tags;
        frontMatter.updatedAt = updatedAt;
      },
    );

    return skipProcess;
  }

  private async onFormatHeadings(
    file: TFile,
    skipProcess: boolean,
  ): Promise<void> {
    const cachedMetadata = this.app.metadataCache.getFileCache(file);
    if (!cachedMetadata) return;

    const headings = cachedMetadata.headings;
    if (!headings) return;

    const frontMatter = await getSanitizedFrontMatter(file, this.app);

    const newHeadings = headings.map((heading) => {
      return {
        ...heading,
        newHeading: toTitleCase(heading.heading),
      };
    });
    const formattedHeadings = newHeadings.map((heading) => heading.newHeading);

    const rewriteHeadings = (): void => {
      this.app.vault.process(file, (content: string): string => {
        newHeadings.forEach((heading) => {
          content = content.replace(heading.heading, heading.newHeading);
        });

        if (skipProcess) return content;

        const h1 = newHeadings.find((heading) => heading.level === 1);
        if (!h1) return content;

        this.app.fileManager.processFrontMatter(
          file,
          (frontMatter: IFrontMatter) => {
            const title = sanitizeTitle(h1.newHeading);
            frontMatter.title = title;
          },
        );

        return content;
      });

      this.cachedHeadigns[frontMatter.id] = nextCachedHeadings;
    };

    const nextCachedHeadings = formattedHeadings.join();
    const currentCachedHeadings = this.cachedHeadigns[frontMatter.id];

    // If there is not cache
    if (!currentCachedHeadings) rewriteHeadings();

    // If headings in cache are the same
    if (currentCachedHeadings === nextCachedHeadings) return;

    // Otherwise
    rewriteHeadings();
  }

  private async onRenameFile(file: TFile): Promise<void> {
    const parent = file.parent;
    if (!parent) return;

    if (this.settings.renameFile.excludedDirectories.includes(parent.path)) {
      return;
    }

    const frontMatter = await getSanitizedFrontMatter(file, this.app);

    const newFilename = getNewFilename(frontMatter, file.extension);
    const newPath = `${parent.path}/${newFilename}`;

    await this.app.fileManager.renameFile(file, newPath);
  }
}
