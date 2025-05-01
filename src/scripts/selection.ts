import Browser from "webextension-polyfill";
import {
  FloatingButtonForDetecting,
  statusImage,
} from "../constants/floatingButton";
import { apiUrl } from "../lib";

class AshraTextSelection {
  private API_URI: string;
  private audioContext: AudioContext | null;
  private source: AudioBufferSourceNode | null;
  private controllButtonId: string;

  constructor() {
    this.API_URI = apiUrl;
    this.audioContext = null;
    this.source = null;
    this.controllButtonId = "ashra__reader__floating__controll__button";
  }
  public async run(selectionText: string) {
    const blob = await this.sendRequest(selectionText);
    if (!blob) return console.log("Blob not found!");

    const arrayBuffer = await blob.arrayBuffer();
    this.playAudio(arrayBuffer);
  }

  private async sendRequest(text: string): Promise<Blob | undefined> {
    // need to change when it's on production
    const response = await fetch(this.API_URI, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });
    if (!response.ok) {
      throw new Error("Failed to convert text to speech on server");
    }
    return await response.blob();
  }

  private async playAudio(arrayBuffer: ArrayBuffer) {
    this.audioContext = new AudioContext();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.audioContext.destination);
    this.source.start();

    this.audioPlaying(true); // the icon of playing audio

    this.source.onended = () => {
      console.log("finished");
      this.audioPlaying(false); // remove our floating icon
      this.stopAudio();
    };
  }

  private audioPlaying(isPlaying: boolean) {
    if (isPlaying) {
      const existingButton = document.querySelector(
        `#${this.controllButtonId}`
      );
      if (existingButton) return;

      const button = FloatingButtonForDetecting(
        this.controllButtonId,
        statusImage.stop,
        60
      );
      button.addEventListener("click", () => {
        this.stopAudio();
      });

      document.body?.appendChild(button);
    } else {
      this.stopAudio();
    }
  }

  async stopAudio() {
    const buttonToRemove = document.querySelector(
      `#${this.controllButtonId}`
    ) as HTMLImageElement | null;
    if (buttonToRemove) {
      document.body?.removeChild(buttonToRemove);
    }

    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }
}

Browser.runtime.onMessage.addListener((message) => {
  if (message.selection.length >= 2) {
    const selec = new AshraTextSelection();
    selec.run(message.selection);
  }
});
