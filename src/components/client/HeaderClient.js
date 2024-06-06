import React, { useState, useEffect } from 'react';
import './HeaderClient.css'; 
import { Link } from 'react-router-dom';
import { Button, Avatar, Dropdown, Menu, Badge } from 'antd';
import { BellOutlined, UserOutlined,HomeOutlined ,FileTextOutlined, FileDoneOutlined} from '@ant-design/icons';
import axios from 'axios';
import Logo from "../../images/3.png"; 
const HeaderClient = () => {
  const [userProfile, setUserProfile] = useState({});
  const [notifications, setNotifications] = useState([]);

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
       
      }
    };

    fetchUserProfile();
    // Simulation des notifications
    setNotifications(['Notification 1', 'Notification 2','Notif 3']); // Vous devez remplacer cela par votre logique de récupération des notifications
  }, []);
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");

    if (confirmLogout) {
      try {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('formData');
  
        window.location.href = '/SignIn';
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
      }
    }
  };

  
  const notificationMenu = (
    <Menu>
      {notifications.map((notification, index) => (
        <Menu.Item key={index}>{notification}</Menu.Item>
      ))}
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="0">
        <span style={{marginLeft:'auto'}}>{userProfile.fullname}</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="profile">
        <Link to="/Client/Profil">Profil</Link>
      </Menu.Item>
      <Menu.Item key="updatePassword">
        <Link to="/Client/UpdatePassword">Change Password</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
      Logout
      </Menu.Item>
    </Menu>
    
   
  );
  return (
    <div className="headerclient">
      <div style={{ display: 'flex', padding: '10px', marginLeft:'60px' }}>
     
          <img src={Logo} alt="Menu Logo" style={{ width: '150px', height: '40px', marginRight: '10px' }} />
        </div>
      
    
      <div style={{  marginRight: '600px', marginTop: '0px' }}>
      
        <Link to="/">
  <Button type="link" style={{ color: 'white', fontSize: '1rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }} icon={<HomeOutlined />}>
    Home
  </Button>
</Link>
<Link to="/Client/Devis">
  <Button type="link" style={{ color: 'white', fontSize: '1rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }} icon={<FileTextOutlined />}>
    Devis
  </Button>
</Link>
<Link to="/Client/Profil">
  <Button type="link" style={{ color: 'white', fontSize: '1rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }} icon={<FileDoneOutlined />}>
  Invoice
  </Button>
</Link>






      </div>
      <div style={{ display: 'flex', alignItems: 'center', float: 'right', marginRight:'60px' }}>
        <div style={{ marginRight: '40px', marginTop:'10px' }}>
          <Dropdown overlay={notificationMenu} trigger={['click']}>
            <Badge count={notifications.length} offset={[10, 0]}>
              <BellOutlined style={{ fontSize: '20px', cursor: 'pointer',color:'white' }} />
            </Badge>
          </Dropdown>
        </div>
        <div>
          <Dropdown overlay={userMenu} trigger={['click']}>
            {userProfile.fullname ? (
              <Avatar style={{ backgroundColor: '#FC6736', fontWeight: 'bold', cursor: 'pointer', width: '40px', height: '40px' }}>
                {userProfile.fullname[0]}
              </Avatar>
            ) : (
              <Avatar style={{ backgroundColor: '#FC6736', fontWeight: 'bold', cursor: 'pointer', width: '40px', height: '40px' }} icon={<UserOutlined />} />
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
export default HeaderClient;
