import OpenAI from "openai";

class Stream {
  private openAi: OpenAI; //** instance of OPENAI */

  constructor() {
    this.openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async main({ input }: { input: string }) {
    const response = await this.openAi.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input,
      response_format: "opus",
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return { buffer };
  }

  public slug(
    input: string,
    separator: string,
    isLower: boolean = true
  ): string {
    let text: string = "";
    const splitedText = text.split(" ");
    if (splitedText.length <= 5) {
      text = input.replace(/[^A-Za-z]+/g, separator);
    } else {
      const sliceText = splitedText.slice(0, 5);
      const joinText = sliceText.join(" ");
      text = joinText.replace(/[^A-Za-z]+/g, separator);
    }
    return isLower ? text.toLowerCase() : text;
  }
}
export default new Stream();
