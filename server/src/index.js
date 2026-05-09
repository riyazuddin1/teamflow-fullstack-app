import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import { verifySmtpTransport } from "./utils/mailer.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    validateEnv();
    await connectDB();

    try {
      await verifySmtpTransport();
      console.log("SMTP transporter verified");
    } catch (smtpError) {
      console.error("SMTP verification failed:", smtpError.message);
      process.exit(1);
    }

    const { default: app } = await import("./app.js");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error.message);
    process.exit(1);
  }
};

start();
