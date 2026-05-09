import mongoose from "mongoose";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const projectAccessQuery = (user) =>
  user.role === "admin" ? {} : { $or: [{ createdBy: user._id }, { members: user._id }] };

export const getProjects = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    status
  } = req.query;

  const query = {
    ...projectAccessQuery(req.user),
    ...(search ? { title: { $regex: search, $options: "i" } } : {}),
    ...(status ? { status } : {})
  };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Project.find(query)
      .populate("createdBy", "name email")
      .populate("members", "name email role")
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit)),
    Project.countDocuments(query)
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, members = [], status, dueDate } = req.body;

  const uniqueMembers = [...new Set(members)].filter((m) => mongoose.Types.ObjectId.isValid(m));
  const project = await Project.create({
    title,
    description,
    members: uniqueMembers,
    status,
    dueDate,
    createdBy: req.user._id
  });

  const hydrated = await Project.findById(project._id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  res.status(201).json(hydrated);
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  if (!project) return res.status(404).json({ message: "Project not found" });

  if (
    req.user.role !== "admin" &&
    !project.members.some((m) => String(m._id) === String(req.user._id)) &&
    String(project.createdBy._id) !== String(req.user._id)
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const updates = { ...req.body };
  if (Array.isArray(updates.members)) {
    updates.members = [...new Set(updates.members)].filter((m) => mongoose.Types.ObjectId.isValid(m));
  }

  Object.assign(project, updates);
  await project.save();

  const hydrated = await Project.findById(project._id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  res.json(hydrated);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const deleted = await Project.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
});

export const getProjectAnalytics = asyncHandler(async (req, res) => {
  const scope = projectAccessQuery(req.user);

  const [totalProjects, statusBuckets, dueSoonProjects] = await Promise.all([
    Project.countDocuments(scope),
    Project.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Project.find({
      ...scope,
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    })
      .sort({ dueDate: 1 })
      .limit(5)
  ]);

  res.json({ totalProjects, statusBuckets, dueSoonProjects });
});
