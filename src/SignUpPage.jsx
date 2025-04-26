import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignUpPage() {
  // Step 1: Check localStorage once when the page loads
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Effect to apply dark mode class when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Dark Mode Toggle Handler
  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));

      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrorMessage("");
    const newUser = { username, email, password };
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setIsSubmitting(false);
      navigate("/");
    }, 2500);
  };

  const validateForm = () => {
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      setIsUsernameValid(false);
      usernameRef.current.focus();
      return false;
    }

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const isDuplicateEmail = existingUsers.some((user) => user.email === email);
    if (isDuplicateEmail) {
      setErrorMessage("An account with this email already exists.");
      setIsEmailValid(false);
      emailRef.current.focus();
      return false;
    }

    const isUsernameTaken = existingUsers.some(
      (user) => user.username === username
    );
    if (isUsernameTaken) {
      setErrorMessage("This username has been taken.");
      setIsUsernameValid(false);
      usernameRef.current.focus();
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsEmailValid(false);
      emailRef.current.focus();
      return false;
    }

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/;
    if (!password || !passwordPattern.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
      );
      setIsPasswordValid(false);
      passwordRef.current.focus();
      return false;
    }

    if (!confirmPassword || password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsConfirmPasswordValid(false);
      confirmPasswordRef.current.focus();
      return false;
    }

    return true;
  };

  // Update `handleInputChange` to fix red border logic
  const handleInputChange = (e, field) => {
    const value = e.target.value;

    if (field === "username") {
      setUsername(value);
      if (value.trim().length >= 3) {
        setIsUsernameValid(true); // Clear red border
        setErrorMessage(""); // Clear error message
      } else {
        setIsUsernameValid(false); // Trigger red border
        setErrorMessage("Username must be at least 3 characters long.");
      }
    } else if (field === "email") {
      setEmail(value);
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(value)) {
        setIsEmailValid(true); // Clear red border
        setErrorMessage(""); // Clear error message
      } else {
        setIsEmailValid(false); // Trigger red border
        setErrorMessage("Please enter a valid email address.");
      }
    } else if (field === "password") {
      setPassword(value);
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (passwordPattern.test(value)) {
        setIsPasswordValid(true);
        // Only clear password-related error messages
        if (!errorMessage.includes("match")) {
          setErrorMessage("");
        }
      } else {
        setIsPasswordValid(false);
        setErrorMessage(
          "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character."
        );
      }
    } else if (field === "confirmPassword") {
      setConfirmPassword(value);
      if (value === password) {
        setIsConfirmPasswordValid(true); // Clear red border
        setErrorMessage(""); // Clear error message
      } else {
        setIsConfirmPasswordValid(false); // Trigger red border
        setErrorMessage("Passwords do not match.");
      }
    }
  };

  // Update input field classes to only add red border if the field is invalid
  <input
    id="username-field"
    ref={usernameRef}
    type="text"
    value={username}
    onChange={(e) => handleInputChange(e, "username")}
    disabled={isSubmitting}
    className={`box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none ${
      darkMode
        ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
        : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
    } ${!isUsernameValid ? "border-red-500" : "border-gray-300"}`}
  />;

  // Same logic for other inputs...

  const passwordRequirements = [
    { text: "At least 8 characters", regex: /^.{8,}$/ },
    { text: "At least one uppercase letter", regex: /[A-Z]/ },
    { text: "At least one lowercase letter", regex: /[a-z]/ },
    { text: "At least one number", regex: /\d/ },
    {
      text: "At least one special character (@, $, !, %, *, ?, &)",
      regex: /[@$!%*?&]/,
    },
  ];

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

  const passwordMatchStyle =
    password === confirmPassword ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
      }`}
    >
      <div
        className={`w-full py-4 px-6 shadow-lg ${
          darkMode
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black border-b border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide">
            Habit Tracker
          </h1>
          <button
            onClick={handleDarkModeToggle} // When the button is clicked, toggle dark mode
            className={`px-3 py-2 rounded-md transition-transform transform hover:scale-105 text-sm sm:text-base lg:text-lg ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gradient-to-r from-blue-100 via-yellow-200 to-white text-black hover:from-blue-200 hover:via-yellow-300"
            }`}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}{" "}
            {/* Change text based on the mode */}
          </button>
        </div>
      </div>

      <div className="px-4 w-full max-w-lg mt-10 container mx-auto">
        <p className="text-center text-base italic mb-10">
          Stay consistent, build better habits, and track your progress
          effortlessly. <strong>Small steps, big results!</strong>
        </p>

        <div
          className={`relative p-6 rounded-xl overflow-hidden backdrop-blur-md ${
            darkMode
              ? "bg-gray-800/30 border border-cyan-500 text-white"
              : "bg-white/20 border border-cyan-400 text-black"
          }`}
        >
          <div className="absolute inset-0 rounded-xl z-0 animate-neon-glow pointer-events-none"></div>
          <form className="relative z-10 space-y-4" onSubmit={handleSignUp}>
            <div>
              <label
                htmlFor="username-field"
                className="block text-base font-semibold"
              >
                Username
              </label>
              <input
                id="username-field"
                ref={usernameRef}
                type="text"
                value={username}
                onChange={(e) => handleInputChange(e, "username")}
                disabled={isSubmitting}
                className={`box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
                    : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
                } ${!isUsernameValid ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your username"
                required
                autoComplete="username"
              />
              <p className="h-4 text-xs mt-1 text-red-500">
                {errorMessage.includes("Username") ||
                errorMessage.includes("taken")
                  ? errorMessage
                  : ""}
              </p>
            </div>

            <div>
              <label
                htmlFor="email-field"
                className="block text-base font-semibold"
              >
                Email
              </label>
              <input
                id="email-field"
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
                disabled={isSubmitting}
                className={`box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
                    : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
                } ${!isEmailValid ? "border-red-500" : "border-gray-300"}`}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
              <p className="h-4 text-xs mt-1 text-red-500">
                {errorMessage.includes("Email") ||
                errorMessage.includes("account")
                  ? errorMessage
                  : ""}
              </p>
            </div>

            <div>
              <div>
                <label
                  htmlFor="password-field"
                  className="block text-base font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password-field"
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => handleInputChange(e, "password")}
                    disabled={isSubmitting}
                    className={`box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none ${
                      darkMode
                        ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
                        : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
                    } ${
                      !isPasswordValid ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    required
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
                <p className="h-4 text-xs mt-1 text-red-500">
                  {errorMessage.includes("must be at least") ||
                  errorMessage.includes("uppercase")
                    ? errorMessage
                    : ""}
                </p>

                {/* Conditionally Render Password Guide */}
                {isPasswordFocused && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {passwordRequirements.map((req, index) => (
                      <li
                        key={index}
                        className={`flex items-center ${
                          req.regex.test(password)
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        <span className="mr-2">
                          {req.regex.test(password) ? "✔" : "✘"}
                        </span>
                        {req.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirm-password-field"
                className="block text-base font-semibold"
              >
                Re-enter Password
              </label>
              <div className="relative">
                <input
                  id="confirm-password-field"
                  ref={confirmPasswordRef}
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => handleInputChange(e, "confirmPassword")}
                  disabled={isSubmitting}
                  className={`box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none ${
                    darkMode
                      ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
                      : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
                  } ${
                    !isConfirmPasswordValid
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Re-enter your password"
                  required
                />
                <div
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </div>
              </div>
            </div>

            <p className={`text-sm mt-1 ${passwordMatchStyle}`}>
              {password &&
                confirmPassword &&
                (password === confirmPassword
                  ? "Passwords match"
                  : "Passwords do not match")}
            </p>

            <button
              type="submit"
              className={`w-full py-3 ${
                isSubmitting ? "bg-gray-400" : "bg-green-500"
              } text-white text-base rounded-md shadow-md hover:bg-green-600 transition-transform transform hover:scale-105`}
              disabled={isSubmitting} // Prevent double submitting
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-base">
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
        Sign-up successful! You can now log in.
      </div>
    </div>
  );
}
