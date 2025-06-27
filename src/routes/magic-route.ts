import { Router, RequestHandler } from "express";
import {
  requestMagicLinkHandler,
  magicLoginHandler,
  logoutHandler,
  updateUserHandler,
  getProfileHandler,
} from "../controllers/magic-controller";
import { verifyAuth } from "../middleware/auth-middleware";
import { googleLoginHandler } from "../controllers/auth-controller";

const router = Router();

// Public routes
router.post(
  "/magic-link",
  requestMagicLinkHandler as unknown as RequestHandler
);
router.post("/magic-login", magicLoginHandler as unknown as RequestHandler);

router.post("/google-login", googleLoginHandler as unknown as RequestHandler);

// Protected routes
router.get(
  "/profile",
  verifyAuth as unknown as RequestHandler,
  getProfileHandler as unknown as RequestHandler
);
router.post(
  "/logout",
  verifyAuth as unknown as RequestHandler,
  logoutHandler as unknown as RequestHandler
);
router.patch(
  "/user",
  verifyAuth as unknown as RequestHandler,
  updateUserHandler as unknown as RequestHandler
);

export default router;
