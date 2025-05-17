import { Plugin, TAbstractFile, TFile } from 'obsidian';

import {
  ensureFileIsReadyToModify,
  getFrontMatter,
  getNewFilename,
  getSanitizedFrontMatter,
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
  };

  async onload(): Promise<void> {
    const onModify = this.app.vault.on(
      'modify',
      async (file: TAbstractFile): Promise<void> => {
        if (!isTFile(file)) return;

        await this.onSanitizeFrontMatter(file);
        await this.onFormatHeadings(file);
        await ensureFileIsReadyToModify(file);
        await this.onRenameFile(file);
      },
    );

    this.registerEvent(onModify);
  }

  private async onSanitizeFrontMatter(file: TFile): Promise<void> {
    const frontMatter = await getFrontMatter(file, this.app);

    const id = sanitizeId(frontMatter.id, file.stat.ctime);
    const tags = sanitizeTags(frontMatter.tags);
    const title = sanitizeTitle(frontMatter.title);
    const createdAt = sanitizeCreatedAt(frontMatter.createdAt, file.stat.ctime);
    const updatedAt = sanitizeTimeStamp(file.stat.mtime);

    this.app.fileManager.processFrontMatter(
      file,
      (frontMatter: IFrontMatter) => {
        frontMatter.createdAt = createdAt;
        frontMatter.id = id;
        frontMatter.tags = tags;
        frontMatter.title = title;
        frontMatter.updatedAt = updatedAt;
      },
    );
  }

  private async onFormatHeadings(file: TFile): Promise<void> {
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
    const h1 = newHeadings.find((heading) => heading.level === 1);
    const formattedHeadings = newHeadings.map((heading) => heading.newHeading);

    const rewriteHeadings = (): void => {
      this.app.vault.process(file, (content: string): string => {
        newHeadings.forEach((heading) => {
          content = content.replace(heading.heading, heading.newHeading);
        });

        if (h1) {
          const title = sanitizeTitle(h1.newHeading);

          this.app.fileManager.processFrontMatter(
            file,
            (frontMatter: IFrontMatter) => {
              frontMatter.title = title;
            },
          );
        }

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
