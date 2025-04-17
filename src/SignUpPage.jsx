import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [showAlert, setShowAlert] = useState(false); // State for the push notification
  const navigate = useNavigate();

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("A valid email is required.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Check for existing user
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.email === email) {
      setErrorMessage("An account with this email already exists.");
      return;
    }

    // Clear error message
    setErrorMessage("");

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      navigate("/");
    }, 2500);
  };

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

  return (
    <div
      className={`min-h-screen p-5 flex flex-col items-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
      }`}
    >
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center">Habit Tracker</h1>
          <button
            onClick={handleDarkModeToggle}
            className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105"
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <p
          className="text-center text-lg italic mb-10"
          style={{ color: darkMode ? "#f9f9f9" : "#333" }}
        >
          Stay consistent, build better habits, and track your progress effortlessly with our habit tracker. {" "}
          <strong>Small steps, big results!</strong>
        </p>

        <form onSubmit={handleSignUp} className="w-full max-w-sm mx-auto">
          <div className="mb-4">
            <label htmlFor="username-field" className="block text-sm font-semibold">
              Username
            </label>
            <input
              id="username-field"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              placeholder="Enter your username"
              required
              autoComplete="username"
              style={darkMode ? { color: "white" } : {}}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email-field" className="block text-sm font-semibold">
              Email
            </label>
            <input
              id="email-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              placeholder="Enter your email"
              required
              autoComplete="email"
              style={darkMode ? { color: "white" } : {}}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password-field" className="block text-sm font-semibold">
              Password
            </label>
            <input
              id="password-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              placeholder="Enter your password"
              required
              autoComplete="new-password"
              style={darkMode ? { color: "white" } : {}}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirm-password-field" className="block text-sm font-semibold">
              Re-enter Password
            </label>
            <input
              id="confirm-password-field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              style={darkMode ? { color: "white" } : {}}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account? {" "}
            <Link
              to="/"
              className="text-teal-500 hover:text-teal-600 font-semibold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div style={notificationStyle}>Signup successful! You can now log in.</div>
    </div>
  );
}
