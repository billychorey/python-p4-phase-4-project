// client/src/components/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Activities from './Activities';
import RaceResults from './RaceResults';
import Profile from './Profile';
import Footer from './Footer';
import Navbar from './Navbar';

const App = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [activities, setActivities] = useState([]); // State to store activities
  const [error, setError] = useState(''); // State to store errors

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Fetch user data
    fetch('http://127.0.0.1:5555/api/athlete/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(data => setUser(data))
      .catch(error => {
        setError('Error fetching user data: ' + error.message);
        localStorage.removeItem('token');
        window.location.href = '/login';
      });

    // Fetch activities
    fetch('http://127.0.0.1:5555/api/activities', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        return response.json();
      })
      .then(data => setActivities(data))
      .catch(error => setError('Error fetching activities: ' + error.message));
  }, []);

  // Function to handle adding a new activity
  const handleAddActivity = (activity) => {
    const token = localStorage.getItem('token');

    fetch('http://127.0.0.1:5555/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(activity)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add activity');
        }
        return response.json();
      })
      .then(data => {
        setActivities([...activities, data]);
      })
      .catch(error => setError('Error adding activity: ' + error.message));
  };

  return (
    <div className="App">
      {user && <Navbar />} {/* Render Navbar only if user is authenticated */}
      {error && <p className="error">{error}</p>}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard user={user} activities={activities} />} />
        <Route path="/activities" element={<Activities activities={activities} onAddActivity={handleAddActivity} />} />
        <Route path="/races" element={<RaceResults />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer user={user} /> {/* Pass user data to Footer */}
    </div>
  );
};

export default App;
