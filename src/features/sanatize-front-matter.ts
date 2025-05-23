import {
  sanitizeCreatedAt,
  sanitizeId,
  sanitizeTags,
  sanitizeTimeStamp,
  sanitizeTitle,
} from '../utils';
import { DFrontMatter, DValidation } from '../lib';
import { IBasePayload } from '../models';

export async function sanitizeFrontMatter(
  payload: IBasePayload,
): Promise<void> {
  if (DValidation.hasAndExcludedPath(payload.file)) return;

  const oFrontMatter = await DFrontMatter.getOFrontMatter(payload);

  const tags = sanitizeTags(oFrontMatter.tags);

  const skipTitle = DValidation.hasAnExcludedTag(tags);
  const title =
    skipTitle && oFrontMatter.title
      ? oFrontMatter.title
      : sanitizeTitle(oFrontMatter.title);

  const newFrontMatter: Partial<DFrontMatter.IDFrontMatter> = {
    id: sanitizeId(oFrontMatter.id, payload.file.stat.ctime),
    title,
    tags,
    createdAt: sanitizeCreatedAt(
      oFrontMatter.createdAt,
      payload.file.stat.ctime,
    ),
    updatedAt: sanitizeTimeStamp(payload.file.stat.mtime),
  };

  return await DFrontMatter.updateOFrontMatter({
    ...payload,
    newFrontMatter,
  });
}
