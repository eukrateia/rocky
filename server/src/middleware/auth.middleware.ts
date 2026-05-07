import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function protect(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
