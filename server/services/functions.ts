import axios from "axios";

/**
 * @description (**Get Buffer From Url**) method will help us to get a buffer from a audio file url
 *
 * @param {string} url Audio file url like a `HTTPS` link
 *
 * @returns {Promise<Buffer>} If will return a `promise` of `buffer` data
 */
export async function getBufferFromUrl(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(await response.data, "base64");
    return buffer;
  } catch (error) {
    console.error("Error when facing audio file");
    throw error;
  }
}
