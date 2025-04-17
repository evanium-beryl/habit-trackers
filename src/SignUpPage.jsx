import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State for the push notification
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

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    setShowAlert(true); // Show alert
    setTimeout(() => {
      setShowAlert(false); // Hide alert after 3 seconds
    }, 3000);
    navigate("/"); // Redirect to login after signup
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
          className="text-center text-lg italic mb-10"
          style={{ color: darkMode ? "#f9f9f9" : "#333" }}
        >
          Stay consistent, build better habits, and track your progress effortlessly with our habit tracker.{" "}
          <strong>Small steps, big results!</strong>
        </p>

        {/* Sign-up Form */}
        <form onSubmit={handleSignUp} className="w-full max-w-sm mx-auto">
  <div className="mb-4">
    <label htmlFor="username" className="block text-sm font-semibold">
      Username
    </label>
    <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full p-2 mt-2 border rounded"
      placeholder="Enter your username"
      required
      autocomplete="username"  // Added this line
      style={darkMode ? { color: "white" } : {}}
    />
  </div>

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
      autocomplete="email"  // Added this line
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
      autocomplete="new-password"  // Added this line
      style={darkMode ? { color: "white" } : {}}
    />
  </div>

  <div className="mb-4">
    <label htmlFor="confirmPassword" className="block text-sm font-semibold">
      Re-enter Password
    </label>
    <input
      id="confirmPassword"
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className="w-full p-2 mt-2 border rounded"
      placeholder="Re-enter your password"
      required
      autocomplete="new-password"  // Added this line
      style={darkMode ? { color: "white" } : {}}
    />
  </div>

  <div className="flex justify-center">
    <button
      type="submit"
      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
    >
      Sign Up
    </button>
  </div>
</form>

        {/* Redirect to Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
      {/* Push notification alert */}
      <div
        className={`push-alert ${showAlert ? "show" : "hide"}`}
      >
        Signup successful! You can now log in.
      </div>
    </div>
  );
}
