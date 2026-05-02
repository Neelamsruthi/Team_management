import React, { useEffect, useState } from "react";
import api from "../../api/api";

function MemberDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/api/tasks");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/tasks/${id}`, { status });

      setTasks(prev =>
        prev.map(t =>
          t._id === id ? { ...t, status } : t
        )
      );
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const overdue = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed"
  ).length;

  return (
    <div style={{ padding: "25px", background: "#f4f6f8", minHeight: "100vh" }}>
      
      <h4 style={{ marginBottom: "20px", fontWeight: "600" }}>My Dashboard</h4>

      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginBottom: "25px"
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

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={th}>Title</th>
              <th style={th}>Status</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map(t => {
              const overdueTask =
                t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed";

              return (
                <tr key={t._id}>
                  <td style={td}>{t.title}</td>

                  <td style={{
                    ...td,
                    color: overdueTask ? "red" : "#333",
                    fontWeight: "500"
                  }}>
                    {overdueTask ? "Overdue" : t.status}
                  </td>

                  <td style={td}>
                    <select
                      value={t.status}
                      onChange={(e) => updateStatus(t._id, e.target.value)}
                      style={{
                        padding: "6px",
                        borderRadius: "5px",
                        border: "1px solid #ccc"
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

const th = {
  padding: "12px",
  textAlign: "left"
};

const td = {
  padding: "12px"
};

export default MemberDashboard;