import React, { useState } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    console.log("Creating calendar event");
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
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      alert("Event created, check your Google Calendar!");
    });
  }

  return (
    <div style={{ width: "400px", margin: "30px auto" }}>
      {session ? (
        <>
          <h2>Hey there {session.user.email}</h2>
          <p>Start of your event</p>
          <input type="datetime-local" onChange={(e) => setStart(new Date(e.target.value))} />
          <p>End of your event</p>
          <input type="datetime-local" onChange={(e) => setEnd(new Date(e.target.value))} />
          <p>Event name</p>
          <input type="text" onChange={(e) => setEventName(e.target.value)} />
          <p>Event description</p>
          <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
          <hr />
          <button onClick={createCalendarEvent}>Create Calendar Event</button>
          <p></p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
};

export default Dashboard;
