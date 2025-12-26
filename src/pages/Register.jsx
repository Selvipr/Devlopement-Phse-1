// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaCalendar, FaPhone, FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";

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
    <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10 bg-surface/50 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-accent rounded-full flex items-center justify-center text-primary text-3xl mb-4 shadow-lg shadow-accent/20">
            <FaUserPlus />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Join thousands of gamers in the Digital Market community
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={submitForm}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Full Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="John Doe"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* Email */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="john@example.com"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="••••••••"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="••••••••"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-500" />
                </div>
                <input
                  name="mobile"
                  type="number"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="+1 234 567 890"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendar className="text-gray-500" />
                </div>
                <input
                  name="dob"
                  type="date"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  onChange={updateForm}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="text-gray-500" />
                </div>
                <select
                  name="gender"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors appearance-none"
                  onChange={updateForm}
                >
                  <option value="" className="text-gray-800">Select Gender</option>
                  <option value="male" className="text-gray-800">Male</option>
                  <option value="female" className="text-gray-800">Female</option>
                  <option value="other" className="text-gray-800">Other</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-500" />
                </div>
                <textarea
                  name="address"
                  rows="2"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                  placeholder="Enter your full address"
                  onChange={updateForm}
                ></textarea>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl shadow-lg shadow-accent/20 transition-all transform hover:-translate-y-1 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
