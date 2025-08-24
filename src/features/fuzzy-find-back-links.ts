import {
  FuzzyMatch,
  FuzzySuggestModal,
  LinkCache,
  renderResults,
} from 'obsidian';
import { format } from '@formkit/tempo';

import { ctx, logger, trim } from 'src/lib';
import { getActiveFile } from 'src/obsidian';

export class FuzzyFindBackLinksModal extends FuzzySuggestModal<LinkCache> {
  links: LinkCache[] = [];

  getItemText(link: LinkCache): string {
    return trim(link.displayText + ' ' + link.link);
  }

  getItems(): LinkCache[] {
    return this.links;
  }

  renderSuggestion(match: FuzzyMatch<LinkCache>, el: HTMLElement) {
    const titleEl = el.createDiv();
    console.log({ matchItem: match.item });
    renderResults(
      titleEl,
      match.item.displayText ?? match.item.link,
      match.match,
    );

    if (match.item.displayText && match.item.displayText !== match.item.link) {
      const authorEl = el.createEl('small');
      const offset = -(match.item.link.length + 1);

      renderResults(authorEl, match.item.link, match.match, offset);
    }
  }

  async onChooseItem(
    link: LinkCache,
    _evt: MouseEvent | KeyboardEvent,
  ): Promise<void> {
    const path = await this.app.fileManager.getAvailablePathForAttachment(
      link.link,
    );
    this.app.workspace.openLinkText(link.link, path);
  }
}

export async function fuzzyFindBackLinks(): Promise<void> {
  logger.debug({ icon: '⏺️', msg: 'Running Fuzzy Find Back Links' });

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

  const { data: backLinksMap }: { data: Map<string, LinkCache[]> } =
    // @ts-ignore, I'm using `https://github.com/mnaoumov/obsidian-backlink-cache`
    await app.metadataCache.getBacklinksForFile.safe(activeFile);

  if (!backLinksMap) return;

  const backLinks: LinkCache[] = [];
  backLinksMap.forEach((_, backLink) =>
    backLinks.push({
      link: backLink,
      displayText: backLink.split('/').pop()!.split('.').shift(),
      original: backLink.split('/').pop()!,
      // @ts-ignore
      position: null,
    }),
  );
  const createdAt = new Date(activeFile.stat.ctime);
  backLinks.push({
    link: format(createdAt, 'YYYY-MM-DD'),
    displayText: 'createdAt ' + format(createdAt, 'dddd, DD MMMM YYYY'),
    original: format(createdAt, 'YYYY-MM-DD'),
    // @ts-ignore
    position: null,
  });

  const fzf = new FuzzyFindBackLinksModal(app);
  fzf.setPlaceholder('Find a Back Link...');
  fzf.links = backLinks;
  fzf.open();
}
