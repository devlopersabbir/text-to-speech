/** all utility functions and interface */

import { TFile } from "../@types";

/**
 * @description File name parser helper function
 *
 * @param {string} sentence You must need to pass a slug
 * @param {TFile} extension Need a file extension like for example
 *
 * @returns {string} - It will return a file name with extension if you send
 */
export function getFilename(sentence: string, extension?: TFile): string {
  const parse = sentence.split("_").slice(0, 3).join("_").toLowerCase();
  if (!extension) return parse;
  return `${parse}.${extension}`;
}
