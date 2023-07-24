import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user information from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('authority');

    // Clear the JWT token from the HttpOnly cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="text-center mt-5">
      <h3>Are you sure you want to logout?</h3>
      <Button variant="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;