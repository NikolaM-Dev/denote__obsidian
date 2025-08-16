export function sortTags(tags: string[]): string[] {
  return tags.sort((a, b) => a.localeCompare(b));
}

export function trim(payload: string): string {
  return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cleanAndValidateFilename(filename: string): string {
  if (typeof filename !== 'string') {
    throw new Error('Input must be a string.');
  }

  // 1. Trim leading/trailing whitespace
  let cleanedFilename = filename.trim();

  // 2. Remove invalid Unix characters:
  //    - / (forward slash): directory separator
  //    - \0 (null byte): string terminator
  //    - Control characters (0x00-0x1F)
  //    - Reserved characters: <, >, :, ", |, ?, *
  //    - Any character that is not printable ASCII (optional, but good for cross-platform)
  //    - Consider also leading/trailing hyphens or underscores if they are problematic in your system
  cleanedFilename = cleanedFilename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');

  // 3. Replace multiple consecutive spaces with a single space
  cleanedFilename = cleanedFilename.replace(/\s+/g, ' ');

  // 4. Sanitize leading/trailing dots (can be problematic in some systems or for hidden files)
  cleanedFilename = cleanedFilename.replace(/^\.+|\.+$/g, '');

  // 5. Limit filename length (Unix typically has a limit, e.g., 255 bytes for ext4)
  //    Adjust this limit based on your specific file system and needs.
  const MAX_FILENAME_LENGTH = 255;
  if (cleanedFilename.length > MAX_FILENAME_LENGTH) {
    // Truncate and optionally add an ellipsis or hash to avoid collisions
    // For simplicity, we'll just truncate here.
    cleanedFilename = cleanedFilename.substring(0, MAX_FILENAME_LENGTH);
    console.warn(
      `Filename "${filename}" was truncated to ${MAX_FILENAME_LENGTH} characters.`,
    );
  }

  // 6. Check if the filename is empty after cleaning
  if (cleanedFilename.length === 0) {
    throw new Error('Filename cannot be empty after cleaning.');
  }

  return cleanedFilename;
}
