import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "10px 20px",
        background: "#333",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h4 style={{ margin: 0 }}>Task Ethara</h4>

      <div>
        {!user ? (
          <>
            <Link to="/login" style={{ color: "#fff", marginRight: "10px" }}>
              Login
            </Link>
            <Link to="/register" style={{ color: "#fff" }}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/" style={{ color: "#fff", marginRight: "10px" }}>
              Home
            </Link>

            <Link to="/dashboard" style={{ color: "#fff", marginRight: "10px" }}>
              Dashboard
            </Link>

            {user.role === "admin" && (
              <>
                <Link
                  to="/create-project"
                  style={{ color: "#fff", marginRight: "10px" }}
                >
                  Create Project
                </Link>

                <Link
                  to="/create-task"
                  style={{ color: "#fff", marginRight: "10px" }}
                >
                  Create Task
                </Link>
              </>
            )}

            <span style={{ marginRight: "10px" }}>{user.name}</span>

            <button
              onClick={logout}
              style={{
                padding: "5px 10px",
                border: "none",
                background: "red",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;