import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon, QuestionMarkCircleIcon, ShieldCheckIcon, DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/solid";

// Field name constants to avoid magic strings
const FIELDS = {
  EMAIL: "email",
  PASSWORD: "password"
};

// Utility functions - would normally be in separate files
const formUtils = {
  // Generate error message ID for aria-describedby
  getErrorId: (field) => `${field}-error`,
  
  // Validation patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.justRegistered || false;
  
  // State management
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? JSON.parse(stored) : false;
  });
  
  const [formData, setFormData] = useState({
    [FIELDS.EMAIL]: "",
    [FIELDS.PASSWORD]: ""
  });
  
  const [validation, setValidation] = useState({
    isEmailValid: true,
    isPasswordValid: true
  });
  
  const [uiState, setUiState] = useState({
    errorMessage: "",
    fieldWithError: "",
    showAlert: justRegistered,
    alertType: justRegistered ? "success" : "", // success, error
    alertMessage: justRegistered ? "Account created successfully! Please log in." : "",
    isSubmitting: false,
    showPassword: false
  });
  
  // Refs for form fields
  const refs = {
    [FIELDS.EMAIL]: useRef(null),
    [FIELDS.PASSWORD]: useRef(null)
  };

  // Use the patterns from our utility object
  const { email: emailPattern } = formUtils.patterns;

  // Effect to apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Effect to clear location state after showing alert
  useEffect(() => {
    if (justRegistered) {
      const timer = setTimeout(() => {
        setUiState(prev => ({
          ...prev,
          showAlert: false
        }));
        window.history.replaceState({}, document.title);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [justRegistered]);

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

  // Show alert message
  const showAlert = useCallback((message, type = "error") => {
    setUiState(prev => ({
      ...prev,
      showAlert: true,
      alertType: type,
      alertMessage: message
    }));
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setUiState(prev => ({ ...prev, showAlert: false }));
    }, 5000);
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setUiState(prev => ({ ...prev, errorMessage: "", fieldWithError: "" }));
  }, []);

  // Field validation logic
  const validateFieldLogic = useCallback((field, value) => {
    switch (field) {
      case FIELDS.EMAIL:
        if (!value.trim()) 
          return { valid: false, message: "Email is required." };
        if (!emailPattern.test(value)) 
          return { valid: false, message: "Please enter a valid email address." };
        break;
        
      case FIELDS.PASSWORD:
        if (!value) 
          return { valid: false, message: "Password is required." };
        break;
    }
    
    return { valid: true, message: null };
  }, [emailPattern]);

  // Form validation
  const validateForm = useCallback(() => {
    // Reset validation state
    setValidation({
      isEmailValid: true,
      isPasswordValid: true
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
  const handleLogin = useCallback((e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setUiState(prev => ({ 
      ...prev, 
      isSubmitting: true,
      errorMessage: "",
      fieldWithError: ""
    }));
    
    // Check user credentials
    const { email, password } = formData;
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      setUiState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        showAlert: true,
        alertType: "error",
        alertMessage: "No account found with this email."
      }));
      return;
    }
    
    if (user.password !== password) {
      setUiState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        showAlert: true,
        alertType: "error",
        alertMessage: "Incorrect password. Please try again."
      }));
      return;
    }
    
    // Successful login - simulate API call
    setTimeout(() => {
      // In a real app, you'd set authentication tokens here
      localStorage.setItem("currentUser", JSON.stringify({
        username: user.username,
        email: user.email
      }));
      
      // Set isAuthenticated flag in localStorage - THIS IS THE KEY FIX
      localStorage.setItem("isAuthenticated", "true");
      
      setUiState(prev => ({ 
        ...prev, 
        isSubmitting: false,
        showAlert: true,
        alertType: "success",
        alertMessage: "Login successful! Redirecting to habit tracker..."
      }));
      
      // Redirect to habit-tracker after a brief delay
      setTimeout(() => {
        // Force the navigation with replace to ensure it works on all devices
        navigate("/habit-tracker", { replace: true });
      }, 1000);
    }, 800);
  }, [formData, navigate, validateForm]);

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setUiState(prev => ({ ...prev, showAlert: false }));
  }, []);

  // Validate a single field
  const validateField = useCallback((field, value) => {
    // Skip validation for empty fields during typing
    if (!value.trim()) {
      return true;
    }
    
    // Run the validation
    const result = validateFieldLogic(field, value);
    if (!result.valid) {
      handleError(result.message, field);
      return false;
    }
    
    return true;
  }, [validateFieldLogic, handleError]);

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
    
    // Validate the field if it has content
    if (value.trim()) {
      validateField(field, value);
    }
  }, [uiState.fieldWithError, clearError, validateField]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setUiState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  // Notification classes
  const getNotificationClasses = useCallback(() => `
    fixed z-50 flex items-center justify-between
    ${uiState.showAlert ? 'top-5 opacity-100' : '-top-24 opacity-0'}
    right-5 ${uiState.alertType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded shadow-md
    transition-all duration-500 ease-in-out
  `, [uiState.showAlert, uiState.alertType]);

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
    const isPasswordField = field === FIELDS.PASSWORD;
    const validationKey = `is${field.charAt(0).toUpperCase() + field.slice(1)}Valid`;
    const isValid = validation[validationKey];
    
    return (
      <div>
        <label htmlFor={`${field}-field`} className="block text-base font-semibold">
          {label}
        </label>
        <div className="relative">
          <input
            id={`${field}-field`}
            ref={refs[field]}
            type={isPasswordField ? (uiState.showPassword ? "text" : "password") : type}
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
              onClick={togglePasswordVisibility}
              aria-label={uiState.showPassword ? "Hide password" : "Show password"}
            >
              {uiState.showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        <p 
          id={getErrorId(field)} 
          className="h-4 text-xs mt-1 text-red-500"
        >
          {uiState.fieldWithError === field ? uiState.errorMessage : ""}
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
    togglePasswordVisibility
  ]);

  // Handle forgot password
  const handleForgotPassword = useCallback((e) => {
    e.preventDefault();
    showAlert("Password reset feature coming soon!", "info");
  }, [showAlert]);

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
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Login Page
          </div>
        </div>

        <p className="text-center text-base italic mb-10">
          Resume your habit tracking journey and continue building a better you.
          <strong> Your progress awaits!</strong>
        </p>

        <div className={getThemeClasses("formContainer")}>
          <div className="absolute inset-0 rounded-xl z-0 animate-neon-glow pointer-events-none"></div>
          <form className="relative z-10 space-y-4" onSubmit={handleLogin}>
            {renderField(FIELDS.EMAIL, "Email", "email", "Enter your email", "email")}
            {renderField(FIELDS.PASSWORD, "Password", "password", "Enter your password", "current-password")}
            
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-teal-500 hover:text-teal-700 text-sm font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 ${
                uiState.isSubmitting ? "bg-gray-400" : "bg-green-500"
              } text-white text-base rounded-md shadow-md hover:bg-green-600 transition-transform transform hover:scale-105 mt-4`}
              disabled={uiState.isSubmitting}
            >
              {uiState.isSubmitting ? "Logging In..." : "Login"}
            </button>
          </form>
        </div>

        {/* Sign Up Link - Made more visible */}
        <div className="text-center mt-6 py-3 px-4 rounded-lg bg-teal-100 border border-teal-300 shadow-sm">
          <p className="text-base font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-600 hover:text-teal-800 font-bold underline"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>

      {/* Notification Alert */}
      <div 
        className={getNotificationClasses()}
        role="alert" 
        aria-live="assertive"
      >
        <span>{uiState.alertMessage}</span>
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
            
            {/* Footer Navigation */}
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