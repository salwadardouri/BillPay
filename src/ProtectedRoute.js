// src/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUserRoles(response.data.roles); // Assume the API returns an array of roles
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/SignIn" replace />;
  }

  if (!allowedRoles.some(role => userRoles.includes(role))) {
    return <div>Access Denied. You don't have permission to view this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
