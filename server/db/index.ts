import { connect, connection } from "mongoose";
import { config } from "dotenv";
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error("DATABASE_URL is not set");

export async function connectToDatabase() {
  // check database is already connected or not
  if (connection.readyState === 1)
    return console.log("Already connected to database");

  try {
    await connect(DATABASE_URL as string, {
      serverSelectionTimeoutMS: 30000, // Example: 30 seconds
      socketTimeoutMS: 45000, // Example: 45 seconds
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      bufferCommands: false,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
    throw new Error("Error connecting to database");
  }
}

// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// // import { reader } from "../schemas";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// export const db = drizzle(pool, {
//   schema: {
//     // reader,
//   },
// });
