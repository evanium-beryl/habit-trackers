import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon, QuestionMarkCircleIcon, ShieldCheckIcon, DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

// Field name constants to avoid magic strings
const FIELDS = {
  USERNAME: "username",
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword"
};

// Utility functions - would normally be in separate files
const formUtils = {
  // Generate error message ID for aria-describedby
  getErrorId: (field) => `${field}-error`,
  
  // Validation patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,}$/
  },
  
  // Get CSS classes based on theme and validation state
  getInputClasses: (isValid, isDarkMode) => `
    box-border w-full h-12 px-4 border rounded-md text-base transition-all duration-300 focus:outline-none 
    ${isDarkMode
      ? "bg-gray-800 placeholder-gray-400 text-white focus:ring-2 focus:ring-cyan-500 hover:ring-1 hover:ring-cyan-500"
      : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white placeholder-gray-500 text-black focus:ring-2 focus:ring-cyan-400 hover:ring-1 hover:ring-cyan-400"
    } 
    ${isValid ? "border-gray-300" : "border-red-500"}
  `,
  
  // Theme classes for UI elements
  getThemeClasses: (type, isDarkMode) => {
    const baseClasses = {
      container: "min-h-screen flex flex-col items-center justify-center pt-16", // Added padding-top for fixed header
      header: "fixed top-0 left-0 right-0 z-50 w-full py-4 px-6 shadow-lg", // Added fixed positioning
      formContainer: "relative p-6 rounded-xl overflow-hidden backdrop-blur-md",
      footer: "w-full py-4 mt-6"
    };
    
    const themeClasses = isDarkMode ? {
      container: "bg-gray-900 text-white",
      header: "bg-gray-900 text-white border-b border-gray-700",
      formContainer: "bg-gray-800/30 border border-cyan-500 text-white",
      footer: "bg-gray-800 text-gray-300"
    } : {
      container: "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black",
      header: "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black border-b border-gray-200",
      formContainer: "bg-white/20 border border-cyan-400 text-black",
      footer: "bg-gradient-to-r from-blue-50 via-yellow-50 to-white text-gray-700"
    };
    
    return `${baseClasses[type]} ${themeClasses[type]}`;
  }
};

export default function SignUpPage() {
  const navigate = useNavigate();
  
  // State management
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });
  
  const [formData, setFormData] = useState({
    [FIELDS.USERNAME]: "",
    [FIELDS.EMAIL]: "",
    [FIELDS.PASSWORD]: "",
    [FIELDS.CONFIRM_PASSWORD]: ""
  });
  
  const [validation, setValidation] = useState({
    isUsernameValid: true,
    isEmailValid: true,
    isPasswordValid: true,
    isConfirmPasswordValid: true
  });
  
  const [uiState, setUiState] = useState({
    errorMessage: "",
    fieldWithError: "",
    showAlert: false,
    isSubmitting: false,
    showPassword: false,
    showConfirmPassword: false
  });
  
  // Refs for form fields
  const refs = {
    [FIELDS.USERNAME]: useRef(null),
    [FIELDS.EMAIL]: useRef(null),
    [FIELDS.PASSWORD]: useRef(null),
    [FIELDS.CONFIRM_PASSWORD]: useRef(null)
  };

  // Use the patterns from our utility object
  const { email: emailPattern, password: passwordPattern } = formUtils.patterns;

  // Effect to apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Toggle dark mode handler
  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  // Centralized error handling function
  const handleError = useCallback((message, field) => {
    setUiState(prev => ({ 
      ...prev, 
      errorMessage: message, 
      fieldWithError: field 
    }));
    
    if (field) {
      const validationKey = `is${field.charAt(0).toUpperCase() + field.slice(1)}Valid`;
      setValidation(prev => ({ ...prev, [validationKey]: false }));
      
      if (refs[field]?.current) {
        refs[field].current.focus();
      }
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setUiState(prev => ({ ...prev, errorMessage: "", fieldWithError: "" }));
  }, []);

  // Field validation logic
  const validateFieldLogic = useCallback((field, value, allValues = formData) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    switch (field) {
      case FIELDS.USERNAME:
        if (!value.trim()) 
          return { valid: false, message: "Username is required." };
        if (value.trim().length < 3) 
          return { valid: false, message: "Username must be at least 3 characters long." };
        if (existingUsers.some(user => user.username.toLowerCase() === value.toLowerCase()))
          return { valid: false, message: "This username has been taken." };
        break;
        
      case FIELDS.EMAIL:
        if (!value.trim()) 
          return { valid: false, message: "Email is required." };
        if (!emailPattern.test(value)) 
          return { valid: false, message: "Please enter a valid email address." };
        if (existingUsers.some(user => user.email.toLowerCase() === value.toLowerCase()))
          return { valid: false, message: "An account with this email already exists." };
        break;
        
      case FIELDS.PASSWORD:
        if (!value) 
          return { valid: false, message: "Password is required." };
        if (!passwordPattern.test(value))
          return { valid: false, message: "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character." };
        break;
        
      case FIELDS.CONFIRM_PASSWORD:
        if (!value) 
          return { valid: false, message: "Please confirm your password." };
        if (value !== allValues[FIELDS.PASSWORD])
          return { valid: false, message: "Passwords do not match." };
        break;
    }
    
    return { valid: true, message: null };
  }, [emailPattern, passwordPattern, formData]);

  // Form validation
  const validateForm = useCallback(() => {
    // Reset validation state
    setValidation({
      isUsernameValid: true,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmPasswordValid: true
    });
    
    clearError();

    // Validate each field using our centralized logic
    const fields = Object.values(FIELDS);
    
    for (const field of fields) {
      const { valid, message } = validateFieldLogic(field, formData[field]);
      
      if (!valid) {
        handleError(message, field);
        return false;
      }
    }

    return true;
  }, [formData, clearError, validateFieldLogic, handleError]);

  // Handle form submission
  const handleSignUp = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setUiState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      errorMessage: "",
      fieldWithError: "",
      showAlert: true
    }));
    
    // Save user data
    const { username, email, password } = formData;
    const newUser = { username, email, password };
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem("users", JSON.stringify([...existingUsers, newUser]));
    
    setTimeout(() => {
      navigate("/", { state: { justRegistered: true } });
    }, 1000);
  }, [formData, navigate, validateForm]);

  // Dismiss success notification
  const dismissNotification = useCallback(() => {
    setUiState(prev => ({ ...prev, showAlert: false }));
  }, []);

  // Validate a single field
  const validateField = useCallback((field, value) => {
    // Skip validation for empty fields during typing (except username)
    if ((field === FIELDS.PASSWORD || field === FIELDS.EMAIL) && !value.trim()) {
      return true;
    }
    
    // For confirmation password, check both fields if password changes
    if (field === FIELDS.PASSWORD && formData[FIELDS.CONFIRM_PASSWORD]) {
      const updatedValues = { ...formData, [field]: value };
      const confirmResult = validateFieldLogic(FIELDS.CONFIRM_PASSWORD, formData[FIELDS.CONFIRM_PASSWORD], updatedValues);
      
      if (!confirmResult.valid) {
        handleError(confirmResult.message, FIELDS.CONFIRM_PASSWORD);
        return false;
      }
    }
    
    // Run the main validation
    const result = validateFieldLogic(field, value);
    if (!result.valid) {
      handleError(result.message, field);
      return false;
    }
    
    return true;
  }, [formData, validateFieldLogic, handleError]);

  // Handle input changes
  const handleInputChange = useCallback((e, field) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset field validation
    const validationKey = `is${field.charAt(0).toUpperCase() + field.slice(1)}Valid`;
    setValidation(prev => ({ ...prev, [validationKey]: true }));
    
    // Clear error if we're editing the field with error
    if (uiState.fieldWithError === field) {
      clearError();
    }
    
    // Validate the field if it has content or if it's a required field that's now empty
    if (value.trim() || field === FIELDS.USERNAME) {
      validateField(field, value);
    }
  }, [uiState.fieldWithError, clearError, validateField]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback((field) => {
    const stateKey = field === FIELDS.PASSWORD ? "showPassword" : "showConfirmPassword";
    setUiState(prev => ({ ...prev, [stateKey]: !prev[stateKey] }));
  }, []);
  
  // Handlers for password toggle buttons
  const handlePasswordToggle = useCallback(() => togglePasswordVisibility(FIELDS.PASSWORD), [togglePasswordVisibility]);
  const handleConfirmPasswordToggle = useCallback(() => togglePasswordVisibility(FIELDS.CONFIRM_PASSWORD), [togglePasswordVisibility]);

  // Notification classes
  const getNotificationClasses = useCallback(() => `
    fixed z-50 flex items-center justify-between
    ${uiState.showAlert ? 'top-5 opacity-100' : '-top-24 opacity-0'}
    right-5 bg-green-500 text-white p-4 rounded shadow-md
    transition-all duration-500 ease-in-out
  `, [uiState.showAlert]);

  // Memoized utility functions
  const getInputClasses = useCallback((isValid) => {
    return formUtils.getInputClasses(isValid, darkMode);
  }, [darkMode]);
  
  const getThemeClasses = useCallback((type) => {
    return formUtils.getThemeClasses(type, darkMode);
  }, [darkMode]);
  
  const getErrorId = useCallback(formUtils.getErrorId, []);

  // Shared input field rendering function
  const renderField = useCallback((field, label, type, placeholder, autoComplete) => {
    const isPasswordField = field === FIELDS.PASSWORD || field === FIELDS.CONFIRM_PASSWORD;
    const validationKey = `is${field.charAt(0).toUpperCase() + field.slice(1)}Valid`;
    const isValid = validation[validationKey];
    const showPasswordToggle = field === FIELDS.PASSWORD ? uiState.showPassword : uiState.showConfirmPassword;
    const toggleHandler = field === FIELDS.PASSWORD ? handlePasswordToggle : handleConfirmPasswordToggle;
    
    return (
      <div>
        <label htmlFor={`${field}-field`} className="block text-base font-semibold">
          {label}
        </label>
        <div className="relative">
          <input
            id={`${field}-field`}
            ref={refs[field]}
            type={isPasswordField ? (showPasswordToggle ? "text" : "password") : type}
            value={formData[field]}
            onChange={(e) => handleInputChange(e, field)}
            disabled={uiState.isSubmitting}
            className={getInputClasses(isValid)}
            placeholder={placeholder}
            required
            autoComplete={autoComplete}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? getErrorId(field) : undefined}
          />
          {isPasswordField && (
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleHandler}
              aria-label={showPasswordToggle ? "Hide password" : "Show password"}
            >
              {showPasswordToggle ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        <p 
          id={getErrorId(field)} 
          className={`${field === FIELDS.CONFIRM_PASSWORD ? 'text-sm' : 'h-4 text-xs'} mt-1 ${
            field === FIELDS.CONFIRM_PASSWORD && formData[FIELDS.PASSWORD] && formData[FIELDS.CONFIRM_PASSWORD]
              ? formData[FIELDS.PASSWORD] === formData[FIELDS.CONFIRM_PASSWORD]
                ? "text-green-500"
                : "text-red-500"
              : "text-red-500"
          }`}
        >
          {uiState.fieldWithError === field 
            ? uiState.errorMessage 
            : field === FIELDS.CONFIRM_PASSWORD && formData[FIELDS.PASSWORD] && formData[FIELDS.CONFIRM_PASSWORD]
              ? formData[FIELDS.PASSWORD] === formData[FIELDS.CONFIRM_PASSWORD]
                ? "Passwords match"
                : "Passwords do not match"
              : ""}
        </p>
      </div>
    );
  }, [
    formData, 
    validation, 
    uiState, 
    handleInputChange, 
    getInputClasses, 
    getErrorId, 
    handlePasswordToggle, 
    handleConfirmPasswordToggle
  ]);

  return (
    <div className={getThemeClasses("container")}>
      {/* Header */}
      <div className={getThemeClasses("header")}>
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 text-white p-2 rounded-full">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide">
              HabitTracker
            </h1>
          </div>
          <button
            onClick={handleDarkModeToggle}
            className={`px-3 py-2 rounded-md transition-transform transform hover:scale-105 text-sm sm:text-base lg:text-lg ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gradient-to-r from-blue-100 via-yellow-200 to-white text-black hover:from-blue-200 hover:via-yellow-300"
            }`}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 w-full max-w-lg mt-16 container mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
          <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Sign Up Page
          </div>
        </div>

        <p className="text-center text-base italic mb-10">
          Stay consistent, build better habits, and track your progress
          effortlessly. <strong>Small steps, big results!</strong>
        </p>

        <div className={getThemeClasses("formContainer")}>
          <div className="absolute inset-0 rounded-xl z-0 animate-neon-glow pointer-events-none"></div>
          <form className="relative z-10 space-y-4" onSubmit={handleSignUp}>
            {renderField(FIELDS.USERNAME, "Username", "text", "Enter your username", "username")}
            {renderField(FIELDS.EMAIL, "Email", "email", "Enter your email", "email")}
            {renderField(FIELDS.PASSWORD, "Password", "password", "Enter your password", undefined)}
            {renderField(FIELDS.CONFIRM_PASSWORD, "Re-enter Password", "password", "Re-enter your password", undefined)}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 ${
                uiState.isSubmitting ? "bg-gray-400" : "bg-green-500"
              } text-white text-base rounded-md shadow-md hover:bg-green-600 transition-transform transform hover:scale-105`}
              disabled={uiState.isSubmitting}
            >
              {uiState.isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Login Link - Made more visible */}
        <div className="text-center mt-6 py-3 px-4 rounded-lg bg-teal-100 border border-teal-300 shadow-sm">
          <p className="text-base font-medium">
            Already have an account?{" "}
            <Link
              to="/"
              className="text-teal-600 hover:text-teal-800 font-bold underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      {/* Success Notification */}
      <div 
        className={getNotificationClasses()}
        role="alert" 
        aria-live="assertive"
      >
        <span>Sign-up successful! Redirecting to login...</span>
        <button 
          onClick={dismissNotification}
          className="ml-4 text-white font-bold hover:text-gray-100 focus:outline-none"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>

      {/* Footer with Updated Navigation */}
      <footer className={getThemeClasses("footer")}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-green-500 text-white p-1 rounded-full">
                <CheckCircleIcon className="h-4 w-4" />
              </div>
              <span className="font-bold">HabitTracker</span>
            </div>
            
            {/* Updated Footer Navigation */}
            <div className="flex justify-center space-x-8 mb-4 w-full max-w-md">
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <InformationCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs mt-1">About</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <QuestionMarkCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs mt-1">FAQ</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs mt-1">Privacy</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <DocumentTextIcon className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs mt-1">Terms</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
                  <EnvelopeIcon className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs mt-1">Contact</span>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center">
              <p className="text-sm">&copy; {new Date().getFullYear()} HabitTracker. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}