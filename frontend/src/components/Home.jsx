import React from "react";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{
      width: "100%",
      minHeight: "calc(100vh - 50px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f4f4f4"
    }}>
      
      <div style={{
        textAlign: "center",
        background: "#fff",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        maxWidth: "600px"
      }}>
        
        <h2 style={{ marginBottom: "10px" }}>
          Team Task Manager
        </h2>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          A simple application to manage projects, assign tasks, and track progress.
        </p>

        <hr />

        <div style={{ marginTop: "20px" }}>
          <p> Create and manage projects</p>
          <p>Assign tasks to team members</p>
          <p>Track status and deadlines</p>
        </div>

        <hr />

        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          {user ? `Welcome back, ${user.name}` : "Please login to continue"}
        </p>

      </div>
    </div>
  );
}

export default Home;