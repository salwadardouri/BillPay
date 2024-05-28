// /votreContexteAuthentification.js

import React, { createContext, useState } from 'react';
import {Alert} from 'antd';
import { useNavigate } from 'react-router-dom';
// Créez un contexte d'authentification
export const AuthContext = createContext();

// Créez un composant fournisseur pour envelopper votre application avec le contexte d'authentification
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur authentifié
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fonction pour connecter l'utilisateur

  const login = async (values) => {
    try {
      const { email, password } = values;
  
      // Prepare data based on your API requirements
      const postData = {
        email,
        password,
      };
  
      // Make a POST request to your login API
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Handle successful login
        console.log('Login successful', responseData);
      
        // Set success message and navigate after 1 second
        setUser(responseData.user); // Utilisez responseData au lieu de userData
        setSuccessMessage('Login successful');
        setTimeout(() => {
          const { roles } = responseData.user;
          if (roles.includes('ADMIN')) {
            navigate('/DashAdmin');
          } else if (roles.includes('FINANCIER')) {
            navigate('/DashFinancier');
          } else if (roles.includes('CLIENT')) {
            navigate('/Client');
          } else {
            console.error('Unknown role:', roles);
          }
        }, 3000);
      }
      
    } catch (error) {
      console.error('An error occurred', error);
      setErrorMessage('An error occurred');
      setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 1 second
    }
  };

  const logout  = async () => {
    try {
      const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');

      if (confirmed) {
        const response = await fetch('http://localhost:5000/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          // Rediriger vers la page de connexion ou une autre page après la déconnexion
          setUser(null);
          window.location.href = '/SignIn';
        } else {
          console.error('Erreur lors de la déconnexion');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  // Valeurs à fournir dans le contexte
  const authValues = {
    user,
    login,
    logout,
  };

  return (
    <div>
    {successMessage && <Alert message={successMessage} type="success" showIcon />}
    {errorMessage && <Alert message={errorMessage} type="error" showIcon/>}
    <AuthContext.Provider value={authValues}>
      {children}
    </AuthContext.Provider>
    </div>
  );
};
