const TARGET_CLASSES = ['menu', 'modal-container', 'suggestion-container'];

export function getIsSuggestionElementActive(): boolean {
  return TARGET_CLASSES.some((className) =>
    document.querySelector(`.${className}`),
  );
}
