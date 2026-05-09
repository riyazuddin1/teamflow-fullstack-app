import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const isOverdue = (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Completed";

const canMutateTask = (task, user) =>
  user.role === "admin" || String(task.assignedTo) === String(user._id) || String(task.createdBy) === String(user._id);

export const getTasks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    priority,
    project,
    assignedTo,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  const andFilters = [];

  if (search) {
    andFilters.push({
      $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    });
  }

  if (status) andFilters.push({ status });
  if (priority) andFilters.push({ priority });
  if (project) andFilters.push({ project });
  if (assignedTo) andFilters.push({ assignedTo });

  if (req.user.role !== "admin") {
    andFilters.push({ $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] });
  }

  const match = andFilters.length > 0 ? { $and: andFilters } : {};

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Task.find(match)
      .populate("project", "title status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit)),
    Task.countDocuments(match)
  ]);

  const normalized = items.map((task) => {
    const t = task.toObject();
    if (isOverdue(t)) t.status = "Overdue";
    return t;
  });

  res.json({ items: normalized, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

export const createTask = asyncHandler(async (req, res) => {
  const { project, assignedTo } = req.body;
  const foundProject = await Project.findById(project);
  if (!foundProject) return res.status(404).json({ message: "Project not found" });

  const task = await Task.create({
    ...req.body,
    project,
    assignedTo,
    createdBy: req.user._id
  });

  const hydrated = await Task.findById(task._id)
    .populate("project", "title")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.status(201).json(hydrated);
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!canMutateTask(task, req.user)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(task, req.body);
  await task.save();

  const hydrated = await Task.findById(task._id)
    .populate("project", "title")
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");

  res.json(hydrated);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!canMutateTask(task, req.user)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (!canMutateTask(task, req.user)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  task.status = status;
  task.completedAt = status === "Completed" ? new Date() : null;
  await task.save();

  res.json(task);
});

export const getTaskAnalytics = asyncHandler(async (req, res) => {
  const scope = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

  const [totals, statusBuckets, priorityBuckets, recent] = await Promise.all([
    Task.countDocuments(scope),
    Task.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Task.aggregate([{ $match: scope }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
    Task.find(scope).sort({ createdAt: -1 }).limit(8).populate("assignedTo", "name").populate("project", "title")
  ]);

  const completedTasks = await Task.countDocuments({ ...scope, status: "Completed" });
  const pendingTasks = await Task.countDocuments({ ...scope, status: { $ne: "Completed" } });

  const overdueTasks = await Task.countDocuments({
    ...scope,
    dueDate: { $lt: new Date() },
    status: { $ne: "Completed" }
  });

  res.json({
    totals,
    completedTasks,
    pendingTasks,
    overdueTasks,
    statusBuckets,
    priorityBuckets,
    recent
  });
});
