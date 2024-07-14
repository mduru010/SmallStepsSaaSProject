import React, { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import './tasklist.css';

const habitTasks = {
  1: ['Meditate for 10 minutes', 'Practice mindfulness'],
  2: ['Write a journal entry', 'Reflect on your day'],
  3: ['Go for a 30-minute run', 'Do a 15-minute workout'],
  4: ['Eat a healthy breakfast', 'Include vegetables in your lunch'],
  5: ['Go to bed by 10 PM', 'Avoid screens before sleep'],
};

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const notificationOptions = [
  { value: 'none', label: 'None' },
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
];

const notificationMinutes = {
  morning: 30,   // Example: 30 minutes before event
  afternoon: 60, // Example: 1 hour before event
  evening: 15    // Example: 15 minutes before event
};

const Tasklist = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [taskTimes, setTaskTimes] = useState({});
  const [taskRecurrences, setTaskRecurrences] = useState({});
  const [taskNotifications, setTaskNotifications] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/');
    } else {
      const selectedHabits = JSON.parse(localStorage.getItem('selectedHabits')) || [];
      const generatedTasks = selectedHabits.flatMap(habitId => habitTasks[habitId]);
      setTasks(generatedTasks);
      const initialTaskTimes = {};
      const initialTaskRecurrences = {};
      const initialTaskNotifications = {};
      generatedTasks.forEach((task) => {
        initialTaskTimes[task] = '08:00'; // Default time for each task
        initialTaskRecurrences[task] = 'none'; // Default recurrence for each task
        initialTaskNotifications[task] = 'none'; // Default notification frequency for each task
      });
      setTaskTimes(initialTaskTimes);
      setTaskRecurrences(initialTaskRecurrences);
      setTaskNotifications(initialTaskNotifications);
    }
  }, [session, navigate]);

  const handleTimeChange = (task, time) => {
    setTaskTimes(prevTimes => ({
      ...prevTimes,
      [task]: time
    }));
  };

  const handleRecurrenceChange = (task, recurrence) => {
    setTaskRecurrences(prevRecurrences => ({
      ...prevRecurrences,
      [task]: recurrence
    }));
  };

  const handleNotificationChange = (task, notification) => {
    setTaskNotifications(prevNotifications => ({
      ...prevNotifications,
      [task]: notification
    }));
  };

  const addToCalendar = async () => {
    setIsLoading(true);
    const calendarEvents = tasks.map(task => ({
      summary: task,
      start: {
        dateTime: new Date(new Date().toDateString() + ' ' + taskTimes[task]).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(new Date(new Date().toDateString() + ' ' + taskTimes[task]).getTime() + 30 * 60000).toISOString(), // 30 minutes later
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      recurrence: taskRecurrences[task] !== 'none' ? [`RRULE:FREQ=${taskRecurrences[task].toUpperCase()}`] : undefined,
      reminders: taskNotifications[task] !== 'none' ? [
        {
          method: 'popup',
          minutes: notificationMinutes[taskNotifications[task]], // Using notificationMinutes to get the correct minutes
        }
      ] : undefined,
    }));

    try {
      for (const event of calendarEvents) {
        await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
          method: "POST",
          headers: {
            'Authorization': 'Bearer ' + session.provider_token, // Access token for google
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        });
      }
      alert('Tasks added to your Google Calendar!');
      navigate('/dashboard'); // Redirect to dashboard after successful addition
    } catch (error) {
      console.error('Error adding events to calendar:', error);
      alert('There was an error adding tasks to your Google Calendar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tasklist-container">
      <img src={'./tasklist-gif.gif'} alt="GIF Image" style={{ width: '300px', maxWidth: '100px', height: '80px'}} />
      <h2>Based on your selected wellness habits, here are your personalized to-do list items:</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
            <div className="task-item">
              <div className="task-info">
                {task}
              </div>
              <div className="task-settings">
                <input
                  type="time"
                  value={taskTimes[task]}
                  onChange={(e) => handleTimeChange(task, e.target.value)}
                  className="time-picker"
                />
                <select
                  value={taskRecurrences[task]}
                  onChange={(e) => handleRecurrenceChange(task, e.target.value)}
                  className="recurrence-select"
                >
                  {recurrenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  value={taskNotifications[task]}
                  onChange={(e) => handleNotificationChange(task, e.target.value)}
                  className="notification-select"
                >
                  {notificationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button className="add-to-calendar-button" onClick={addToCalendar} disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add to Calendar'}
      </button>
      <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default Tasklist;



