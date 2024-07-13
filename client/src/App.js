import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/landing';
import Onboarding from './components/onboarding';
import TaskList from './components/tasklist';
import Dashboard from './components/dashboard';
import { useSessionContext } from '@supabase/auth-helpers-react';

function App() {
  const { isLoading } = useSessionContext();
  
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
