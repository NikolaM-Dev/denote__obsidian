import { App, EventRef, TAbstractFile } from 'obsidian';

import { DFile, DFrontMatter, DValidation } from '../lib';
import { getNewFilename } from '../utils';
import { IBasePayload } from '../models';
import { sanitizeFrontMatter } from './sanatize-front-matter';

export async function renameFile(payload: IBasePayload): Promise<void> {
  const { app, file } = payload;
  if (DValidation.hasAndExcludedPath(file)) return;

  const frontMatter = await DFrontMatter.getOFrontMatter({ file, app });

  if (frontMatter.title === null) return;

  const newFilename = getNewFilename(frontMatter, file.extension);

  // This is already validated on hasAndExcludedPath
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const newPath = `${file.parent!.path}/${newFilename}`;

  await this.app.fileManager.renameFile(file, newPath);
}

export function onRenameFile(app: App): EventRef {
  return app.vault.on('modify', async (file: TAbstractFile): Promise<void> => {
    if (!DFile.isTFile(file)) return;

    await DFile.ensureFileIsReadyToModify(file);

    const payload: IBasePayload = { app, file };

    await sanitizeFrontMatter(payload);
    await renameFile(payload);
  });
}
