import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.MEMBER },
    phone: { type: String, default: "" },
    jobTitle: { type: String, default: "" },
    department: { type: String, default: "" },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otpCode: { type: String, default: null, select: false },
    otpExpiresAt: { type: Date, default: null, select: false }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
