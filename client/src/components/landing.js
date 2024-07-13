import React, { useEffect } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

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
    <div style={{ width: "400px", margin: "30px auto", backgroundColor: "#ffe5d9", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
      <img src={"./smallstepslogo.png"} alt="SmallSteps Logo" />
      <h2>Welcome to SmallSteps!</h2>
      <p style={{ textAlign: "center" }}>Take the first step towards a healthier, more balanced life.</p>
      <h3>Sync Your Calendar To Get Started</h3>
      <button onClick={googleSignIn} className="button">
        Sign In With Google
      </button>
    </div>
  );
};

export default Landing;
