import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import { useEffect } from 'react';

const Onboarding = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  function completeOnboarding() {
    navigate('/tasklist');
  }

  return (
    <div style={{ width: "400px", margin: "30px auto" }}>
      <h2>Onboarding</h2>
      <p>Welcome to the onboarding page!</p>
      <button onClick={completeOnboarding}>Complete Onboarding</button>
    </div>
  );
};

export default Onboarding;
