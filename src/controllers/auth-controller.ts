import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";
import { findUserByEmail } from "../services/user-service";
import { UserModel } from "../models/user-model";
import { generateToken } from "../utils/token-util";

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export const googleLoginHandler = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Token missing" });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(403).json({ error: "Invalid Google token" });
    }

    let user = await findUserByEmail(payload.email);
    if (!user) {
      // Generate alias from name
      let alias = undefined;
      if (payload.name) {
        const nameParts = payload.name.trim().split(" ");
        if (nameParts.length >= 2) {
          alias =
            nameParts[0][0].toLowerCase() +
            nameParts[nameParts.length - 1].toLowerCase();
        } else {
          alias = nameParts[0].substring(0, 2).toLowerCase();
        }
      }
      user = await UserModel.create({
        email: payload.email,
        loginMethod: "oauth",
        displayName: payload.name,
        avatar: payload.picture,
        alias,
      });
    }

    const appToken = generateToken({ userId: String(user._id) });
    res.setHeader("Access-Control-Allow-Origin", env.FRONTEND_URL);
    res.header("Access-Control-Allow-Credentials", "true");

    res.cookie("auth-token", appToken, {
      httpOnly: env.PRODUCTION,
      secure: env.PRODUCTION,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ error: "Login failed" });
  }
};

export const googleLoginRedirectHandler = async (
  req: Request,
  res: Response
) => {
  const token = req.query.token as string;
  if (!token) {
    return res.redirect(`${env.FRONTEND_URL}/login`);
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.redirect(`${env.FRONTEND_URL}/login`);
    }

    let user = await findUserByEmail(payload.email);
    if (!user) {
      // Generate alias from name
      let alias = undefined;
      if (payload.name) {
        const nameParts = payload.name.trim().split(" ");
        if (nameParts.length >= 2) {
          alias =
            nameParts[0][0].toLowerCase() +
            nameParts[nameParts.length - 1].toLowerCase();
        } else {
          alias = nameParts[0].substring(0, 2).toLowerCase();
        }
      }

      user = await UserModel.create({
        email: payload.email,
        loginMethod: "oauth",
        displayName: payload.name,
        avatar: payload.picture,
        alias,
      });
    }

    const appToken = generateToken({ userId: String(user._id) });

    // Set the cookie
    res.setHeader("Access-Control-Allow-Origin", env.FRONTEND_URL);
    res.header("Access-Control-Allow-Credentials", "true");
    res.cookie("auth-token", appToken, {
      httpOnly: false, // must be false if reading from Next.js middleware
      secure: env.PRODUCTION,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to homepage
    return res.redirect(`${env.FRONTEND_URL}`);
  } catch (err) {
    console.error("Google login redirect error:", err);
    return res.redirect(`${env.FRONTEND_URL}/login`);
  }
};
