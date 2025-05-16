export type IFrontMatterProperty = string | undefined | null;
export type ITags = string[] | IFrontMatterProperty;

export interface IFrontMatter {
	readonly createdAt: IFrontMatterProperty;
	readonly updatedAt: IFrontMatterProperty;

	id: IFrontMatterProperty;
	tags: ITags;
	title: IFrontMatterProperty;
}

export interface IRenameFilenamePayload {
	readonly fileBasename: string;
	readonly fileExtension: string;
	readonly id: string;
	readonly tags: ITags;
}
