import express, { Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { ImageRouter } from "./routes/image";
import cors from "cors";

dotenv.config({ path: "./dev.env" });

const app = express();

app.use(cors());
app.use(express.static("./public"));
app.use(express.static("./media"));
app.use("/api/image/", ImageRouter);

function htmlRender(_, response: Response) {
  response.sendFile(path.join(__dirname, "../public/index.html"));
}
// app.use(/^(?!\/(api|media)).*/, htmlRender);
app.use("/", htmlRender);
app.use("/crop", htmlRender);
app.use("/slice", htmlRender);
app.use("/resize", htmlRender);
app.use("/color", htmlRender);

app.listen(process.env.PORT, () => {
  console.log(`Server Started at ${process.env.PORT}`);
});
