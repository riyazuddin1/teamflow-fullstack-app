const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLIENT_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM"
];

export const validateEnv = () => {
  const missing = requiredVars.filter((key) => !String(process.env[key] || "").trim());
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
};
