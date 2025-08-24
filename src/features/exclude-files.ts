import { TFile } from 'obsidian';

export function hasToSkipFile(
  file: TFile,
  skipPatterns: string[] = ['Journal', 'templates', 'Sources', 'snippets'],
): boolean {
  let flag = false;
  for (const element of skipPatterns) {
    if (!file.path.includes(element)) continue;

    flag = true;
    break;
  }

  return flag;
}
