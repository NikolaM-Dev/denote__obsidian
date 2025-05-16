import { Plugin, TAbstractFile, TFile } from 'obsidian';

import {
	getFrontMatter,
	isTFile,
	sanitizeId,
	sanitizeTags,
	sanitizeTimeStamp,
	sanitizeTitle,
} from './utils';
import { IFrontMatter } from './models';

export default class DenoteRenamer extends Plugin {
	async onload(): Promise<void> {
		const onModify = this.app.vault.on(
			'modify',
			async (file: TAbstractFile): Promise<void> => {
				if (!isTFile(file)) return;

				await this.onSanitizeFrontMatter(file);
				await this.onRenameFile(file);
			},
		);

		this.registerEvent(onModify);
	}

	private async onSanitizeFrontMatter(file: TFile): Promise<void> {
		const frontMatter = await getFrontMatter(file, this.app);

		const createdAt = sanitizeTimeStamp(file.stat.ctime);
		const id = sanitizeId(frontMatter.id, file.stat.ctime);
		const tags = sanitizeTags(frontMatter.tags);
		const title = sanitizeTitle(frontMatter.title);
		const updatedAt = sanitizeTimeStamp(file.stat.mtime);

		this.app.fileManager.processFrontMatter(
			file,
			(frontMatter: IFrontMatter) => {
				frontMatter.createdAt = createdAt;
				frontMatter.id = id;
				frontMatter.tags = tags;
				frontMatter.title = title;
				frontMatter.updatedAt = updatedAt;
			},
		);
	}

	private async onRenameFile(file: TFile): Promise<void> {}
}
