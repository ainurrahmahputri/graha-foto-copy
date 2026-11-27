import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// CORS_ORIGIN boleh berisi beberapa origin dipisah koma. Kosong = izinkan semua (hanya untuk lokal).
const origins = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(
  cors({
    origin: origins.length ? origins : true,
    allowedHeaders: ["Authorization", "X-Client-Id", "Content-Type"],
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
