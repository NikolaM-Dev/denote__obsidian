import { Plugin, TAbstractFile } from 'obsidian';

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
				await this.onSanitizeFrontMatter(file);
			},
		);

		this.registerEvent(onModify);
	}

	private async onSanitizeFrontMatter(file: TAbstractFile): Promise<void> {
		if (!isTFile(file)) return;

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

	// private async onModifyUsingDenoteNotation(
	// 	file: TAbstractFile,
	// ): Promise<void> {
	// 	if (!isTFile(file)) return;

	// 	await this.app.fileManager.processFrontMatter(
	// 		file,
	// 		async (frontmater: IFrontMatter) => {
	// 			const excludeDirectories = '4-archives/templates/obsidian';

	// 			if (file.parent?.path === excludeDirectories) return;

	// 			if (Object.entries(frontmater).length === 0) return;

	// 			// timestamp: file.stat.ctime,
	// 			const renamedFile = this.getRenamedFilename({
	// 				...frontmater,
	// 				fileBasename: frontmater.title,
	// 				fileExtension: file.extension,
	// 			});

	// 			if (file.name === renamedFile) return;

	// 			const newPath = `${file.parent?.path}/${renamedFile}`;

	// 			await this.app.fileManager.renameFile(file, newPath);
	// 		},
	// 	);
	// }

	// private getRenamedFilename(payload: IRenameFilenamePayload): string {
	// 	const formattedFilename = toKebabCase(String(payload.fileBasename));
	// 	const formattedTags = this.getFormattedTags(payload.tags);

	// 	return `${payload.id}--${formattedFilename}${formattedTags}.${payload.fileExtension}`;
	// }

	// private getFormattedTags(tags: ITags): string {
	// 	switch (typeof tags) {
	// 		case 'undefined':
	// 			return '';

	// 		case 'string':
	// 			return `__${tags}`;

	// 		case 'object':
	// 			if (Array.isArray(tags) && tags[0] !== null) {
	// 				const formattedTags = tags.map((tag) => toKebabCase(tag));

	// 				return `__${formattedTags.join('_')}`;
	// 			}

	// 			return '';

	// 		default:
	// 			return '';
	// 	}
	// }
}
