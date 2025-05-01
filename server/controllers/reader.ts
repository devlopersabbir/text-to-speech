import axios from "axios";
import { Request, Response } from "express";
import stream from "../modules/stream";
import ReaderModel from "../schemas/reader";
import aws from "../aws";
import { getFilename } from "../utils";
import { getBufferFromUrl } from "../services";
import ashraCache from "../cache";
import { CacheType } from "../@types";
import { connectToDatabase } from "../db";

export class Reader {
  public static async store(req: Request, res: Response) {
    const { input } = req.body;
    if (!input || input.length === 2) return res.send("Invalid input");
    const sentence = stream.slug(input, "_");
    const filename = getFilename(sentence, "mp3");

    // try to get from cache
    // if we don't get our expected output from the cache then just make a api request to the database
    const isCacheSentence = ashraCache.getCache(sentence);
    if (isCacheSentence?.sentence || isCacheSentence?.audioBuffer) {
      console.log("come from cache");
      return res.status(200).send(isCacheSentence.audioBuffer);
    }

    try {
      await connectToDatabase();
      const isSentence = await ReaderModel.findOne({
        sentence,
      });

      if (isSentence) {
        // We will get our audio file url as string
        const audioFileUrl = await aws.index(filename);
        // once we get our audio file url as string then we have follow the next step
        // from the url we have to convert that as array buffer
        const buffer = await getBufferFromUrl(audioFileUrl);
        console.log("Reusing sentence.");

        // Once we get our buffer then just send that buffer to the client as a response buffer
        // before sending response just add that buffer to the node-cache
        ashraCache.storeCache(sentence, {
          audioBuffer: buffer,
          sentence,
        } as CacheType);
        return res.send(buffer);
      }

      const { buffer } = await stream.main({ input });
      // Once we get our buffer data then `put` that buffer to the AWS S3 bucket
      const pusherURL = await aws.store(filename, "audio/mpeg3");
      const response = await axios.put(pusherURL, buffer);
      if (response.status !== 200)
        return console.error("Fail to upload audio file");

      const doc = await ReaderModel.create({
        sentence,
        filename,
      });
      // Once we get our buffer then just send that buffer to the client as a response buffer
      // before sending response just add that buffer to the node-cache
      ashraCache.storeCache(sentence, {
        audioBuffer: buffer,
        sentence,
      } as CacheType);
      await doc.save();

      console.log("Sentence is saved!");
      return res.send(buffer);
    } catch (error: any) {
      console.error("erro: ", error);
      res.status(500).json({ message: "Internal server error!", error });
    }
  }

  public static async index(req: Request, res: Response) {
    res.json({ message: "get reader" });
  }

  public static async update(req: Request, res: Response) {
    res.json({ message: "put reader" });
  }

  public static async remove(req: Request, res: Response) {
    res.json({ message: "delete reader" });
  }
}
