import { CachedMetadata, TFile } from 'obsidian';

import { cleanAndValidateFilename, isMarkdownFile, skipLogic } from './utils';
import { notify } from './log';

export async function onVerifyFilename(
  file: TFile,
  _data: string,
  cache: CachedMetadata,
): Promise<void> {
  if (!file.parent) return notify("⚠️ File doesn't have file.parent");
  if (skipLogic(file)) return;

  if (!isMarkdownFile(file)) return;
  if (!cache.headings) return;

  const h1 = cache.headings.find((heading) => heading.level === 1);
  if (!h1) return;

  const newFilename = cleanAndValidateFilename(h1.heading);

  if (newFilename === file.basename) return;

  notify("ℹ️ Title isn't update with the filename");
}
