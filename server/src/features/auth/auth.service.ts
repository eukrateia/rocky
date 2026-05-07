import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model";

type PublicUser = {
  id: string;
  name: string;
  email: string;
};

function publicUser(user: any): PublicUser {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

function accessSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return process.env.JWT_SECRET;
}

function refreshSecret() {
  if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is missing");
  return process.env.JWT_REFRESH_SECRET;
}

function signAccessToken(userId: string) {
  return jwt.sign({ id: userId }, accessSecret(), { expiresIn: "15m" });
}

function signRefreshToken(userId: string) {
  return jwt.sign({ id: userId }, refreshSecret(), { expiresIn: "7d" });
}

export async function registerUser(name: string, email: string, password: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email is already registered");

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  return publicUser(user);
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  await user.save();

  return { user: publicUser(user), accessToken, refreshToken };
}

export async function refreshSession(refreshToken: string) {
  const decoded = jwt.verify(refreshToken, refreshSecret()) as { id: string };
  const user = await User.findById(decoded.id);
  if (!user || !user.refreshTokenHash) throw new Error("Invalid refresh token");

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) throw new Error("Invalid refresh token");

  const accessToken = signAccessToken(user._id.toString());
  const newRefreshToken = signRefreshToken(user._id.toString());
  user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
  await user.save();

  return { user: publicUser(user), accessToken, refreshToken: newRefreshToken };
}

export async function logoutUser(userId?: string) {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
}

export async function getUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw new Error("User not found");
  return publicUser(user);
}
