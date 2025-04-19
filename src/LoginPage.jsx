import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showAlert, setShowAlert] = useState(false); // State for the push notification
  const [showErrorAlert, setShowErrorAlert] = useState(false); // State for error notification
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

  // Handle login function
const handleLogin = (e) => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users")) || []; // Retrieve all users

  // Check if there is a user with the matching email and password
  const storedUser = users.find(user => user.email === email && user.password === password);

  if (!storedUser) {
    setShowErrorAlert(true); // Show error alert if no user matches
    setTimeout(() => {
      setShowErrorAlert(false); // Hide alert after 2 seconds
    }, 2000);
    return;
  }

  localStorage.setItem("isAuthenticated", "true"); // Store login state
  setShowAlert(true); // Show success alert
  setEmail(""); // Clear email field
  setPassword(""); // Clear password field

  navigate("/habit-tracker"); // Redirect immediately

  setTimeout(() => {
    setShowAlert(false); // Hide alert after 2 seconds
  }, 2000);
};

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Inline styles for the push notification
  const notificationStyle = {
    position: "fixed",
    top: "20px",
    right: showAlert ? "20px" : "-300px",
    backgroundColor: "#4caf50",
    color: "white",
    padding: "15px",
    borderRadius: "5px",
    transition: "right 0.5s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  };

  const errorNotificationStyle = {
    position: "fixed",
    top: "20px",
    right: showErrorAlert ? "20px" : "-300px",
    backgroundColor: "#f44336",
    color: "white",
    padding: "15px",
    borderRadius: "5px",
    transition: "right 0.5s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
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
            <label htmlFor="email-field" className="block text-sm font-semibold">
              Email
            </label>
            <input
              id="email-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 mt-2 border rounded ${
                darkMode
                  ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                  : "placeholder-gray-500"
              }`}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-4 relative">
  <label htmlFor="password-field" className="block text-sm font-semibold">
    Password
  </label>
  <div className="relative">
    <input
      id="password-field"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className={`w-full p-2 mt-2 border rounded pr-10 ${
        darkMode
          ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
          : "placeholder-gray-500"
      }`}
      placeholder="Enter your password"
      required
      autoComplete="current-password"
    />
    <div
      className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? (
        <EyeSlashIcon className="h-5 w-5" />
      ) : (
        <EyeIcon className="h-5 w-5" />
      )}
    </div>
  </div>
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
      {/* Push Notification */}
      <div style={notificationStyle}>Login successful! Welcome back.</div>
      <div style={errorNotificationStyle}>Invalid credentials. Please try again.</div>
    </div>
  );
}
