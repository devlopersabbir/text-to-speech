export type TReader = {
  sentence: string;
  filename: string;
};

export type TFile = "mp3" | "m4a" | "flac" | "mp4" | "wav" | "wma" | "aac";

export type TAudioContentType =
  | "audio/mpeg3"
  | "audio/x-mpeg-3"
  | "video/mpeg"
  | "video/x-mpeg";

export type CacheType = {
  audioBuffer: Buffer;
  sentence: string;
};

export type TCache = {
  key: string;
  value: {
    audioBuffer: Buffer;
    sentence: string;
  };
};
