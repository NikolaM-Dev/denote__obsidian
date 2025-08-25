export function removeConsecutiveSpaces(payload: string): string {
  return payload.replace(/\s+/g, ' ');
}

export function trim(payload: string): string {
  return payload.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

export function toCapitalize(payload: string): string {
  return payload.charAt(0).toUpperCase() + payload.slice(1);
}

export function toKebabCase(payload: string): string {
  // Replace whitespace with hyphens
  let result = payload.replace(/\s+/g, '-');

  // Replace problematic symbols
  result = result.replace(/\//g, '-').replace(/\\/g, '-');

  // Remove any characters that are not alphanumeric or hyphens
  result = result.replace(/[^a-zA-Z0-9-]/g, '');

  // Convert to lowercase
  result = result.toLowerCase();

  // Remove leading/trailing hyphens
  result = result.replace(/^-+|-+$/g, '');

  // Replace multiple consecutive hyphens with a single hyphen
  result = result.replace(/-+/g, '-');

  return result;
}

export function toTitleCase(payload: string): string {
  const formattedTitle = trim(payload).toLowerCase();

  // Split the string into words
  const words = formattedTitle.split(/\s+/);

  // Words to format with a specialFormat
  const specialWords: Record<string, string> = {
    ai: 'AI',
    minecraft: 'MineCraft',
  };

  // Capitalize the first word and other words not in the lowercase list
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (specialWords[word]) {
      words[i] = specialWords[word];

      continue;
    }

    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  // Join the words back together
  return words.join(' ');
}

export function toFileName(payload: string): string {
  if (typeof payload !== 'string') {
    throw new Error('Input must be a string.');
  }

  // 1. Trim leading/trailing whitespace
  let cleanedFilename = payload.trim();

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
      `Filename "${payload}" was truncated to ${MAX_FILENAME_LENGTH} characters.`,
    );
  }

  // 6. Check if the filename is empty after cleaning
  if (cleanedFilename.length === 0) {
    throw new Error('Filename cannot be empty after cleaning.');
  }

  return cleanedFilename;
}
