import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
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

  const validateForm = () => {
    if (!username.trim()) {
      setErrorMessage("Username is required.");
      document.getElementById("username-field").focus();
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("A valid email is required.");
      document.getElementById("email-field").focus();
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      document.getElementById("confirm-password-field").focus();
      return false;
    }
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.email === email) {
      setErrorMessage("An account with this email already exists.");
      document.getElementById("email-field").focus();
      return false;
    }
    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrorMessage("");
    localStorage.setItem("user", JSON.stringify({ username, email, password }));
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      navigate("/");
    }, 2500);
  };

  const notificationStyle = {
    position: "fixed",
    top: showAlert ? "20px" : "-100px",
    right: "20px",
    backgroundColor: "#4caf50",
    color: "white",
    padding: "15px",
    borderRadius: "5px",
    transition: "top 0.5s ease-in-out, opacity 0.5s ease-in-out",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    opacity: showAlert ? 1 : 0,
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
      }`}
    >
      {/* Navbar */}
      <div
        className={`w-full py-4 px-6 shadow-lg ${
          darkMode
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black border-b border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Habit Tracker
          </h1>
          <button
            onClick={handleDarkModeToggle}
            className={`px-3 py-2 rounded-md transition-transform transform hover:scale-105 text-sm sm:text-base ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gradient-to-r from-blue-100 via-yellow-200 to-white text-black hover:from-blue-200 hover:via-yellow-300"
            }`}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      <div className="px-4 mt-10">
        <p className="text-center text-sm sm:text-base md:text-lg italic mb-10">
          Stay consistent, build better habits, and track your progress
          effortlessly. <strong>Small steps, big results!</strong>
        </p>

        <div
  className={`p-6 rounded-lg shadow-md max-w-md mx-auto ${
    darkMode
      ? "bg-gray-900 border border-gray-700"
      : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white border border-gray-300"
  }`}
>
          <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="username-field"
                className="block text-sm sm:text-base font-semibold"
              >
                Username
              </label>
              <input
                id="username-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border rounded-md text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                    : "placeholder-gray-500"
                }`}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="email-field"
                className="block text-sm sm:text-base font-semibold"
              >
                Email
              </label>
              <input
                id="email-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border rounded-md text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                    : "placeholder-gray-500"
                }`}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password-field"
                className="block text-sm sm:text-base font-semibold"
              >
                Password
              </label>
              <input
                id="password-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-md text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                    : "placeholder-gray-500"
                }`}
                placeholder="Enter your password"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password-field"
                className="block text-sm sm:text-base font-semibold"
              >
                Re-enter Password
              </label>
              <input
                id="confirm-password-field"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded-md text-sm sm:text-base ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
                    : "placeholder-gray-500"
                }`}
                placeholder="Re-enter your password"
                required
                autoComplete="new-password"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm sm:text-base">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white text-sm sm:text-base rounded-md shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Sign Up
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm sm:text-base">
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

      <div style={notificationStyle} role="alert" aria-live="assertive">
        Signup successful! You can now log in.
      </div>
    </div>
  );
}
