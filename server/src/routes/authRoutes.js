import { Router } from "express";
import { body } from "express-validator";
import { login, me, resendOtp, signup, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").isIn(["admin", "member"]).withMessage("Role must be admin or member"),
    validate
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validate
  ],
  login
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("Valid 6-digit OTP is required"),
    validate
  ],
  verifyOtp
);

router.post(
  "/resend-otp",
  [body("email").isEmail().withMessage("Valid email is required"), validate],
  resendOtp
);

router.get("/me", protect, me);

export default router;
