import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token-util";
import { isTokenBlacklisted } from "../services/token-service";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const verifyAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  if (isTokenBlacklisted(token)) {
    return res.status(401).json({ error: "Token has been invalidated" });
  }

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
