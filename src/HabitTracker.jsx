import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt, FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { format } from "date-fns";

export default function HabitTracker() {
  const defaultHabits = [
    { name: "Drink some water", category: "Health", streak: 0, days: Array(7).fill(false), history: {}, congratulated: false },
    { name: "Do morning exercises", category: "Health", streak: 0, days: Array(7).fill(false), history: {}, congratulated: false },
    { name: "Read", category: "Personal Growth", streak: 0, days: Array(7).fill(false), history: {}, congratulated: false },
    { name: "Meditate", category: "Personal Growth", streak: 0, days: Array(7).fill(false), history: {}, congratulated: false },
    { name: "Brush and floss", category: "Health", streak: 0, days: Array(7).fill(false), history: {}, congratulated: false },
  ];

  const navigate = useNavigate();

  // State hooks
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [habits, setHabits] = useState(() => JSON.parse(localStorage.getItem("habits")) || defaultHabits);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) ?? false);
  const [seenMilestones, setSeenMilestones] = useState(() => JSON.parse(localStorage.getItem("seenMilestones")) || {});
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(null);
  const [newHabit, setNewHabit] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [weekRange, setWeekRange] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Helper functions
  const getWeekKey = useCallback(date => {
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    return firstDayOfWeek.toDateString();
  }, []);

  const isCurrentWeek = useCallback(date => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return date >= startOfWeek && date <= endOfWeek;
  }, []);

  const calculateStreak = useCallback(days => {
    let streak = 0, maxStreak = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i]) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  }, []);

  const calculateProgress = useCallback(habit => {
    return (habit.days.filter(Boolean).length / 7) * 100;
  }, []);

  // Calculate week range
  useEffect(() => {
    if (selectedDate) {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      setWeekRange(`${format(startOfWeek, "MMM dd")} - ${format(endOfWeek, "MMM dd")}`);
    }
  }, [selectedDate]);

  // Authentication check
  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth) setIsAuthenticated(true);
    else navigate("/");
  }, [navigate]);

  // Load habit data for selected week
  useEffect(() => {
    const weekKey = getWeekKey(selectedDate);
    setHabits(prevHabits =>
      prevHabits.map(habit => ({
        ...habit,
        days: habit.history[weekKey] || Array(7).fill(false),
      }))
    );
  }, [selectedDate, getWeekKey]);

  // Save habits, dark mode, and milestones to localStorage
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("seenMilestones", JSON.stringify(seenMilestones));
  }, [seenMilestones]);

  // Check for streaks and milestones
  useEffect(() => {
    const updatedHabits = [...habits];
    let milestoneReached = false;
    let milestoneMessage = "";

    habits.forEach((habit, index) => {
      if (habit.streak > 0 && habit.streak % 7 === 0 && !habit.congratulated) {
        milestoneReached = true;
        milestoneMessage = `Congratulations! You've reached ${habit.streak} days streak for "${habit.name}"!`;
        updatedHabits[index] = { ...habit, congratulated: true };
      }
    });

    if (milestoneReached) {
      setIsModalVisible(true);
      setModalMessage(milestoneMessage);
      setHabits(updatedHabits);
    }
  }, [habits]);

  // Event handlers
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsDropdownOpen(false);
    setIsAuthenticated(false);
    navigate("/");
  };

  const toggleDay = (habitIndex, dayIndex) => {
    setHabits(prevHabits =>
      prevHabits.map((habit, index) => {
        if (index === habitIndex) {
          const updatedDays = [...habit.days];
          
          // Check if any day after the current day is already toggled
          const isDayLocked = updatedDays.some((day, idx) => day && idx > dayIndex);

          if (!updatedDays[dayIndex] && isDayLocked) {
            setModalMessage("Skipped days cannot be toggled after subsequent days are marked.");
            setIsModalVisible(true);
            return habit;
          }

          updatedDays[dayIndex] = !updatedDays[dayIndex];
          const weekKey = getWeekKey(selectedDate);
          const newStreak = calculateStreak(updatedDays);

          return {
            ...habit,
            days: updatedDays,
            streak: newStreak,
            history: { ...habit.history, [weekKey]: updatedDays },
            congratulated: habit.congratulated && newStreak % 7 !== 0,
          };
        }
        return habit;
      })
    );
  };

  const resetStreaks = () => {
    if (window.confirm("Are you sure you want to reset all streak data?")) {
      setHabits(prevHabits =>
        prevHabits.map(habit => ({
          ...habit,
          streak: 0,
          days: Array(7).fill(false),
          history: {},
        }))
      );
      setSelectedDate(new Date());
    }
    setIsDropdownOpen(false);
  };

  const resetHabits = () => {
    if (window.confirm("Are you sure you want to reset to default habits? This will erase all your custom habits and progress.")) {
      localStorage.removeItem("habits");
      setHabits(defaultHabits);
      setSelectedDate(new Date());
    }
    setIsDropdownOpen(false);
  };

  const toggleCalendar = index => {
    setShowCalendar(prev => (prev === index ? null : index));
  };

  const handleAddHabit = () => {
    if (newHabit.trim() && newCategory.trim()) {
      setHabits(prevHabits => [
        ...prevHabits,
        {
          name: newHabit,
          category: newCategory,
          streak: 0,
          days: Array(7).fill(false),
          history: {},
          congratulated: false,
        },
      ]);
      setNewHabit("");
      setNewCategory("");
      setIsAddingHabit(false);
    } else {
      setModalMessage("Please enter both a habit name and category.");
      setIsModalVisible(true);
    }
  };

  const deleteHabit = habitIndex => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      setHabits(prevHabits => prevHabits.filter((_, index) => index !== habitIndex));
    }
  };

  // Get unique categories
  const categories = ["All", ...new Set(habits.map(habit => habit.category))];
  
  // Filter habits
  const filteredHabits = filterCategory === "All" 
    ? habits 
    : habits.filter(habit => habit.category === filterCategory);

  // UI Components
  const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" aria-label="Close">
          <FaTimes />
        </button>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Notice</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
        <button onClick={onClose} className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105">
          Close
        </button>
      </div>
    </div>
  );

  const HabitCard = ({ habit, habitIndex }) => (
    <div className="bg-white dark:bg-gray-800 p-5 shadow-lg rounded-lg transition-all hover:shadow-xl" role="region" aria-label={`${habit.name} habit card`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center">
          {habit.name}{" "}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
            {habit.category}
          </span>
        </h2>
        <div className="flex gap-2">
          <button onClick={() => toggleCalendar(habitIndex)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Open calendar">
            <FaCalendarAlt size={20} />
          </button>
          <button onClick={() => deleteHabit(habitIndex)} className="text-red-500 hover:text-red-700" aria-label="Delete habit">
            <FaTrash size={18} />
          </button>
        </div>
      </div>
      
      {showCalendar === habitIndex && (
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          view="month"
          tileClassName={({ date, view }) => view === "month" && isCurrentWeek(date) ? "bg-yellow-300 rounded-full" : ""}
          className="mb-3 rounded-lg"
          locale="en-US"
        />
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
          <span className="mr-1">Streak:</span>
          <span className="text-amber-500 font-bold text-lg">{habit.streak}</span>
          <span className="ml-1">🔥</span>
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400">Week: {weekRange}</p>
      </div>
      
      <div className="flex justify-between mt-4">
        {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day, dayIndex) => (
          <button
            key={dayIndex}
            onClick={() => toggleDay(habitIndex, dayIndex)}
            className={`w-10 h-10 rounded-full text-xs font-medium transition-all flex items-center justify-center ${
              habit.days[dayIndex]
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
            aria-label={`${day} - ${habit.days[dayIndex] ? "Completed" : "Not completed"}`}
            aria-pressed={habit.days[dayIndex]}
          >
            {day.slice(0, 1)}
          </button>
        ))}
      </div>
      
      <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300 flex items-center justify-center text-xs font-bold text-white"
          style={{ width: `${calculateProgress(habit)}%` }}
          role="progressbar"
          aria-valuenow={Math.round(calculateProgress(habit))}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {calculateProgress(habit) > 15 && `${Math.round(calculateProgress(habit))}%`}
        </div>
      </div>
      
      {calculateProgress(habit) < 15 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {Math.round(calculateProgress(habit))}%
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen p-5 flex flex-col items-center ${
      darkMode
        ? "bg-gray-900 text-white"
        : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
    }`}>
      {isModalVisible && <Modal message={modalMessage} onClose={() => setIsModalVisible(false)} />}

      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Habit Tracker</h1>

          {/* Controls: Mobile (dropdown) and Desktop (inline) */}
          <div className="flex items-center gap-2">
            {/* Mobile controls */}
            <div className="relative md:hidden flex items-center">
              {/* Dark mode toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="mr-2 px-3 py-2 rounded bg-gray-700 text-white transition-all hover:bg-gray-600 shadow-md"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? "☀" : "🌙"}
              </button>

              {/* Menu button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
                aria-label="Menu"
                aria-expanded={isDropdownOpen}
              >
                👤
              </button>
              
              {/* Mobile dropdown menu */}
              <div className="relative">
                {isDropdownOpen && (
                  <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsDropdownOpen(false)}></div>
                )}
                
                <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
                  isDropdownOpen ? "translate-x-0" : "translate-x-full"
                }`}>
                  <div className="flex flex-col h-full">
                    {/* Header with close button */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-gray-800 dark:text-white">Menu</h3>
                      <button
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        aria-label="Close menu"
                      >
                        <FaTimes size={20} className="text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                    
                    {/* Menu items */}
                    <div className="flex-1 overflow-y-auto">
                      <button onClick={resetStreaks} className="w-full text-left px-4 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                        Reset Streaks
                      </button>
                      <button onClick={resetHabits} className="w-full text-left px-4 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                        Reset Habits
                      </button>
                      <button onClick={() => { 
                        setIsAddingHabit(!isAddingHabit); 
                        setIsDropdownOpen(false); 
                      }} className="w-full text-left px-4 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white">
                        {isAddingHabit ? "Cancel" : "Add Habit"}
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-4 text-base hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop controls */}
            <div className="hidden md:flex gap-2 items-center">
              <button onClick={() => setDarkMode(!darkMode)} className="px-4 py-2 rounded bg-gray-700 text-white transition-all hover:bg-gray-600 shadow-md" aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
              </button>
              <button onClick={resetStreaks} className="px-4 py-2 rounded bg-gray-700 text-white transition-all hover:bg-gray-600 shadow-md">
                Reset Streaks
              </button>
              <button onClick={resetHabits} className="px-4 py-2 rounded bg-gray-700 text-white transition-all hover:bg-gray-600 shadow-md">
                Reset Habits
              </button>
              <button onClick={() => setIsAddingHabit(!isAddingHabit)} className="px-4 py-2 rounded bg-blue-600 text-white transition-all hover:bg-blue-500 shadow-md flex items-center">
                {isAddingHabit ? (<><FaTimes className="mr-1" /> Cancel</>) : (<><FaPlus className="mr-1" /> Add Habit</>)}
              </button>

              {/* User menu dropdown */}
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600" aria-label="User menu" aria-expanded={isDropdownOpen}>
                  👤
                </button>
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md z-50">
                      <button onClick={() => setIsDropdownOpen(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close menu">
                        <FaTimes size={16} />
                      </button>
                      <div className="px-4 py-2 pb-4">
                        <button onClick={handleLogout} className="w-full text-left px-2 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className={`text-center mb-6 ${darkMode ? "text-gray-300" : "text-gray-900"} text-lg font-medium italic`}>
          Stay consistent, build better habits, and track your progress effortlessly with our habit tracker. Small steps, big results!
        </p>

        {/* Add new habit form */}
        {isAddingHabit && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-white">Add New Habit</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} className="px-4 py-2 border rounded w-full text-black" placeholder="Enter new habit" aria-label="New habit name" />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="px-4 py-2 border rounded text-black" aria-label="Select category">
                <option value="">Select Category</option>
                <option value="Health">Health</option>
                <option value="Productivity">Productivity</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Fitness">Fitness</option>
                <option value="Relationships">Relationships</option>
                <option value="Career">Career</option>
              </select>
              <button onClick={handleAddHabit} className="px-6 py-2 rounded bg-blue-600 text-white transition-all hover:bg-blue-500 shadow-md">
                Add Habit
              </button>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filterCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Stats summary */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Total Habits</h3>
            <p className="text-3xl font-bold text-blue-600">{habits.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Active Streaks</h3>
            <p className="text-3xl font-bold text-green-600">{habits.filter(h => h.streak > 0).length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Longest Streak</h3>
            <p className="text-3xl font-bold text-amber-500">{Math.max(...habits.map(h => h.streak), 0)}🔥</p>
          </div>
        </div>

        {/* Habit cards */}
        {filteredHabits.length === 0 ? (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {habits.length === 0
                ? "No habits found. Add your first habit to get started!"
                : "No habits match the selected category filter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHabits.map((habit, habitIndex) => (
              <HabitCard
                key={habitIndex}
                habit={habit}
                habitIndex={habits.indexOf(habit)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}