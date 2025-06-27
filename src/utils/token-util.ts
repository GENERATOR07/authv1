import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { isTokenBlacklisted } from "../services/token-service";

export function generateToken(payload: { userId: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  if (isTokenBlacklisted(token)) {
    throw new Error("Token has been invalidated");
  }
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}
