import { Router, RequestHandler } from "express";
import {
  requestMagicLinkHandler,
  magicLoginHandler,
} from "../controllers/magic-controller";

const router = Router();

router.post(
  "/magic-link",
  requestMagicLinkHandler as unknown as RequestHandler
);
router.get("/magic-login", magicLoginHandler as unknown as RequestHandler);

export default router;
