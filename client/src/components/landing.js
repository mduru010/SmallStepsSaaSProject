import React from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Landing = () => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/onboarding');
    }
  }, [session, navigate]);

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if (error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  return (
    <div style={{ width: "400px", margin: "30px auto" }}>
      <h2>Welcome to Our App</h2>
      <button onClick={googleSignIn}>Sign In With Google</button>
    </div>
  );
};

export default Landing;
