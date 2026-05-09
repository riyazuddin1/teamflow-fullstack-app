import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { generateOtp } from "../utils/otp.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_GAP_MS = 30 * 1000;

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
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

const setOtpOnUser = async (user) => {
  const otpCode = generateOtp();
  user.otpCode = otpCode;
  user.otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);
  await user.save();

  let sent = true;
  let warning = "";
  try {
    await sendVerificationEmail({ to: user.email, otpCode });
  } catch (error) {
    sent = false;
    warning = "OTP email service temporarily unavailable.";
    console.error("OTP delivery failed:", error.message);
  }
  return { sent, warning };
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone = "", jobTitle = "", department = "", bio = "" } = req.body;
  const normalizedEmail = normalizeEmail(email);

  let user = await User.findOne({ email: normalizedEmail }).select("+otpCode +otpExpiresAt +password");

  if (user && user.isVerified) {
    return res.status(409).json({ message: "Email already in use" });
  }

  if (!user) {
    user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role,
      phone,
      jobTitle,
      department,
      bio,
      isVerified: false
    });
  } else {
    user.name = name;
    user.password = password;
    user.role = role;
    user.phone = phone;
    user.jobTitle = jobTitle;
    user.department = department;
    user.bio = bio;
    user.isVerified = false;
    await user.save();
  }

  const delivery = await setOtpOnUser(user);

  return res.status(201).json({
    message: delivery.sent
      ? "Account created. Verify OTP sent to your email."
      : "Account created. OTP email service temporarily unavailable.",
    requiresVerification: true,
    email: user.email,
    ...(delivery.warning && { warning: delivery.warning })
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select("+otpCode +otpExpiresAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.isVerified) {
    const token = signToken({ id: user._id, role: user.role });
    return res.json({ token, user: sanitizeUser(user) });
  }

  if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired. Please resend OTP." });
  }

  if (user.otpCode !== String(otp).trim()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otpCode = null;
  user.otpExpiresAt = null;
  await user.save();

  const token = signToken({ id: user._id, role: user.role });
  return res.json({ token, user: sanitizeUser(user) });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select("+otpCode +otpExpiresAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified) return res.status(400).json({ message: "Account already verified" });

  const now = Date.now();
  const remaining = user.otpExpiresAt ? user.otpExpiresAt.getTime() - now : 0;
  if (remaining > OTP_TTL_MS - RESEND_GAP_MS) {
    return res.status(429).json({ message: "Please wait a few seconds before requesting another OTP" });
  }

  const delivery = await setOtpOnUser(user);
  if (!delivery.sent) {
    return res.status(503).json({ message: "OTP email service temporarily unavailable." });
  }
  return res.json({ message: "A new OTP has been sent to your email" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  const user = await User.findOne({ email: normalizedEmail }).select("+password +otpCode +otpExpiresAt");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    let warning = "";
    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      const delivery = await setOtpOnUser(user);
      warning = delivery.warning || "";
    }

    return res.status(403).json({
      message: warning || "Account not verified. Please verify OTP.",
      requiresVerification: true,
      email: user.email,
      ...(warning && { warning })
    });
  }

  const token = signToken({ id: user._id, role: user.role });
  return res.json({ token, user: sanitizeUser(user) });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
