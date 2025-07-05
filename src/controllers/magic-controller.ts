import { Request, Response } from "express";
import {
  createUserIfNotExists,
  updateUser,
  findUserById,
} from "../services/user-service";
import { sendMagicLinkEmail } from "../utils/email-util";
import { generateToken, verifyToken } from "../utils/token-util";
import { blacklistToken } from "../services/token-service";
import { env } from "../config/env";

export async function requestMagicLinkHandler(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const user = await createUserIfNotExists(email);
  const token = generateToken({ userId: user._id as string });

  const magicLink = `${env.FRONTEND_URL}/login?token=${token}`;
  console.log(magicLink);

  await sendMagicLinkEmail(email, magicLink);

  return res.json({ message: "Magic link sent to email" });
}

export async function magicLoginHandler(req: Request, res: Response) {
  const { token } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const payload = verifyToken(token);
    return res.json({
      message: "Logged in successfully",
      token: token, // Return the token for the client to store
    });
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function getProfileHandler(req: Request, res: Response) {
  try {
    const user = await findUserById(req.user!.userId);
    return res.json({
      user: {
        alias: user.alias,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        isMember: user.isMember,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  const updateData = req.body;

  // Remove any fields that shouldn't be updated
  const protectedFields = [
    "email",
    "loginMethod",
    "_id",
    "createdAt",
    "updatedAt",
    "isMember",
  ];
  protectedFields.forEach((field) => delete updateData[field]);

  // Validate string fields if provided
  const validations = {
    alias: { maxLength: 50 },
    displayName: { maxLength: 100 },
    bio: { maxLength: 500 },
  };

  for (const [field, rules] of Object.entries(validations)) {
    if (
      updateData[field] &&
      (typeof updateData[field] !== "string" ||
        updateData[field].length > rules.maxLength)
    ) {
      return res.status(400).json({
        error: `Invalid ${field} format. Must be a string with max length ${rules.maxLength}`,
      });
    }
  }

  try {
    const updatedUser = await updateUser(req.user!.userId, updateData);
    return res.json({
      message: "Profile updated successfully",
      profile: {
        alias: updatedUser.alias,
        displayName: updatedUser.displayName,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        isMember: updatedUser.isMember,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === "User not found") {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function logoutHandler(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Verify the token first to ensure it's valid
    verifyToken(token);
    // Add to blacklist
    blacklistToken(token);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
