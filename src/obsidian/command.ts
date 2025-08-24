import { Command } from 'obsidian';

interface Payload {
  id: string;
  name: string;

  callback: () => any;
}

const COMMAND_PREFIX = 'denote';

export function getCommand(payload: Payload): Command {
  return {
    ...payload,
    id: `${COMMAND_PREFIX}--${payload.id}`,
    name: `${payload.name} Command`,
  };
}
