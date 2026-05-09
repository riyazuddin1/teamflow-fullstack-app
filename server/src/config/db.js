import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Mongo connection string missing. Set MONGO_URI (or MONGODB_URI) in server/.env with your MongoDB Atlas URI."
    );
  }

  await mongoose.connect(uri.trim(), {
    dbName: process.env.MONGO_DB_NAME || "teamflow"
  });
  console.log("MongoDB connected");
};
