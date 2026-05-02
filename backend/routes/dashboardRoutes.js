import express from "express";
const router = express.Router();

import Task from "../models/Task.js";
import { authorize } from "../middleware/authMiddleware.js";

router.get("/", authorize, async (req, res) => {
  try {
    let query = {};

    if (req.user.role !== "admin") {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const pending = tasks.filter(t => t.status === "pending").length;

    const overdue = tasks.filter(
      t => new Date(t.dueDate) < new Date() && t.status !== "completed"
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;