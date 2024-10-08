// client/src/components/Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
