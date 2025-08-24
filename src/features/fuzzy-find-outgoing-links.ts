import {
  FuzzyMatch,
  FuzzySuggestModal,
  LinkCache,
  renderResults,
} from 'obsidian';

import { ctx, logger, trim } from 'src/lib';
import { getActiveFile } from 'src/obsidian';

export class FuzzyFindOutgoingLinksModal extends FuzzySuggestModal<LinkCache> {
  links: LinkCache[] = [];

  getItemText(link: LinkCache): string {
    return trim(link.displayText + ' ' + link.link);
  }

  getItems(): LinkCache[] {
    return this.links;
  }

  renderSuggestion(match: FuzzyMatch<LinkCache>, el: HTMLElement) {
    const titleEl = el.createDiv();
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

export async function fuzzyFindOutgoingLinks(): Promise<void> {
  logger.debug({ icon: '⏺️', msg: 'Running Fuzzy Find Outgoing Links' });

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

  const cachedMetadata = app.metadataCache.getFileCache(activeFile);
  if (!cachedMetadata) return;

  const outGoingLinks = cachedMetadata.links;
  if (!outGoingLinks) return;

  const fzf = new FuzzyFindOutgoingLinksModal(app);
  fzf.setPlaceholder('Find an Outgoing Link...');
  fzf.links = outGoingLinks;
  fzf.open();
}
