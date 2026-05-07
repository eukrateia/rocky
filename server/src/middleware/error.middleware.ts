import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", errors: err.flatten().fieldErrors });
  }

  if (err instanceof Error) {
    const status = err.message.includes("Invalid") || err.message.includes("Unauthorized") ? 401 : 400;
    return res.status(status).json({ message: err.message });
  }

  res.status(500).json({ message: "Internal server error" });
}
