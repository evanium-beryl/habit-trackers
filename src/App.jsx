import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./SignUpPage";
import LoginPage from "./LoginPage";
import HabitTracker from "./HabitTracker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
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

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
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
          element={isAuthenticated ? <HabitTracker darkMode={darkMode} setDarkMode={setDarkMode} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
