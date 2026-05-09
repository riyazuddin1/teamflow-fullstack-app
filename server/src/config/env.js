const requiredVars = ["MONGO_URI", "JWT_SECRET"];

export const validateEnv = () => {
  const missing = requiredVars.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }
};
