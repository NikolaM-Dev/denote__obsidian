export interface IDenoteSettings {
  autoRenameFile: { excludedDirectories: string[] };
  sanitizeFrontMatter: { excludedTags: string[] };
}

export function getSettings(): IDenoteSettings {
  return {
    autoRenameFile: {
      excludedDirectories: ['4-archives/templates/obsidian'],
    },
    sanitizeFrontMatter: {
      excludedTags: [
        'journal/daily',
        'journal/monthly',
        'journal/quaterly',
        'journal/weekly',
        'journal/yearly',
      ],
    },
  };
}
