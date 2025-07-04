import { RequestHandler, Router } from "express";
import {
  createOrder,
  verifyPayment,
  getMembershipStatus,
} from "../controllers/payment-controller";

const router = Router();

router.post("/create-order", createOrder as unknown as RequestHandler);
router.post("/verify", verifyPayment as unknown as RequestHandler);
router.get(
  "/membership-status",
  getMembershipStatus as unknown as RequestHandler
);

export default router;
