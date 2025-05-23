import { TAbstractFile, TFile } from 'obsidian';

import { wait } from './time';

const DEFAULT_FILENAME = 'Untitled' as const;

export function isTFile(value: TAbstractFile): value is TFile {
  return 'stat' in value;
}

export async function ensureFileIsReadyToModify(file: TFile): Promise<void> {
  if (file.basename === DEFAULT_FILENAME) await wait(4 * 1000);
}
