import { App, TFile } from 'obsidian';
import { format } from '@formkit/tempo';

import { sortTags } from './utils';

export interface IFrontMatter {
  aliases: string[];
  createdAt: string;
  id: string;
  tags: string[];
  updatedAt: string;
}

export async function getFrontMatter(
  app: App,
  file: TFile,
): Promise<IFrontMatter> {
  let _frontMatter: IFrontMatter = {
    id: getFrontMatterId(file),
    aliases: [],
    tags: ['untagged'],
    createdAt: getFrontMatterCreatedAt(file),
    updatedAt: getFrontMatterUpdatedAt(file),
  };

  await app.fileManager.processFrontMatter(
    file,
    async (frontMatter: IFrontMatter): Promise<void> => {
      if (Object.entries(frontMatter).length === 0) return;

      if (!frontMatter.tags || frontMatter.tags.length === 0) {
        frontMatter.tags = _frontMatter.tags;
      }

      frontMatter.id = _frontMatter.id;
      frontMatter.createdAt = _frontMatter.createdAt;
      frontMatter.updatedAt = _frontMatter.updatedAt;
      frontMatter.tags = sortTags(frontMatter.tags);

      _frontMatter = frontMatter;
    },
  );

  return _frontMatter;
}

export async function setFrontMatter(
  app: App,
  file: TFile,
  newFrontMatter: Partial<IFrontMatter>,
): Promise<void> {
  await app.fileManager.processFrontMatter(
    file,
    (frontMatter: IFrontMatter): void => {
      Object.entries(newFrontMatter).forEach(([property, value]) => {
        // @ts-ignore
        frontMatter[property] = value;
      });
    },
  );
}

export function getFrontMatterId(file: TFile): string {
  return format(new Date(file.stat.ctime), 'YYYYMMDDTHHmmss');
}

export function getFrontMatterCreatedAt(file: TFile): string {
  return format(new Date(file.stat.ctime), '[[YYYY-MM-DD]]');
}

export function getFrontMatterUpdatedAt(file: TFile): string {
  return format(new Date(file.stat.mtime), 'YYYY-MM-DD, HH:mm:ss');
}
