import { Plugin, TAbstractFile, TFile } from 'obsidian';

import { IFrontMatter, IRenameFilenamePayload, ITags } from './models';
import { toLowerKebabCase } from './utils';

export default class DenoteRenamer extends Plugin {
	async onload(): Promise<void> {
		const onModify = this.app.vault.on(
			'modify',
			async (file: TAbstractFile): Promise<void> => {
				this.onModifyUsingDenoteNotation(file);
			},
		);

		this.registerEvent(onModify);
	}

	private async onModifyUsingDenoteNotation(
		file: TAbstractFile,
	): Promise<void> {
		if (!this.isTFile(file)) return;

		await this.app.fileManager.processFrontMatter(
			file,
			async (frontmater: IFrontMatter) => {
				const excludeDirectories = '4-archives/templates/obsidian';

				if (file.parent?.path === excludeDirectories) return;

				if (Object.entries(frontmater).length === 0) return;

				// timestamp: file.stat.ctime,
				const renamedFile = this.getRenamedFilename({
					...frontmater,
					fileBasename: frontmater.title,
					fileExtension: file.extension,
				});

				if (file.name === renamedFile) return;

				const newPath = `${file.parent?.path}/${renamedFile}`;

				await this.app.fileManager.renameFile(file, newPath);
			},
		);
	}

	private isTFile(value: TAbstractFile): value is TFile {
		return 'stat' in value;
	}

	private getRenamedFilename(payload: IRenameFilenamePayload): string {
		const formattedFilename = toLowerKebabCase(
			String(payload.fileBasename),
		);
		const formattedTags = this.getFormattedTags(payload.tags);

		return `${payload.id}--${formattedFilename}${formattedTags}.${payload.fileExtension}`;
	}

	private getFormattedTags(tags: ITags): string {
		switch (typeof tags) {
			case 'undefined':
				return '';

			case 'string':
				return `__${tags}`;

			case 'object':
				if (Array.isArray(tags) && tags[0] !== null) {
					const formattedTags = tags.map((tag) =>
						toLowerKebabCase(tag),
					);

					return `__${formattedTags.join('_')}`;
				}

				return '';

			default:
				return '';
		}
	}
}
