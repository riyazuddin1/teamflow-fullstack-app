import mongoose from "mongoose";
import { TASK_PRIORITY, TASK_STATUS } from "../utils/constants.js";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    priority: { type: String, enum: TASK_PRIORITY, default: "Medium" },
    status: { type: String, enum: TASK_STATUS, default: "Todo" },
    dueDate: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

taskSchema.pre("save", function (next) {
  if (this.status === "Completed" && !this.completedAt) {
    this.completedAt = new Date();
  }
  if (this.status !== "Completed") {
    this.completedAt = null;
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
