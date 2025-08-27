import { err, ok, Result } from 'neverthrow';
import { TFile } from 'obsidian';

import { ctx, logger } from 'src/lib';

export interface IFrontMatter {
  id: string;
  aliases: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getFrontMatter(
  file: TFile,
): Promise<Result<IFrontMatter, string>> {
  const appResult = ctx.getApp();
  if (appResult.isErr()) return err(appResult.error);

  const { value: app } = appResult;

  let _frontMatter: IFrontMatter;
  await app.fileManager.processFrontMatter(
    file,
    async (frontMatter: IFrontMatter): Promise<void> => {
      _frontMatter = frontMatter;
    },
  );

  // @ts-ignore
  return ok(_frontMatter);
}

export async function setFrontMatter(
  file: TFile,
  newFrontMatter: any,
): Promise<void> {
  const app = ctx.getApp();
  if (app.isErr()) {
    logger.error({ msg: app.error });

    return;
  }

  await app.value.fileManager.processFrontMatter(file, (frontMatter): void => {
    Object.entries(newFrontMatter).forEach(([property, value]) => {
      // @ts-ignore
      frontMatter[property] = value;
    });
  });

  logger.debug({ msg: 'FrontMatter Updated' });
}
