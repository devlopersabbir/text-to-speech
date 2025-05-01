import { countLines } from "../helper";
import { targetWebsiteUrl } from "../lib";

// Helper function to calculate the character position of a word
export function getWordPosition(words: any, index: number) {
  let position = 0;
  for (let i = 0; i < index; i++) {
    position += words[i].length + 1; // +1 for the space or end of word
  }
  return position;
}

export function random(start: number = 2000, end: number = 500) {
  return Math.floor(Math.random() * (start - end) + end);
}

export function wait(duration?: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, duration || random());
  });
}

export function getLineHeight(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  let lineHeight: number;

  if (style.lineHeight === "normal") {
    // Estimate line-height if set to 'normal'
    const fontSize = parseFloat(style.fontSize);
    lineHeight = fontSize * 1.2; // A common multiplier for 'normal' line-height
  } else {
    lineHeight = parseFloat(style.lineHeight);
  }
  return lineHeight;
}

window.addEventListener("load", () => {
  const article = document.querySelector("article");
  const totalLines = countLines(article as HTMLElement);
  console.log("Total lines in the article:", totalLines);
});

window.addEventListener("resize", () => {
  const article = document.querySelector("article");
  const totalLines = countLines(article as HTMLElement);
  console.log("Total lines in the article:", totalLines);
});

export function nodeToElement(node: Node): HTMLElement {
  return node as HTMLElement;
}

export function findClosestSection(
  element: HTMLElement | null
): HTMLElement | null {
  if (!element) return null;
  if (element.tagName === "SECTION") return element;
  return findClosestSection(element.parentElement);
}

export function isTargetWebsite(): boolean {
  const url = window.location;
  if (
    url.href.includes(targetWebsiteUrl) ||
    url.hostname.includes(targetWebsiteUrl)
  )
    return true;
  return false;
}
