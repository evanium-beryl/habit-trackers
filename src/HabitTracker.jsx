import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { format } from "date-fns"; // Import for date formatting

export default function HabitTracker() {
  const defaultHabits = [
    {
      name: "Drink some water",
      category: "Health",
      streak: 0,
      days: Array(7).fill(false),
      history: {},
      congratulated: false,
    },
    {
      name: "Do morning exercises",
      category: "Health",
      streak: 0,
      days: Array(7).fill(false),
      history: {},
      congratulated: false,
    },
    {
      name: "Read",
      category: "Personal Growth",
      streak: 0,
      days: Array(7).fill(false),
      history: {},
      congratulated: false,
    },
    {
      name: "Meditate",
      category: "Personal Growth",
      streak: 0,
      days: Array(7).fill(false),
      history: {},
      congratulated: false,
    },
    {
      name: "Brush and floss",
      category: "Health",
      streak: 0,
      days: Array(7).fill(false),
      history: {},
      congratulated: false,
    },
  ];

  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [habits, setHabits] = useState(() => {
    const storedHabits = JSON.parse(localStorage.getItem("habits"));
    return storedHabits && Array.isArray(storedHabits)
      ? storedHabits
      : defaultHabits;
  });
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) ?? false
  );
  const [seenMilestones, setSeenMilestones] = useState(
    () => JSON.parse(localStorage.getItem("seenMilestones")) || {}
  );
  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(null);
  const [newHabit, setNewHabit] = useState("");
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [weekRange, setWeekRange] = useState("");

  useEffect(() => {
    // Recalculate week range when selectedDate changes
    const calculateWeekRange = (date) => {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
      return `${format(startOfWeek, "MMM dd")} - ${format(
        endOfWeek,
        "MMM dd"
      )}`;
    };

    if (selectedDate) {
      const week = calculateWeekRange(selectedDate);
      setWeekRange(week);
    }
  }, [selectedDate]); // Runs when selectedDate changes

  // Updated getCurrentWeekRange function
  const getCurrentWeekRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${format(startOfWeek, "MMM dd")} - ${format(endOfWeek, "MMM dd")}`;
  };

  // Define isCurrentWeek function here to avoid the ReferenceError
  const isCurrentWeek = (date) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start of the current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End of the current week

    // Check if the given date is within the current week
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Authentication logic
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      setIsAuthenticated(true);
    } else {
      navigate("/"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove only the authentication flag
    localStorage.removeItem("isAuthenticated");
    setIsDropdownOpen(false);
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login page
  };

  const handleLogin = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);

      // Load habits data for the logged-in user
      const userHabits = JSON.parse(localStorage.getItem("habits"));
      if (userHabits) {
        setHabits(userHabits); // Load existing habits for returning users
      } else {
        setHabits(defaultHabits); // Initialize habits if no data exists
      }

      navigate("/habit-tracker"); // Redirect to habit tracker
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleSignUp = (email, password) => {
    // Ensure we clear any previous user data before storing the new one
    localStorage.clear(); // Clear all previous localStorage data
    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user)); // Save new user to localStorage
    localStorage.setItem("isAuthenticated", "true"); // Set authentication flag
    setIsAuthenticated(true);

    // Clear old habits data and reset to default habits for new user
    localStorage.removeItem("habits");
    localStorage.setItem("habits", JSON.stringify(defaultHabits)); // Reset habits
    setHabits(defaultHabits); // Initialize habits to default state
    navigate("/habit-tracker"); // Redirect to habit tracker page
  };

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits)); // Store updated habits in localStorage
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-black";
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("seenMilestones", JSON.stringify(seenMilestones));
  }, [seenMilestones]);

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
      console.log(`Showing alert: ${milestoneMessage}`);
      setIsModalVisible(true);
      setModalMessage(milestoneMessage);

      // Update state with congratulated habits after setting modal
      setHabits(updatedHabits);
    }
  }, [habits]);

  const toggleDay = (habitIndex, dayIndex) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit, index) => {
        if (index === habitIndex) {
          const updatedDays = [...habit.days];

          // Check if any day after the current day is already toggled
          const isDayLocked = updatedDays.some(
            (day, idx) => day && idx > dayIndex
          );

          if (!updatedDays[dayIndex] && isDayLocked) {
            // Display custom popup for skipped days
            setModalMessage(
              "Skipped days cannot be toggled after subsequent days are marked."
            );
            setIsModalVisible(true);
            return habit;
          }

          // Toggle the selected day
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

  const calculateStreak = (days) => {
    let streak = 0;
    let maxStreak = 0;
    for (let i = 0; i < days.length; i++) {
      if (days[i]) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }
    return maxStreak;
  };

  const calculateProgress = (habit) => {
    const completedDays = habit.days.filter(Boolean).length;
    return (completedDays / 7) * 100;
  };

  const resetStreaks = () => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => ({
        ...habit,
        streak: 0,
        days: Array(7).fill(false),
        history: {},
      }))
    );

    // Reset selected date to today after resetting streaks
    const today = new Date();
    setSelectedDate(today);
  };

  const toggleCalendar = (index) => {
    setShowCalendar((prev) => (prev === index ? null : index));
  };

  const getWeekKey = (date) => {
    const firstDayOfWeek = new Date(date);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    return firstDayOfWeek.toDateString(); // Use the week's starting day as the key
  };

  useEffect(() => {
    const weekKey = getWeekKey(selectedDate);
    setHabits((prevHabits) =>
      prevHabits.map((habit) => ({
        ...habit,
        days: habit.history[weekKey] || Array(7).fill(false), // Load days for the selected week
      }))
    );
  }, [selectedDate]);

  const handleAddHabit = () => {
    if (newHabit.trim() && newCategory.trim()) {
      setHabits((prevHabits) => [
        ...prevHabits,
        {
          name: newHabit,
          category: newCategory,
          streak: 0,
          days: Array(7).fill(false),
          history: {},
        },
      ]);
      setNewHabit("");
      setNewCategory("");
      setIsAddingHabit(false);
    }
  };

  const deleteHabit = (habitIndex) => {
    setHabits((prevHabits) =>
      prevHabits.filter((_, index) => index !== habitIndex)
    );
  };

  const Popup = ({ message, onClose }) => (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Notice
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`min-h-screen p-5 flex flex-col items-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-yellow-100 to-white text-black"
      }`}
    >
      {isModalVisible && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {console.log("Modal is visible")}
          {/* Modal content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-80 z-50">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              Milestone Reached!
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {modalMessage}
            </p>
            <button
              onClick={() => setIsModalVisible(false)}
              className="mt-6 w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Habit Tracker</h1>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105"
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={resetStreaks}
              className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105"
            >
              Reset Streaks
            </button>
            <button
              onClick={() => setIsAddingHabit(!isAddingHabit)}
              className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              {isAddingHabit ? "Cancel" : "Add Habit"}
            </button>
           
            {/* Reset Habits Button */}
            <button
              onClick={() => {
                // Remove habits from localStorage
                localStorage.removeItem("habits");

                // Reset habits state to defaults
                setHabits(defaultHabits);

                // Reset selectedDate to today
                const today = new Date();
                setSelectedDate(today);

                console.log("Habits reset and selectedDate updated to today.");
              }}
              className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Reset Habits
            </button>

            {/* User Icon and Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-800"
              >
                👤
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-md">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p
          className={`text-center mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-900"
          } text-lg font-medium italic`}
        >
          Stay consistent, build better habits, and track your progress
          effortlessly with our habit tracker. Small steps, big results!
        </p>

        {isAddingHabit && (
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              className="px-4 py-2 border rounded w-full"
              placeholder="Enter new habit"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Health">Health</option>
              <option value="Productivity">Productivity</option>
              <option value="Personal Growth">Personal Growth</option>
            </select>
            <button
              onClick={handleAddHabit}
              className="px-4 py-2 rounded bg-gray-700 text-white transition-transform transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Add
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit, habitIndex) => (
            <div
              key={habitIndex}
              className="bg-white dark:bg-gray-800 p-5 shadow-lg rounded-lg transition-transform transform hover:scale-105"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg text-gray-300 dark:text-white">
                  {habit.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({habit.category})
                  </span>
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleCalendar(habitIndex)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaCalendarAlt size={20} />
                  </button>
                  <button
                    onClick={() => deleteHabit(habitIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {showCalendar === habitIndex && (
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  view="month"
                  tileClassName={({ date, view }) =>
                    view === "month" && isCurrentWeek(date)
                      ? "bg-yellow-300 rounded-full"
                      : ""
                  }
                  className="mb-3 rounded-lg"
                  locale="en-US" // Ensure proper locale for Sunday start
                />
              )}
              <span className="text-sm text-gray-500 dark:text-gray-300">
                Streak: {habit.streak} 🔥
              </span>
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                Week: {weekRange}
              </p>
              <div className="flex justify-between mt-2">
                {"Sun Mon Tue Wed Thu Fri Sat"
                  .split(" ")
                  .map((day, dayIndex) => (
                    <button
                      key={dayIndex}
                      onClick={() => toggleDay(habitIndex, dayIndex)}
                      className={`w-12 h-12 sm:w-10 sm:h-10 rounded-full text-sm font-medium transition-transform transform hover:scale-110 ${
                        habit.days[dayIndex]
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-black"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
              </div>
              <div className="mt-4 bg-gray-300 dark:bg-gray-600 rounded h-3 overflow-hidden">
                <div
                  className="h-full bg-green-500 flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${calculateProgress(habit)}%` }}
                >
                  {`${Math.round(calculateProgress(habit))}%`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
