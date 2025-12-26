// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaGamepad, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rememberMe, setRememberMe] = useState(true);

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(form.email, form.password);
      // Forced navigation to ensure it doesn't stay on login page
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-surface/50 backdrop-blur-md p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-accent rounded-full flex items-center justify-center text-primary text-3xl mb-4 shadow-lg shadow-accent/20">
            <FaGamepad />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your gaming top-ups
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={submitForm}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email_address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email_address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-white/10 placeholder-gray-500 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-colors"
                  placeholder="Email address"
                  onChange={updateForm}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-white/10 placeholder-gray-500 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent sm:text-sm transition-colors"
                  placeholder="Password"
                  onChange={updateForm}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-accent hover:text-accent-hover transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200 shadow-lg shadow-yellow-500/20 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-full flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signInWithGoogle()}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all duration-200"
            >
              <FaGoogle className="h-5 w-5 mr-3 text-red-500" />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent-hover transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
