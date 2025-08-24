import { Command } from 'obsidian';

import { toKebabCase, toTitleCase } from 'src/lib';

interface Payload {
  name: string;

  callback: () => any;
}

const COMMAND_PREFIX = 'denote';

export function getCommand(payload: Payload): Command {
  return {
    ...payload,
    id: `${COMMAND_PREFIX}--${toKebabCase(payload.name)}`,
    name: `${toTitleCase(payload.name)} Command`,
  };
}
