import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";

const PORT = process.env.PORT || 5000;
let server;

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

const start = async () => {
  try {
    validateEnv();
    await connectDB();

    const { default: app } = await import("./app.js");

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    server.on("error", (error) => {
      console.error("HTTP server error:", error.message);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
  }
};

start();
