import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("name email role phone jobTitle department bio createdAt")
    .sort({ createdAt: -1 });
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const isSelf = String(req.user._id) === String(req.params.id);
  if (req.user.role !== "admin" && !isSelf) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const user = await User.findById(req.params.id).select("name email role phone jobTitle department bio createdAt");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, role, phone, jobTitle, department, bio } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name ?? user.name;
  user.role = role ?? user.role;
  user.phone = phone ?? user.phone;
  user.jobTitle = jobTitle ?? user.jobTitle;
  user.department = department ?? user.department;
  user.bio = bio ?? user.bio;

  await user.save();

  res.json({
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
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, phone, jobTitle, department, bio } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  user.jobTitle = jobTitle ?? user.jobTitle;
  user.department = department ?? user.department;
  user.bio = bio ?? user.bio;

  await user.save();

  res.json({
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
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === String(req.params.id)) {
    return res.status(400).json({ message: "Use self-delete endpoint for your own account" });
  }

  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });

  await Task.deleteMany({ assignedTo: target._id });
  await Task.deleteMany({ createdBy: target._id });
  await Project.updateMany({}, { $pull: { members: target._id } });
  await Project.deleteMany({ createdBy: target._id });
  await User.findByIdAndDelete(target._id);

  res.json({ message: "User deleted" });
});

export const deleteMyAccount = asyncHandler(async (req, res) => {
  const myId = req.user._id;

  await Task.deleteMany({ assignedTo: myId });
  await Task.deleteMany({ createdBy: myId });
  await Project.updateMany({}, { $pull: { members: myId } });
  await Project.deleteMany({ createdBy: myId });
  await User.findByIdAndDelete(myId);

  res.json({ message: "Your account has been deleted" });
});
