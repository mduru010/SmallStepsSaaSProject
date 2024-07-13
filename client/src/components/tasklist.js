import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

const TaskList = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  function goToDashboard() {
    navigate('/dashboard');
  }

  return (
    <div style={{ width: "400px", margin: "30px auto" }}>
      <h2>Task List</h2>
      <p>Your tasks will be shown here.</p>
      <button onClick={goToDashboard}>Go to Dashboard</button>
    </div>
  );
};

export default TaskList;
