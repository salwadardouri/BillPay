import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../HeaderClient';
const ProfileClient = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        // Gérer les erreurs ici
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
          <Header />
      {userProfile ? (
        <div>
          <h2>User Profile</h2>
          <p>Name: {userProfile.fullname}</p>
          <p>Email: {userProfile.email}</p>
          {/* Ajoutez d'autres détails du profil ici */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfileClient;