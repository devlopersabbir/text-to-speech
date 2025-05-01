import { Model, Schema, model, models } from "mongoose";
import { TReader } from "../@types";
// import { text, uuid, timestamp, serial, pgTable } from "drizzle-orm/pg-core";

// export const reader = pgTable("reader", {
//   id: serial("id").primaryKey(),
//   uuid: uuid("uuid").unique().defaultRandom(),

//   sentence: text("sentence").notNull().unique(),
//   audio: text("audio").notNull(),

//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });

const readerSchema = new Schema<TReader>(
  {
    sentence: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReaderModel: Model<TReader> =
  models.Reader || model<TReader>("Reader", readerSchema);
export default ReaderModel;
