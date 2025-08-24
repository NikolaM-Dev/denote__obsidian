import { Command } from 'obsidian';

import { toKebabCase, toTitleCase } from 'src/lib';

export interface ICommand {
  name: string;

  callback: () => any;
}

const COMMAND_PREFIX = 'denote';

export function getCommand(payload: ICommand): Command {
  return {
    callback: payload.callback,
    id: `${COMMAND_PREFIX}--${toKebabCase(payload.name)}`,
    name: `${toTitleCase(payload.name)} Command`,
  };
}
