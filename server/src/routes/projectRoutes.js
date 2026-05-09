import { Router } from "express";
import { body } from "express-validator";
import {
  createProject,
  deleteProject,
  getProjectAnalytics,
  getProjectById,
  getProjects,
  updateProject
} from "../controllers/projectController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/", getProjects);
router.get("/analytics/summary", authorize("admin"), getProjectAnalytics);
router.get("/:id", getProjectById);
router.post(
  "/",
  authorize("admin"),
  [body("title").notEmpty().withMessage("Title is required"), validate],
  createProject
);
router.put("/:id", authorize("admin"), updateProject);
router.delete("/:id", authorize("admin"), deleteProject);

export default router;
