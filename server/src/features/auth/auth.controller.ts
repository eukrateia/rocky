import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "./auth.validation";
import { getUserById, loginUser, logoutUser, refreshSession, registerUser } from "./auth.service";

function cookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: production,
    sameSite: production ? "strict" as const : "lax" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerSchema.parse(req.body);
    const user = await registerUser(data.name, data.email, data.password);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = loginSchema.parse(req.body);
    const session = await loginUser(data.email, data.password);
    res.cookie("refreshToken", session.refreshToken, cookieOptions());
    res.json({ user: session.user, accessToken: session.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "Missing refresh token" });
    const session = await refreshSession(token);
    res.cookie("refreshToken", session.refreshToken, cookieOptions());
    res.json({ user: session.user, accessToken: session.accessToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.refreshToken;
    if (token && process.env.JWT_REFRESH_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { id: string };
        await logoutUser(decoded.id);
      } catch {}
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user?.id;
    const user = await getUserById(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}
