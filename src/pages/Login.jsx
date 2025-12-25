import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(form.email, form.password);
      navigate("/"); // Redirect to home on success
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#eef1f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "#fff",
          padding: "30px 35px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#222",
            fontWeight: "600",
          }}
        >
          Login
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "22px",
            fontSize: "14px",
          }}
        >
          Enter your credentials to continue
        </p>

        {error && (
          <div style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontSize: "14px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submitForm}>
          {/* Email */}
          <div style={{ marginBottom: "18px", display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "6px", color: "#333", fontSize: "15px", fontWeight: "500" }}>
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={updateForm}
              required
              style={{
                padding: "11px 12px",
                fontSize: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "18px", display: "flex", flexDirection: "column" }}>
            <label style={{ marginBottom: "6px", color: "#333", fontSize: "15px", fontWeight: "500" }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={updateForm}
              required
              style={{
                padding: "11px 12px",
                fontSize: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#a0b4f0" : "#4e73df",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
              fontWeight: "600",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          Don't have an account? <Link to="/register" style={{ color: "#4e73df", textDecoration: "none", fontWeight: "600" }}>Register here</Link>
        </div>
      </div>
    </div>
  );
}
