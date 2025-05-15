import { Plugin, TAbstractFile, TFile } from 'obsidian';

interface IFrontMatter {
	createdAt: string;
	id: string;
	tags: string[];
	title: string;
	updatedAt: string;
}

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

				const renamedFile = this.getRenamedFilename({
					fileBasename: frontmater.title,
					fileExtension: file.extension,
					id: frontmater.id,
					tags: frontmater.tags,
					timestamp: file.stat.ctime,
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

	private getRenamedFilename(payload: {
		timestamp: number;
		tags: string[] | string;
		fileBasename: string;
		fileExtension: string;
	}): string {
		const slug = format(new Date(payload.timestamp), 'YYYYMMDDThhmmss');
		const formattedFilename = this.formatToKebabCase(
			String(payload.fileBasename),
		);
		const formattedTags = this.getFormatedTags(payload.tags);

		return `${slug}--${formattedFilename}${formattedTags}.${payload.fileExtension}`;
	}

	private formatToKebabCase(payload: string): string {
		return payload
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/[\s_]+/g, '-')
			.replace(/\//g, '-')
			.toLowerCase();
	}

	private getFormatedTags(tags?: string[] | string): string {
		switch (typeof tags) {
			case 'undefined':
				return '';

			case 'string':
				return `__${tags}`;

			case 'object':
				if (Array.isArray(tags) && tags[0] !== null) {
					const formattedTags = tags.map((tag) =>
						this.formatToKebabCase(tag),
					);

					return `__${formattedTags.join('_')}`;
				}

				return '';

			default:
				return '';
		}
	}
}
