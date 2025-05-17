import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HabitTracker from "./HabitTracker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // More robust initial authentication check
    const user = localStorage.getItem("currentUser");
    const authFlag = localStorage.getItem("isAuthenticated");
    return user !== null && authFlag === "true";
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Add listener for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const user = localStorage.getItem("currentUser");
      const authFlag = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(user !== null && authFlag === "true");
    };

    // Listen for storage changes in other tabs
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
          element={<LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/signup"
          element={<SignUpPage darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/habit-tracker"
          element={
            isAuthenticated ? (
              <HabitTracker 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;