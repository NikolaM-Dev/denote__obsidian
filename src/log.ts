import { Notice } from 'obsidian';

// TODO: Change to use settings
const DEBUG_MODE = true;

export function log(msg: string): void {
  if (!DEBUG_MODE) return;

  console.log(msg);
}

export function notify(msg: string): void {
  if (!DEBUG_MODE) return;

  new Notice(msg);
}
