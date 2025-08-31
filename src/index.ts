import express, { type Express, type Request, type Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./midlewares/errors";

const app: Express = express();

app.use(express.json());
app.use("/api", rootRouter);
app.use(errorMiddleware);

const port = Number(PORT);
app.listen(port, () => {
  console.log(`Node is listening on port: ${port}`);
});
