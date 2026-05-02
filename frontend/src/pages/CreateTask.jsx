import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function CreateTask() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    dueDate: ""
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const p = await api.get("/api/projects");
    const t = await api.get("/api/tasks");
    setProjects(p.data.projects);
    setTasks(t.data.tasks);
  };

  const handleProjectChange = (projectId) => {
    setForm({ ...form, projectId });

    const project = projects.find(p => p._id === projectId);
    if (project) setSelectedMembers(project.members);
  };

  const handleCreateOrUpdate = async () => {
    if (!form.title || !form.projectId || !form.assignedTo || !form.dueDate) return;

    if (editId) {
      await api.put(`/api/tasks/${editId}`, form);
    } else {
      await api.post("/api/tasks", form);
    }

    setForm({
      title: "",
      description: "",
      projectId: "",
      assignedTo: "",
      dueDate: ""
    });

    setEditId(null);
    fetchAll();
    navigate("/dashboard");
  };

  const handleEdit = (t) => {
    setForm({
      title: t.title,
      description: t.description,
      projectId: t.projectId?._id,
      assignedTo: t.assignedTo?._id,
      dueDate: t.dueDate?.slice(0, 10)
    });

    const project = projects.find(p => p._id === t.projectId?._id);
    if (project) setSelectedMembers(project.members);

    setEditId(t._id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    fetchAll();
  };

  return (
    <div style={{ padding: "25px", maxWidth: "700px", margin: "auto" }}>
      
      <h3 style={{ marginBottom: "15px" }}>
        {editId ? "Edit Task" : "Create Task"}
      </h3>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        style={input}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        style={input}
      />

      <select
        value={form.projectId}
        onChange={(e) => handleProjectChange(e.target.value)}
        style={input}
      >
        <option value="">Select Project</option>
        {projects.map(p => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        value={form.assignedTo}
        onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        style={input}
      >
        <option value="">Select Member</option>
        {selectedMembers.map(m => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        style={input}
      />

      <button onClick={handleCreateOrUpdate} style={button}>
        {editId ? "Update Task" : "Create Task"}
      </button>

      <h4 style={{ marginTop: "30px" }}>Tasks</h4>

      <div style={{ marginTop: "10px" }}>
        {tasks.map(t => (
          <div key={t._id} style={card}>
            
            <div>
              <b>{t.title}</b>
              <p style={{ fontSize: "13px", color: "#555" }}>
                {t.projectId?.name} | {t.assignedTo?.name}
              </p>
              <span style={{ fontSize: "12px" }}>{t.status}</span>
            </div>

            <div>
              <button onClick={() => handleEdit(t)} style={editBtn}>
                Edit
              </button>
              <button onClick={() => handleDelete(t._id)} style={deleteBtn}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px"
};

const button = {
  padding: "10px 15px",
  background: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const card = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  marginBottom: "10px"
};

const editBtn = {
  marginRight: "8px",
  padding: "5px 10px"
};

const deleteBtn = {
  padding: "5px 10px",
  background: "red",
  color: "#fff",
  border: "none"
};

export default CreateTask;