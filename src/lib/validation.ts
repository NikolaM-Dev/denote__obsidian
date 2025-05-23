import { TFile } from 'obsidian';
import { DSettings } from '.';

export function hasAnExcludedTag(tags: string[]): boolean {
  const settings = DSettings.getSettings();

  let flag = false;

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (settings.sanitizeFrontMatter.excludedTags.includes(tag)) {
      flag = true;
      break;
    }
  }

  return flag;
}

export function hasAndExcludedPath(file: TFile): boolean {
  const parent = file.parent;
  if (!parent) return true;

  const settings = DSettings.getSettings();

  if (settings.autoRenameFile.excludedDirectories.includes(parent.path)) {
    return true;
  }

  return false;
}
