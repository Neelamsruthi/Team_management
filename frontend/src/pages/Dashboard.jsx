import React from "react";
import AdminDashboard from "./AdminDashboard"
import MemberDashboard from "./MemberDashboard";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{
      padding: "30px",
      fontFamily: "Arial",
      background: "#f9f9f9",
      minHeight: "100vh"
    }}>
      
      {/* Header */}
      <div style={{
        background: "#fff",
        padding: "15px 20px",
        borderRadius: "8px",
        marginBottom: "20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ margin: 0 }}>Welcome, {user.name}</h3>
        <p style={{ margin: "5px 0 0", color: "#666" }}>
          Role: <b>{user.role}</b>
        </p>
      </div>

      {/* Dashboard Content */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        {user.role === "admin" ? <AdminDashboard /> : <MemberDashboard />}
      </div>

    </div>
  );
}

export default Dashboard;