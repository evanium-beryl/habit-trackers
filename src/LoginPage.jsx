import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Read dark mode preference from localStorage on initial load
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode)); // Initialize darkMode based on saved preference
    }
  }, []);

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode)); // Save the new dark mode setting
      return newMode;
    });
  };

  // Place this handleLogin function in your LoginPage.js
const handleLogin = (e) => {
  e.preventDefault();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
    alert("Invalid credentials. Please try again.");
    return;
  }

  localStorage.setItem("isAuthenticated", "true"); // Store login state
  setEmail("");
  setPassword("");
  navigate("/habit-tracker"); // Redirect to Habit Tracker
};

  return (
    <div
      className={`min-h-screen p-5 flex flex-col items-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
      }`}
    >
      <div className="w-full max-w-6xl">
        {/* Header & Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Habit Tracker</h1>
          <button
            onClick={handleDarkModeToggle}
            className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Write-up Below Dark Mode Toggle */}
        <p
          className="text-center text-lg italic mb-20"
          style={{ color: darkMode ? "#f9f9f9" : "#333" }}
        >
          Stay consistent, build better habits, and track your progress effortlessly with our habit tracker.{" "}
          <strong>Small steps, big results!</strong>
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto">
  <div className="mb-4">
    <label htmlFor="email" className="block text-sm font-semibold">
      Email
    </label>
    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-2 mt-2 border rounded"
      placeholder="Enter your email"
      required
      autocomplete="email"  // Added autocomplete for email
      style={darkMode ? { color: "white" } : {}}
    />
  </div>

  <div className="mb-4">
    <label htmlFor="password" className="block text-sm font-semibold">
      Password
    </label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-2 mt-2 border rounded"
      placeholder="Enter your password"
      required
      autocomplete="current-password"  // Added autocomplete for password
      style={darkMode ? { color: "white" } : {}}
    />
  </div>

  <div className="flex justify-center">
    <button
      type="submit"
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
    >
      Login
    </button>
  </div>
</form>

        {/* Redirect to Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
