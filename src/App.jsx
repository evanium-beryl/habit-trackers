import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HabitTracker from "./HabitTracker";

function App() {
  // More robust authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check both user object and auth flag on initial load
    const user = localStorage.getItem("currentUser");
    const authFlag = localStorage.getItem("isAuthenticated");
    return user !== null && authFlag === "true";
  });

  const [darkMode, setDarkMode] = useState(() => {
    // Get dark mode preference from localStorage on initial load
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  useEffect(() => {
    // Apply dark mode to document and save preference
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Create login/logout handlers to pass to components
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("currentUser");
    localStorage.setItem("isAuthenticated", "false");
    setIsAuthenticated(false);
  };

  // Listen for authentication changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "isAuthenticated" || e.key === "currentUser") {
        const user = localStorage.getItem("currentUser");
        const authFlag = localStorage.getItem("isAuthenticated");
        setIsAuthenticated(user !== null && authFlag === "true");
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/habit-tracker" replace />
            ) : (
              <LoginPage 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                onLogin={handleLogin}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/habit-tracker" replace />
            ) : (
              <LoginPage 
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                onLogin={handleLogin}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/habit-tracker" replace />
            ) : (
              <SignUpPage darkMode={darkMode} setDarkMode={setDarkMode} />
            )
          }
        />
        <Route
          path="/habit-tracker"
          element={
            isAuthenticated ? (
              <HabitTracker 
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;