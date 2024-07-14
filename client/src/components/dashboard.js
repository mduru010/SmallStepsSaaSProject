import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklySummary, setWeeklySummary] = useState([]);
  const [wellBeingScore, setWellBeingScore] = useState(0);
  const [goalProgress, setGoalProgress] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [tasks, setTasks] = useState([]); // State to store tasks from TaskList

  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    } else {
      fetchUserData();
      fetchTasks(); // Fetch tasks from the database when component mounts
    }
  }, [session, navigate]);

  async function fetchUserData() {
    // Fetch user-specific data, such as daily tasks, weekly summary, etc.
    try {
      // Mock data for now
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
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  }

  async function fetchTasks() {
    try {
      let { data: tasks, error } = await supabase.from('tasks').select('*');
      if (error) throw error;
      setTasks(tasks); // Store fetched tasks in state
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  }

  async function markTaskDone(taskId) {
    try {
      let { error } = await supabase.from('tasks').update({ status: 'Done' }).eq('id', taskId);
      if (error) throw error;
      // Update local state to reflect the change
      setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? { ...task, status: 'Done' } : task));
    } catch (error) {
      console.error('Error marking task as done:', error.message);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
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
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
};

export default Dashboard;
