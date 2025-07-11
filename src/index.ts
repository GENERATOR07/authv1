import express from "express";
import cors from "cors";
import { connectToMongo } from "./config/mongo";
import { env } from "./config/env";

import magicRoutes from "./routes/magic-route";
import path from "path";
import paymentRoutes from "./routes/payment-routes";
import { verifyAuth } from "./middleware/auth-middleware";
import { RequestHandler } from "express";
const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/auth", magicRoutes);
app.use("/payment", verifyAuth as unknown as RequestHandler, paymentRoutes);

(async () => {
  await connectToMongo();
  app.listen(env.PORT, () => {
    // console.log(`🚀 Server listening on port ${env.PORT}`);
  });
})();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});
