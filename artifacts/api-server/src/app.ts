import express, { type ErrorRequestHandler, type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const bodyParserErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (
    error instanceof Error &&
    "type" in error &&
    error.type === "entity.too.large"
  ) {
    res.status(413).json({
      error: "Request is too large. Choose an image no larger than 3 MB.",
    });
    return;
  }

  if (
    error instanceof Error &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    res.status(400).json({ error: "Request body must be valid JSON." });
    return;
  }

  next(error);
};

app.use(bodyParserErrorHandler);

export default app;
