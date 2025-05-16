export type IFrontMatterProperty = string | undefined | null;
export type ITags = string[] | IFrontMatterProperty;

export interface IFrontMatter {
	readonly createdAt: IFrontMatterProperty;
	readonly title: IFrontMatterProperty;
	readonly updatedAt: IFrontMatterProperty;

	id: IFrontMatterProperty;
	tags: ITags;
}

export interface IRenameFilenamePayload {
	readonly fileBasename: string;
	readonly fileExtension: string;
	readonly id: string;
	readonly tags: ITags;
}
