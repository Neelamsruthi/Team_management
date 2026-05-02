import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "8px",
          width: "300px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <h3 style={{ marginBottom: "15px", textAlign: "center" }}>Login</h3>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          style={inputStyle}
        />

        <button style={buttonStyle}>Login</button>
      </form>
    </div>
  );
}


const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#1b1e20",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default Login;