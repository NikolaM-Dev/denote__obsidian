export type ITags = string[] | string | undefined | null;

export interface IFrontMatter {
	readonly createdAt: string;
	readonly id: string;
	readonly title: string;
	readonly updatedAt: string;

	tags: ITags;
}

export interface IRenameFilenamePayload {
	readonly fileBasename: string;
	readonly fileExtension: string;
	readonly id: string;
	readonly tags: ITags;
}
