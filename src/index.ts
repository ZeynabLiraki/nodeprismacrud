import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";

const app: Express = express();
app.use(express.json());
app.use("/api", rootRouter);

const port = Number(PORT);
app.listen(port, () => {
  console.log(`Node is listening on port: ${port}`);
});
