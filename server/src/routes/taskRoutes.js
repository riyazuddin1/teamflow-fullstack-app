import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  getTaskAnalytics,
  getTasks,
  updateTask,
  updateTaskStatus
} from "../controllers/taskController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/", getTasks);
router.get("/analytics/summary", authorize("admin"), getTaskAnalytics);
router.post(
  "/",
  authorize("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("project").notEmpty().withMessage("Project is required"),
    body("assignedTo").notEmpty().withMessage("Assignee is required"),
    validate
  ],
  createTask
);
router.put("/:id", authorize("admin"), updateTask);
router.delete("/:id", authorize("admin"), deleteTask);
router.patch(
  "/:id/status",
  [body("status").isIn(["Todo", "In Progress", "Review", "Completed", "Overdue"]), validate],
  updateTaskStatus
);

export default router;
