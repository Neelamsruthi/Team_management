import React, { useEffect, useState } from "react";
import api from "../../api/api";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/auth");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!name) return alert("Enter project name");
    if (members.length === 0) return alert("Select member");

    const payload = { name, description, members };

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/api/projects/${editId}`, payload);
      } else {
        await api.post("/api/projects", payload);
      }

      setName("");
      setDescription("");
      setMembers([]);
      setEditId(null);

      fetchProjects();
    } catch (err) {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setName(p.name);
    setDescription(p.description || "");
    setMembers(p.members.map(m => m._id));
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete project?")) return;
    await api.delete(`/api/projects/${id}`);
    fetchProjects();
  };

  return (
    <div style={{ padding: "25px", maxWidth: "700px", margin: "auto" }}>
      
      <h3 style={{ marginBottom: "15px" }}>
        {editId ? "Edit Project" : "Create Project"}
      </h3>

      <input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={input}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={input}
      />

      <select
        value={members[0] || ""}
        onChange={(e) => setMembers([e.target.value])}
        style={input}
      >
        <option value="">Select Member</option>
        {users.map(u => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      <button onClick={handleCreateOrUpdate} style={button}>
        {loading ? "Please wait..." : editId ? "Update" : "Create"}
      </button>

      <h4 style={{ marginTop: "30px" }}>Projects</h4>

      <div style={{ marginTop: "10px" }}>
        {projects.map(p => (
          <div key={p._id} style={card}>
            <div>
              <b>{p.name}</b>
              <p style={{ fontSize: "13px", color: "#555" }}>
                {p.members.map(m => m.name).join(", ")}
              </p>
            </div>

            <div>
              <button onClick={() => handleEdit(p)} style={editBtn}>
                Edit
              </button>
              <button onClick={() => handleDelete(p._id)} style={deleteBtn}>
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

export default CreateProject;