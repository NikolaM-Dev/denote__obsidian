const TARGET_CLASSES = ['suggestion-container', 'modal-container'];

export function getIsSuggestionElementActive(): boolean {
  return TARGET_CLASSES.some((className) =>
    document.querySelector(`.${className}`),
  );
}
