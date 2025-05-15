export type ITags = string[] | string | undefined;

export interface IFrontMatter {
	readonly createdAt: string;
	readonly id: string;
	readonly tags: ITags;
	readonly title: string;
	readonly updatedAt: string;
}

export interface IRenameFilenamePayload {
	readonly fileBasename: string;
	readonly fileExtension: string;
	readonly id: string;
	readonly tags: ITags;
}
