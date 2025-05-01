import { config } from "dotenv";
config();
import { logger } from "dev-http-logger";
// import morgan from "morgan";
import express, { Request, Response } from "express";
import cors from "cors";
import { Reader } from "./controllers";
import { connectToDatabase } from "./db";
import path from "path";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  logger({
    origin: true,
    showHeader: true,
  })
);
// app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));
app.post("/api/v1/ashra-reader", Reader.store);
// app.post("/", (req: Request, res: Response) => {
//   const { input } = req.body;
//   if (!input) return res.status(404).json({ message: "input not found!" });
//   return res.status(200).json({ message: "Hello", input });
// });
app.get("^/$|/index(.html)?", (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./", "views", "index.html"));
});
app.get("/*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./", "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

const PORT = process.env.SERVER_PORT || 8000;

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
