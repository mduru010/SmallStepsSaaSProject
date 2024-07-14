import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@supabase/auth-helpers-react';
import './onboarding.css';

const habits = [
  { id: 1, icon: '🧘', title: 'Meditation', description: 'Spend a few minutes each day to meditate and clear your mind.' },
  { id: 2, icon: '📓', title: 'Journaling', description: 'Write down your thoughts and experiences to reflect on your day.' },
  { id: 3, icon: '🏃‍♂️', title: 'Exercise', description: 'Engage in physical activities to keep your body healthy.' },
  { id: 4, icon: '🥗', title: 'Healthy Eating', description: 'Incorporate more fruits and vegetables into your meals.' },
  { id: 5, icon: '💤', title: 'Better Sleep', description: 'Improve your sleep quality with a consistent bedtime routine.' },
];

const Onboarding = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  const toggleHabitSelection = (habitId) => {
    if (selectedHabits.includes(habitId)) {
      setSelectedHabits((prevSelected) =>
        prevSelected.filter((id) => id !== habitId)
      );
    } else if (selectedHabits.length < 3) {
      setSelectedHabits((prevSelected) => [...prevSelected, habitId]);
    }
  };

  const completeOnboarding = () => {
    if (selectedHabits.length === 0) {
      setError('Please select at least one habit.');
    } else {
      localStorage.setItem('selectedHabits', JSON.stringify(selectedHabits));
      navigate('/tasklist');
    }
  };

  return (
    <div className="onboarding-container">
       <img src={'./onboarding-gif.gif'} alt="GIF Image" style={{ width: '200px', maxWidth: '100px' }} />
      <h2>Onboarding</h2>
      <p>Welcome to the onboarding page! Select your wellness habits:</p>
      {error && <p className="error-message">{error}</p>}
      <div className="cards-container">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className={`card ${selectedHabits.includes(habit.id) ? 'selected' : ''}`}
            onClick={() => toggleHabitSelection(habit.id)}
          >
            <div className="icon">{habit.icon}</div>
            <h3>{habit.title}</h3>
            <p>{habit.description}</p>
          </div>
        ))}
      </div>
      <button className="complete-button" onClick={completeOnboarding}>Complete Onboarding</button>
    </div>
  );
};

export default Onboarding;
