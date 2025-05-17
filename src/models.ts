export type IFrontMatterProperty = string | undefined | null;
export type ITags = string[] | IFrontMatterProperty;

export interface IFrontMatter {
  createdAt: IFrontMatterProperty;
  id: IFrontMatterProperty;
  tags: ITags;
  title: IFrontMatterProperty;
  updatedAt: IFrontMatterProperty;
}

export interface ISanitizedFrontMatter {
  readonly createdAt: string;
  readonly id: string;
  readonly tags: string[];
  readonly title: string;
  readonly updatedAt: string;
}
