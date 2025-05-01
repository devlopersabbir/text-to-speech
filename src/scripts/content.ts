import {
  FloatingButton,
  FloatingButtonForDetecting,
  statusImage,
} from "../constants/floatingButton";
import { countLines } from "../helper";
import { findClosestSection, isTargetWebsite } from "../utils";
import { margableTag, apiUrl } from "../lib";

class ReadArticle {
  private API_ENDPOINT: string;
  private audioContext: AudioContext | null;
  private source: AudioBufferSourceNode | null;
  private isPlaying: boolean;
  private currentNode: HTMLElement | null;
  private nodeArray: Array<any> = [];
  private nodeCount: number = 0;
  private playingSectionButton: HTMLElement | null | undefined;
  private numberOfLineInElement: number = 0;
  private animationFrameHandler: number | null = null;
  private controllButtonId: string;
  private floatingButtonsArray: HTMLImageElement[] | null;

  constructor() {
    this.API_ENDPOINT = apiUrl; // need to change when it's on production
    // this.API_ENDPOINT = "http://localhost:5001/api/v1/ashra-reader";
    this.audioContext = null;
    this.source = null;
    this.isPlaying = false;
    this.currentNode = null;
    this.playingSectionButton = null;
    this.animationFrameHandler = null;
    this.controllButtonId =
      "ashra__reader__floating__controll__button__contentScript";
    this.floatingButtonsArray = null;
  }

  run(sections: NodeListOf<HTMLElement>) {
    const sectionsArray = Array.from(sections);
    const floatingIconButton = document.querySelector("#ashra__reader__button");

    // Add floating button to each section heading
    sectionsArray.forEach((section, index: number) => {
      const heading =
        section.querySelector("h1") ?? section.querySelector("h2");
      if (heading) {
        if (!floatingIconButton)
          heading.appendChild(
            FloatingButton("ashra__reader__button", index.toString())
          );
      }
    });

    // Add click event listener to each button
    const buttons: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      "#ashra__reader__button"
    );
    buttons.forEach((button: HTMLImageElement, index: number) => {
      button.addEventListener("click", async () => {
        // get actual sections
        const section = findClosestSection(button);
        // mute all buttons icons
        const buttonsArray = Array.from(buttons);
        this.floatingButtonsArray = buttonsArray;
        if (!button.dataset) return console.log("data set not found!");
        this.muteablehelper(
          Number(button.dataset?.indexOfButton),
          buttonsArray
        );

        // Stop the currently playing audio if any
        if (this.isPlaying) {
          await this.stopAudio();
        }

        if (section) {
          this.extractContent(section, button);
        }
      });
    });
  }

  muteablehelper(dataset: number, buttons: HTMLImageElement[]) {
    buttons.forEach((item) => {
      if (!item.dataset) return console.log("data set not found!");
      if (dataset !== Number(item.dataset?.indexOfButton)) {
        this.updateButtonIcon(item, { status: "speaker" });
      }
    });
  }

  async extractContent(section: HTMLElement, button: HTMLImageElement) {
    try {
      this.isPlaying = true;
      this.audioPlayingFloatingButton(true);
      await this.getTextContentAndSendRequest(section, button);
    } catch (error) {
      this.audioPlayingFloatingButton(false);
    } finally {
      this.isPlaying = false;
      this.audioPlayingFloatingButton(false);
    }
  }

  private audioPlayingFloatingButton(isPlaying: boolean) {
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

  getTextNodesWithTags(element: HTMLElement): TTextNodesWithTags[] {
    const mergeTags: Set<string> = new Set(margableTag);
    let textNodesWithTags: TTextNodesWithTags[] = [];

    function traverse(node: any, parentNode: HTMLElement | null = null) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
        if (parentNode) {
          const existing = textNodesWithTags.find(
            (item) => item.tag === parentNode
          );
          if (existing) {
            existing.text += " " + node.textContent.trim();
          } else {
            textNodesWithTags.push({
              tag: parentNode,
              text: node.textContent.trim(),
            });
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (mergeTags.has(node.tagName.toLowerCase())) {
          node.childNodes.forEach((child: any) => traverse(child, parentNode));
        } else {
          node.childNodes.forEach((child: any) => traverse(child, node));
        }

        // Special handling for <a> tags to append link text
        // if (node.tagName.toLowerCase() === "a" && parentNode) {
        //   const linkText = `(This is the link - ${node.textContent.trim()})`;
        //   const existing = textNodesWithTags.find(
        //     (item) => item.tag === parentNode
        //   );
        //   if (existing) {
        //     existing.text += ` ${linkText}`;
        //   } else {
        //     textNodesWithTags.push({
        //       tag: parentNode,
        //       text: linkText,
        //     });
        //   }
        // }
      }
    }

    traverse(element);

    // Clean up text by removing extra spaces
    textNodesWithTags = textNodesWithTags.map((item) => ({
      ...item,
      text: item.text.replace(/\s+/g, " ").trim(),
    }));

    return textNodesWithTags;
  }
  /**
   * if there has any (**pre | code**) tag then i have to remove that kind tag.
   *
   * if the website is matched with our targeted hostname/href then remove also (**script | summary**) tag
   *
   * (deprecated) **TODO:** In `v0.1.1` i skip to speech equation. But i have to again start it if **ashra boss** want
   *
   */
  removingElements(textnodes: TTextNodesWithTags[]): TTextNodesWithTags[] {
    const excludedTags = isTargetWebsite()
      ? ["pre", "code", "script", "summary", "title"]
      : ["pre", "code"];

    return textnodes.filter(
      (node) => !excludedTags.includes(node.tag.tagName.toLowerCase())
      // && !node.tag.id?.startsWith("equation")
    );
  }

  async getTextContentAndSendRequest(
    section: HTMLElement,
    button: HTMLImageElement
  ) {
    let textNodesWithTags = this.getTextNodesWithTags(section);
    console.log("before remove: ", textNodesWithTags);
    textNodesWithTags = this.removingElements(textNodesWithTags);
    console.log("after remove: ", textNodesWithTags);

    const actualTagWithText = textNodesWithTags.filter(
      (value: TTextNodesWithTags) =>
        value.text.length >= 3 && value.text !== "Start" && value.text !== "#"
    );

    // console.log("final: ", actualTagWithText);
    for (let i = 0; i < actualTagWithText.length; i++) {
      if (actualTagWithText[i].text && actualTagWithText[i].tag) {
        await this.handleNodeRequest(
          actualTagWithText[i].text,
          actualTagWithText[i].tag
        );
        console.log("one request done.");
      }
    }
  }

  async handleNodeRequest(textContent: string, node: ChildNode) {
    try {
      const blob = (await this.sendRequest(textContent)) as Blob;
      await this.playAudioAndHighlight(await blob.arrayBuffer(), node);

      this.nodeCount++;
      this.nodeArray.push(node);
    } catch (error) {
      console.error("Error handling node request: ", error);
    }
  }

  async playAudioAndHighlight(blobArrayBuffer: ArrayBuffer, node?: ChildNode) {
    this.audioContext = new AudioContext();
    const audioBuffer = await this.audioContext.decodeAudioData(
      blobArrayBuffer
    );
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = audioBuffer;
    this.source.connect(this.audioContext.destination);
    this.source.start();

    // if (button) this.updateButtonIcon(button, );

    const audioEndPromise = new Promise<void>((resolve) => {
      this.source!.onended = () => {
        // if (button) this.updateButtonIcon(button, "muted");
        this.removeHighlight(this.currentNode);
        resolve();
      };
    });

    if (node) {
      this.currentNode = node as HTMLElement;
      await this.smoothHighlightArticle(node, audioBuffer.duration);
    }

    await audioEndPromise;
  }

  async smoothHighlightArticle(node: ChildNode, duration: number) {
    let htmlNode = node as HTMLElement;
    const existingStyle = window.getComputedStyle(htmlNode);

    if (!htmlNode || !htmlNode.innerText) return;

    const totalDuration = duration * 1000;
    this.numberOfLineInElement = countLines(htmlNode);
    window.addEventListener("resize", () => {
      this.numberOfLineInElement = countLines(htmlNode);
    });

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const elapsedTime = currentTime - startTime;

      const progress = Math.min(elapsedTime / totalDuration, 1);
      const percentage = progress * 100;

      if (!this.isPlaying) {
        if (this.animationFrameHandler) {
          cancelAnimationFrame(this.animationFrameHandler);
        }
        return console.log("stopped highlighting...");
      }

      htmlNode.style.background = `linear-gradient(to right, yellow ${percentage}%, transparent ${percentage}%)`;
      if (progress < 1) {
        this.animationFrameHandler = requestAnimationFrame(animate);
      } else {
        htmlNode.classList.remove("ashra__reader__hightlight");
        htmlNode.removeAttribute("style");
        htmlNode.style.lineHeight = existingStyle.lineHeight;
      }
    };

    htmlNode.style.fontSize = existingStyle.fontSize;
    htmlNode.style.fontWeight = existingStyle.fontWeight;

    htmlNode.classList.add("ashra__reader__hightlight");
    htmlNode.style.transition = "background 0.5s ease-in-out";

    this.animationFrameHandler = requestAnimationFrame(animate);
  }

  removeHighlight(node: HTMLElement | null) {
    if (node) {
      node.classList.remove("ashra__reader__hightlight");
      node.removeAttribute("style");
      node.style.background = "";
      node.style.transition = "";
    }
  }

  async sendRequest(text: string): Promise<Blob | undefined> {
    const response = await fetch(this.API_ENDPOINT, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: text }),
    });
    if (!response.ok) {
      throw new Error("Failed to convert text to speech on server");
    }
    return await response.blob();
  }

  async stopAudio() {
    const buttonToRemove = document.querySelector(
      `#${this.controllButtonId}`
    ) as HTMLImageElement | null;
    if (buttonToRemove) {
      document.body?.removeChild(buttonToRemove);
    }
    if (this.floatingButtonsArray)
      this.muteablehelper(999999999, this.floatingButtonsArray);
    if (this.source) {
      this.source.stop();
      this.source = null;
    }
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
    this.isPlaying = false;
    if (this.animationFrameHandler) {
      cancelAnimationFrame(this.animationFrameHandler);
      this.animationFrameHandler = null;
    }
    this.removeHighlight(this.currentNode);
  }

  updateButtonIcon(button: HTMLImageElement, state: TIStatus) {
    const iconSrc =
      state.status === "speaker"
        ? statusImage.speaker
        : state.status === "stop"
        ? statusImage.stop
        : "";
    button.src = iconSrc;
  }
}

function main() {
  const article = document.querySelector("article");
  const sections = article?.querySelectorAll("section");
  if (sections) {
    const readArticle = new ReadArticle();
    readArticle.run(sections);
  }
}

main();
