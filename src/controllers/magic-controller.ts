import { Request, Response } from "express";
import { createUserIfNotExists } from "../services/user-service";
import { sendMagicLinkEmail } from "../utils/email-util";
import { generateToken, verifyToken } from "../utils/token-util";

export async function requestMagicLinkHandler(req: Request, res: Response) {
  console.log("requestMagicLinkHandler");
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await createUserIfNotExists(email);
  const token = generateToken({ userId: user._id as string });

  const magicLink = `http://localhost:4000/auth/magic-login?token=${token}`;
  await sendMagicLinkEmail(email, magicLink);

  return res.json({ message: "Magic link sent to email" });
}

export async function magicLoginHandler(req: Request, res: Response) {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const payload = verifyToken(token);

    return res.json({
      message: "Logged in successfully",
      userId: payload.userId,
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
