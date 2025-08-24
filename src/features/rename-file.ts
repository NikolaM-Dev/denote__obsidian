import { ctx, logger, toFileName, toTitleCase } from 'src/lib';
import { getActiveFile, isMarkdownFile } from 'src/obsidian';
import { hasToSkipFile } from './exclude-files';

export async function renameFile(): Promise<void> {
  logger.debug({ icon: '⏺️', msg: 'Running Rename File' });

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

  if (!activeFile.parent)
    return logger.warn({ msg: "File doesn't have file.parent" });

  const cachedMetadata = app.metadataCache.getFileCache(activeFile);
  if (!cachedMetadata) return;

  const headings = cachedMetadata.headings;
  if (!headings) return;

  const h1 = headings.find((heading) => heading.level === 1);
  if (!h1) return logger.warn({ msg: 'H1 is not defined' });

  const newFilename = toFileName(toTitleCase(h1.heading));
  if (newFilename === activeFile.basename) return;

  const newPath = `${activeFile.parent.path}/${newFilename}.${activeFile.extension}`;
  await app.fileManager.renameFile(activeFile, newPath);
}
