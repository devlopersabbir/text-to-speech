import { config } from "dotenv";
import {
  S3Client,
  // GetObjectCommand,
  PutObjectCommand,
  S3ClientConfigType,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TAudioContentType } from "../@types";
config();

class AWS {
  private client: S3Client;
  private bucket: string;
  private couldFront: string;

  /**
   * Constructor of AWS
   */
  constructor() {
    this.client = new S3Client(this.clientParams("us-east-2"));
    this.bucket = "ashra-reader-storage";
    this.couldFront = "https://d1kjwbby0mt06q.cloudfront.net";
  }
  /**
   * @description **(store)** method will help us to get uploadable url from `aws` that can be able to upload our **`mp3`** file
   *
   * @param {string} filename - audio file name. For example `audio.mp3`
   * @param {string} contentType - our storing content type (**which is header content type**)
   *
   * @returns {Promise<string>} `URL` - it will return a our reponse url as `string`
   */
  public async store(
    filename: string,
    contentType: TAudioContentType
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `audio/${filename}`,
      ContentType: contentType,
    });

    // get singed ul using command
    const url = await getSignedUrl(this.client, command);
    return url;
  }
  /**
   * @description - **(index)** method will help us to get object url from `aws`
   *
   * @param {string} Key - This is a file location with filename and extension. The key looks like `audio/myAudio.mp3`
   *
   * @returns {Promise<string>} `URL` - it will return a our reponse url as `string`
   */
  public async index(Key: string): Promise<string> {
    // const command = new GetObjectCommand({
    //   Bucket: this.bucket,
    //   Key: `audio/${Key}`,
    // });
    const url = `${this.couldFront}/audio/${Key}`;

    // get object url from couldFront
    // const url = await getSignedUrl(this.client, command);
    return url;
  }
  /**
   * @description **Private** need to change as our **AWS** `region`
   *
   * @returns {S3ClientConfig}
   */
  private clientParams(region: string): S3ClientConfig {
    const params: S3ClientConfigType = {
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    };
    return params;
  }
}

export default new AWS();
