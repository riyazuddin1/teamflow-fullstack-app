import { Router } from "express";
import {
  deleteMyAccount,
  deleteUser,
  getUserById,
  getUsers,
  updateMyProfile,
  updateUser
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/", authorize("admin"), getUsers);
router.put("/me/update", updateMyProfile);
router.delete("/me/delete", deleteMyAccount);
router.get("/:id", getUserById);
router.put(
  "/:id",
  authorize("admin"),
  [body("role").optional().isIn(["admin", "member"]).withMessage("Role must be admin or member"), validate],
  updateUser
);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
