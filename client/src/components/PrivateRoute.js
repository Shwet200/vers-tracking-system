import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return token ? <Component {...rest} role={role} /> : <Navigate to="/login" />;
};

export default PrivateRoute;