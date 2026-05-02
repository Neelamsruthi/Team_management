import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running successfully 🚀");
});
const PORT = process.env.PORT || 8000;
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Mongo db  connected successfully"))
.catch(err => {
  console.error("❌ MongoDB connection error:");
  console.error(err.message);
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);


app.use("/api/dashboard", dashboardRoutes);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
