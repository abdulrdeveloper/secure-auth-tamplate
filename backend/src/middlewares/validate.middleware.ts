import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid input",
        errors: validation.error.flatten().fieldErrors,
      });
    }
    req.body = validation.data;
    next();
  };
};
