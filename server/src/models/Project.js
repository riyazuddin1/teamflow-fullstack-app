import mongoose from "mongoose";
import { PROJECT_STATUS } from "../utils/constants.js";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: PROJECT_STATUS, default: "Planning" },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
