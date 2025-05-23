import { TFile, App } from 'obsidian';

type OFrontMatterProperty = string | undefined | null;
type OTags = string[] | OFrontMatterProperty;

interface IOFrontMatter {
  createdAt: OFrontMatterProperty;
  id: OFrontMatterProperty;
  tags: OTags;
  title: OFrontMatterProperty;
  updatedAt: OFrontMatterProperty;
}

interface IFrontMatterPayload {
  file: TFile;
  app: App;
}

export interface UpdateFrontMatterPayload extends IFrontMatterPayload {
  newFrontMatter: Partial<IDFrontMatter>;
}

export interface IDFrontMatter {
  readonly createdAt: string;
  readonly id: string;
  readonly tags: string[];
  readonly title: string;
  readonly updatedAt: string;
}

export async function updateOFrontMatter(
  payload: UpdateFrontMatterPayload,
): Promise<void> {
  payload.app.fileManager.processFrontMatter(
    payload.file,
    (frontMatter: IOFrontMatter): void => {
      Object.entries(payload.newFrontMatter).forEach(([property, value]) => {
        // @ts-ignore
        frontMatter[property] = value;
      });
    },
  );
}

export async function getOFrontMatter(
  payload: IFrontMatterPayload,
): Promise<IOFrontMatter> {
  let _frontMatter: IOFrontMatter = {
    createdAt: null,
    id: null,
    tags: null,
    title: null,
    updatedAt: null,
  };

  await payload.app.fileManager.processFrontMatter(
    payload.file,
    async (frontMatter: IOFrontMatter): Promise<void> => {
      if (Object.entries(frontMatter).length === 0) return;

      _frontMatter = frontMatter;
    },
  );

  return _frontMatter;
}
