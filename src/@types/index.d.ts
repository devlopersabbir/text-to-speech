type TTextNodesWithTags = {
  tag: HTMLElement;
  text: string;
};

type THelperTag = "pre" | "strong" | "b" | "a" | "span";
type TAudioStatus = { link: string; MODE: "ON" | "OFF" };
type THelperTags = {
  [key: string]: boolean;
};

type TStatus = "stop" | "speaker";
type TStatusImage = {
  speaker: string;
  stop: string;
};
type TIStatus = {
  status: TStatus;
};
