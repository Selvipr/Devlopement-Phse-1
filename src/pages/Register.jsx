import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    mobile: "",
    address: "",
  });

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      // Sign up with Supabase
      // We pass extra metadata that Supabase can store in auth.users or we can handle profile creation via triggers
      // For this implementation, we'll rely on the metadata or a separate profile insert if needed.
      // The AuthContext signUp function handles the basic auth.

      const { user } = await signUp(form.email, form.password, {
        full_name: form.name,
        phone: form.mobile,
        address: form.address,
        gender: form.gender,
        dob: form.dob
      });

      if (user) {
        alert("Registration successful! Please check your email for verification.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-container">
      <div className="reg-card">
        <h2>Create Your Account</h2>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={submitForm}>

          {/* Name */}
          <div className="input-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              onChange={updateForm}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={updateForm}
              required
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              onChange={updateForm}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              onChange={updateForm}
              required
            />
          </div>

          {/* DOB */}
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              onChange={updateForm}
              required
            />
          </div>

          {/* Gender */}
          <div className="input-group">
            <label>Gender</label>
            <select name="gender" onChange={updateForm} required>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Mobile */}
          <div className="input-group">
            <label>Mobile Number</label>
            <input
              name="mobile"
              type="number"
              placeholder="Enter your mobile number"
              onChange={updateForm}
              required
            />
          </div>

          {/* Address */}
          <div className="input-group">
            <label>Address</label>
            <textarea
              name="address"
              placeholder="Enter your address"
              rows="3"
              onChange={updateForm}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <button className="reg-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>
      </div>
    </div>
  );
}
