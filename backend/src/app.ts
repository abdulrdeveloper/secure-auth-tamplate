import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app: express.Application = express();

const allowedOrigins = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(
  (
    error: Error & { status?: number; type?: string },
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    if (error.type === "entity.parse.failed") {
      return res.status(400).json({ message: "Invalid JSON body" });
    }

    if (error.type === "entity.too.large") {
      return res.status(413).json({ message: "Request body is too large" });
    }

    console.error("Unhandled error:", error);
    res.status(500).json({ message: "Internal server error" });
  },
);

export default app;
