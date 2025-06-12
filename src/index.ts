import express from "express";
import { connectToMongo } from "./config/mongo";
import { env } from "./config/env";

import magicRoutes from "./routes/magic-route";
import path from "path";
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/auth", magicRoutes);

(async () => {
  await connectToMongo();
  app.listen(env.PORT, () => {
    console.log(`🚀 Server listening on port ${env.PORT}`);
  });
})();
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});
