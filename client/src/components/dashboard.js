import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [wellBeingScore, setWellBeingScore] = useState(0);
  const [goalProgress, setGoalProgress] = useState([]);
  const [activityLog, setActivityLog] = useState([]);

  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    } else {
      fetchUserData();
    }
  }, [session, navigate]);

  async function fetchUserData() {
    // Mock data for now. Replace with actual data fetching logic.
    setDailyTasks([
      { time: "8:00 AM", task: "Meditation", status: "Done" },
      { time: "9:00 AM", task: "Journaling", status: "Done" },
      { time: "10:00 AM", task: "Exercise", status: "Pending" },
      { time: "12:00 PM", task: "Healthy Lunch", status: "Pending" }
    ]);

    setWeeklySummary({
      completedTasks: 20,
      upcomingTasks: 5,
      streak: 3
    });

    setWellBeingScore(85);

    setGoalProgress([
      { goal: "Run a 5K", progress: 50 }
    ]);

    setActivityLog([
      { date: "July 10, 2024", task: "Meditation", note: "Felt more relaxed after the session." }
    ]);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    const event = {
      'summary': eventName,
      'description': eventDescription,
      'start': {
        'dateTime': start.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': end.toISOString(),
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
    await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + session.provider_token
      },
      body: JSON.stringify(event)
    }).then((data) => data.json())
      .then((data) => {
        console.log(data);
        alert("Event created, check your Google Calendar!");
      });
  }

  return (
    <div style={{ width: "80%", margin: "30px auto" }}>
      {session ? (
        <>
          <h2>Dashboard</h2>
          <div className="dashboard-grid">
            <div className="dashboard-section">
              <h3>Daily Overview</h3>
              <div>
                {dailyTasks.map((task, index) => (
                  <div key={index}>
                    <span>{task.time} - {task.task} ({task.status})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h3>Weekly Summary</h3>
              <p>Tasks Completed: {weeklySummary.completedTasks}</p>
              <p>Upcoming Tasks: {weeklySummary.upcomingTasks}</p>
              <p>Streak: {weeklySummary.streak} days</p>
            </div>

            <div className="dashboard-section">
              <h3>Well-Being Score</h3>
              <p>Current Score: {wellBeingScore}/100</p>
              <p>Recommendations: Try to increase your physical activity.</p>
            </div>

            <div className="dashboard-section">
              <h3>Goal Tracking</h3>
              {goalProgress.map((goal, index) => (
                <div key={index}>
                  <p>Goal: {goal.goal}</p>
                  <p>Progress: {goal.progress}%</p>
                </div>
              ))}
            </div>

            <div className="dashboard-section">
              <h3>Activity Log</h3>
              {activityLog.map((log, index) => (
                <div key={index}>
                  <p>{log.date} - {log.task}: {log.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="create-event-section">
            <h3>Create Calendar Event</h3>
            <p>Start of your event</p>
            <input type="datetime-local" onChange={(e) => setStart(new Date(e.target.value))} />
            <p>End of your event</p>
            <input type="datetime-local" onChange={(e) => setEnd(new Date(e.target.value))} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>
            <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
            <button onClick={createCalendarEvent}>Create Calendar Event</button>
          </div>

          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
};

export default Dashboard;

