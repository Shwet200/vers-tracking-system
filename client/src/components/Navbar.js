import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    alert('Successfully logged out');
    navigate('/login'); // Redirect to login page
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="header">
      <img src="/logo.png" alt="Company Logo" />
      <h1>Versogen, Inc.</h1>
      {!isLoginPage && (
        <Button color="red" onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default Navbar;
