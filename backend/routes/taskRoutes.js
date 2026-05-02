import express from "express";
const router = express.Router();

import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { authorize } from "../middleware/authMiddleware.js";

router.post("/", authorize, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create tasks" });
    }

    if (!title || !description || !assignedTo || !projectId || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.members.map(m => m.toString()).includes(assignedTo)) {
      return res.status(400).json({ message: "User not in project" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      dueDate
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", authorize, async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks
    });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", authorize, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", authorize, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.assignedTo.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Task updated successfully",
      updatedTask
    });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully"
    });

  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;