import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import { ImageRouter } from "./routes/image";

dotenv.config({ path: "../secret.env" });

const app = express();

app.use("/api/image", ImageRouter);

export const handler = serverless(app);
