import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Refs for focus management
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

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
    e.preventDefault(); // Prevent default form submission

    // Validate form before submitting
    if (!validateForm()) return;

    setIsSubmitting(true); // Start loading
    setErrorMessage(""); // Clear previous errors

    // Save user data
    localStorage.setItem("user", JSON.stringify({ username, email, password }));

    // Show success alert
    setShowAlert(true);

    // Redirect after a short delay
    setTimeout(() => {
      setShowAlert(false);
      setIsSubmitting(false);
      navigate("/"); // Redirect to the login page
    }, 2500); // Delay for the success alert
};

const validateForm = () => {
    // Reset all error messages and highlight for revalidation
    setErrorMessage(""); 

    // Validate username
    if (!username.trim()) {
        setErrorMessage("Username is required.");
        usernameRef.current.focus();
        return false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage("Email is required.");
      emailRef.current.focus();
      return false;
    } else if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      emailRef.current.focus();
      return false;
    }

    // Validate password
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    if (!password) {
      setErrorMessage("Password is required.");
      passwordRef.current.focus();
      return false;
    } else if (!passwordPattern.test(password)) {
      setErrorMessage("Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.");
      passwordRef.current.focus();
      return false;
    }

    // Validate confirm password
    if (!confirmPassword) {
        setErrorMessage("Please confirm your password.");
        confirmPasswordRef.current.focus();
        return false;
    } else if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        confirmPasswordRef.current.focus();
        return false;
    }

    // Check if user already exists
    const existingUser = JSON.parse(localStorage.getItem("user"));
    if (existingUser && existingUser.email === email) {
        setErrorMessage("An account with this email already exists.");
        emailRef.current.focus();
        return false;
    }

    return true;
};

const handleInputChange = (e, field) => {
  const value = e.target.value;
  if (field === "username" && errorMessage.includes("Username")) {
    setErrorMessage("");
  } else if (field === "email" && errorMessage.includes("Email")) {
    setErrorMessage("");
  } else if (field === "password" && errorMessage.includes("Password")) {
    setErrorMessage("");
  } else if (field === "confirmPassword" && errorMessage.includes("Passwords")) {
    setErrorMessage("");
  }
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

  const passwordMatchStyle = password === confirmPassword ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">Habit Tracker</h1>
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
          Stay consistent, build better habits, and track your progress effortlessly.{" "}
          <strong>Small steps, big results!</strong>
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
  <label htmlFor="username-field" className="block text-sm sm:text-base font-semibold">
    Username
  </label>
  <input
    id="username-field"
    ref={usernameRef}
    type="text"
    value={username}
    onChange={(e) => {
      setUsername(e.target.value);
      handleInputChange(e, "username");
    }}
    className={`w-full p-3 border rounded-md text-sm sm:text-base ${
      darkMode
        ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
        : "placeholder-gray-500"
    } ${errorMessage.includes("Username") ? "border-red-500" : ""}`}
    placeholder="Enter your username"
    required
    autoComplete="username"
  />
  {errorMessage.includes("Username") && (
    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
  )}
</div>

<div>
  <label htmlFor="email-field" className="block text-sm sm:text-base font-semibold">
    Email
  </label>
  <input
    id="email-field"
    ref={emailRef}
    type="email"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value);
      handleInputChange(e, "email");
    }}
    className={`w-full p-3 border rounded-md text-sm sm:text-base ${
      darkMode
        ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
        : "placeholder-gray-500"
    } ${errorMessage.includes("Email") ? "border-red-500" : ""}`}
    placeholder="Enter your email"
    required
    autoComplete="email"
  />
  {errorMessage.includes("Email") && (
    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
  )}
</div>

<div>
  <label htmlFor="password-field" className="block text-sm sm:text-base font-semibold">
    Password
  </label>
  <input
    id="password-field"
    ref={passwordRef}
    type="password"
    value={password}
    onChange={(e) => {
      setPassword(e.target.value);
      handleInputChange(e, "password");
    }}
    className={`w-full p-3 border rounded-md text-sm sm:text-base ${
      darkMode
        ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
        : "placeholder-gray-500"
    } ${errorMessage.includes("Password") ? "border-red-500" : ""}`}
    placeholder="Enter your password"
    required
    autoComplete="new-password"
  />
  {errorMessage.includes("Password") && (
    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
  )}
</div>

<div>
  <label htmlFor="confirm-password-field" className="block text-sm sm:text-base font-semibold">
    Re-enter Password
  </label>
  <input
    id="confirm-password-field"
    ref={confirmPasswordRef}
    type="password"
    value={confirmPassword}
    onChange={(e) => {
      setConfirmPassword(e.target.value);
      handleInputChange(e, "confirmPassword");
    }}
    className={`w-full p-3 border rounded-md text-sm sm:text-base ${
      darkMode
        ? "bg-gray-800 border-gray-700 placeholder-gray-400 text-white"
        : "placeholder-gray-500"
    } ${errorMessage.includes("Passwords") ? "border-red-500" : ""}`}
    placeholder="Re-enter your password"
    required
    autoComplete="new-password"
  />
  {errorMessage.includes("Passwords") && (
    <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
  )}
</div>

{/* Password match visual feedback */}
<p className={`${passwordMatchStyle} text-sm mt-1`}>
  {password && confirmPassword && (password === confirmPassword 
    ? "Passwords match" 
    : "Passwords do not match")}
</p>

            <button
              type="submit"
              className={`w-full py-3 ${isSubmitting ? 'bg-gray-400' : 'bg-green-500'} text-white text-sm sm:text-base rounded-md shadow-md hover:bg-green-600 transition-transform transform hover:scale-105`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm sm:text-base">
            Already have an account?{" "}
            <Link to="/" className="text-teal-500 hover:text-teal-600 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>

      <div style={notificationStyle} role="alert" aria-live="assertive">
        Sign-up successful! You can now log in.
      </div>
    </div>
  );
}
