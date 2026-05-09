import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  jobTitle: user.jobTitle || "",
  department: user.department || "",
  bio: user.bio || "",
  createdAt: user.createdAt
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone = "", jobTitle = "", department = "", bio = "" } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    role,
    phone,
    jobTitle,
    department,
    bio
  });

  const token = signToken({ id: user._id, role: user.role });
  return res.status(201).json({ token, user: sanitizeUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({ id: user._id, role: user.role });
  return res.json({ token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
