import express from "express";
import Project from "../models/Project.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE PROJECT
router.post("/", authorize, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      members,
      createdBy: req.user._id // ✅ FIXED
    });

    await project.save();

    res.status(201).json(project);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating project" });
  }
});

// GET ALL PROJECTS
router.get("/", authorize, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name") // ✅ IMPORTANT
      .populate("createdBy", "name");

    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
});

// UPDATE PROJECT
router.put("/:id", authorize, async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, members },
      { new: true }
    ).populate("members", "name");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
});

// DELETE PROJECT
router.delete("/:id", authorize, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({ message: "Error deleting project" });
  }
});

export default router;