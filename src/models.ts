export type IFrontMatterProperty = string | undefined | null;
export type ITags = string[] | IFrontMatterProperty;

export interface IFrontMatter {
	createdAt: IFrontMatterProperty;
	id: IFrontMatterProperty;
	tags: ITags;
	title: IFrontMatterProperty;
	updatedAt: IFrontMatterProperty;
}

export interface IRenameFilenamePayload {
	readonly fileBasename: string;
	readonly fileExtension: string;
	readonly id: string;
	readonly tags: ITags;
}
