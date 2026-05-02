import React, { useEffect, useState } from "react";
import api from "../../api/api";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/api/tasks")
      .then(res => setTasks(res.data.tasks || []))
      .catch(err => console.log(err));
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const overdue = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  return (
    <div style={{ padding: "25px", background: "#f4f6f8", minHeight: "100vh" }}>
      
      <h4 style={{ marginBottom: "20px", fontWeight: "600" }}>
        Admin Dashboard
      </h4>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}>
        
        <div style={box}>
          <h5>Total</h5>
          <p>{total}</p>
        </div>

        <div style={{ ...box, background: "#e6ffe6" }}>
          <h5>Completed</h5>
          <p>{completed}</p>
        </div>

        <div style={{ ...box, background: "#fff5cc" }}>
          <h5>Pending</h5>
          <p>{pending}</p>
        </div>

        <div style={{ ...box, background: "#ffe6e6", color: "red" }}>
          <h5>Overdue</h5>
          <p>{overdue}</p>
        </div>

      </div>

    </div>
  );
}

const box = {
  padding: "20px",
  background: "#fff",
  borderRadius: "10px",
  minWidth: "140px",
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default AdminDashboard;