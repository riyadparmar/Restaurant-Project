import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from './auth';

const PrivateRoute = ({ children }) => {
  const currentUser = getCurrentUser();

  // If there's no current user, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Render the children if the user is authenticated
  return children;
};

export default PrivateRoute;