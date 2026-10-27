import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  console.error(`Error in ${req.method} ${req.originalUrl}:`, error);
  res.status(500).json({ message: "Internal server error" });
};
