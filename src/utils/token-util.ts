import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(payload: { userId: string }) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}
