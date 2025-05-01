export const urlRegex =
  /(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%_\+.~#=]{1,256}\.[a-zA-Z]{2,6}(?:\.[a-zA-Z]{2,6})?(?:\/[^\s]*)?/gi;

export function identifyLink(text: string): RegExpMatchArray | null {
  return text.match(urlRegex);
}

export function countLines(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const lineHeight = parseFloat(style.lineHeight);
  const height = parseFloat(style.height);
  return Math.round(height / lineHeight);
}
