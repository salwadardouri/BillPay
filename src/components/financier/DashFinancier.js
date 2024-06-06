import React, { useState, useEffect } from 'react';
import { Layout, Menu,Button , Avatar, Dropdown,Badge} from 'antd';
import { UserOutlined, SettingOutlined,MenuFoldOutlined,AppstoreOutlined,BellOutlined,DashboardOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import User from './user/User';
import Tax from './Parametre/TaxVisto';
import ServiceList from './Services/ServiceList';
import Categories from './Services/Categories';
import BasicInformation from './Parametre/BasicInformation';
import Devise from '../admin/Parametre/DeviseParam';
import './DashFinancier.css'; 
import Logo from "../../images/2.png"; 
import Bill from "../../images/1.png"; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import Profile from './Profile/ProfileFin';    

const { Header, Footer, Sider, Content } = Layout;
const DashFinancier = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('user');
  const [collapsed, setCollapsed] = useState(false);  
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState({});


  const handleMenuSelect = ({ key }) => {
    setSelectedMenuItem(key);
  };
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

  
  

  const renderContent = () => {
    switch (selectedMenuItem) {
    
      case 'User':
        return <User />;
 
          case 'BasicInformation':
            return <BasicInformation />;
            case 'Categories':
              return <Categories />;
          case 'Services':
            return <ServiceList />;

case 'profile':
  return <Profile />; 

        
            case 'Tax':
              return <Tax />;
              case 'Devise':
                return <Devise />;
      default:
        return null;
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
<Menu onClick={handleMenuSelect}>
  <Menu.Item key="0">
    <span style={{ marginLeft: 'auto' }}>{userProfile.fullname}</span>
  </Menu.Item>
  <Menu.Divider />
  <Menu.Item key="profile">
    <Link to="#">Profil</Link>
  </Menu.Item>
  <Menu.Item key="updatePassword">
    <Link to="/UpdatePassword">Change Password</Link>
  </Menu.Item>
  <Menu.Item key="logout" onClick={handleLogout}>
    Logout
  </Menu.Item>
</Menu>

   
  );
  return (
    <Layout style={{ minHeight: '100vh' }}>
       <Sider  className={`sidebar ${collapsed  ? "collapsed" : ""}` } trigger={null} collapsible collapsed={collapsed} >
        <div className={`logo-container ${collapsed ? "collapsed" : ""}`} style={{display: 'flex',alignItems: 'center',justifyContent: 'start', padding: '10px',}}>
     
          
          <div className={`logo-container ${collapsed ? "collapsed" : ""}`} style={{display: 'flex',alignItems: 'center',justifyContent: 'start', padding: '10px',}}>
          <div> 
             <img src={Logo} alt="Menu Logo" className="sidebar-logo"  style={{ width: '30px',height: '30px',  marginRight: '10px'}}/>
          </div>
          <div style={{ whiteSpace: 'nowrap',}}>  {!collapsed && <img src={Bill} alt="BillPayVisto" className="sidebar-logo"  style={{width: '120px',  height: '40px', marginRight: '10px'}}/>}</div>
        </div>
 
        </div>
        <div style={{ height: '0.2px', backgroundColor: 'grey', width: '100%' , marginTop:'-13px'}}></div>
        <Menu
          theme="dark"
        style={{marginTop: '20px'}}  
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onSelect={handleMenuSelect}
        >
            <div className={`dashboard-subtitle ${collapsed ? "collapsed" : ""}`} style={{marginLeft:'20px',marginTop:'20px' ,display: 'flex', alignItems: 'center', justifyContent: 'start', padding: '10px' }}>
          <DashboardOutlined style={{ marginRight: '10px' }} />
          {!collapsed && <span>Dashboard</span>}
        </div>
          <Menu.Item key="User" icon={<UserOutlined />} className={selectedMenuItem === 'User' ? 'selected-menu-item' : ''}>
            User
          </Menu.Item>
          <Menu.SubMenu key="Catalogue" icon={<AppstoreOutlined/>} title="Catalog">
            <Menu.Item key="Categories">Category</Menu.Item>
            <Menu.Item key="Services">Services</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
            <Menu.Item key="BasicInformation">Basic Information</Menu.Item>
            <Menu.Item key="Tax">Tax</Menu.Item>
            <Menu.Item key="Devise">Devise</Menu.Item>
          </Menu.SubMenu>
      
        </Menu>
      </Sider>
      <Layout className="site-layout">
      <Header style={{ padding: 0, background: 'white', height: '68px', display: 'flex', justifyContent: 'space-between' }}>
  <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
    <Button
      type="text"
      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => setCollapsed(!collapsed)}
      style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    />
    {/* Ajout de marge à droite */}
  
  </div>

  <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}> {/* Ajout de marge à gauche */}
  <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
  <Dropdown overlay={notificationMenu} trigger={['click']} >
        <Badge count={notifications.length} offset={[10, 0]}>
          <BellOutlined style={{ fontSize: '20px', cursor: 'pointer', color: 'black' }} />
        </Badge>
      </Dropdown>
      </div>
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
</Header>



          <Content style={{ margin: '30px 20px', padding: 24, minHeight: 280, background: 'white', borderRadius: '10px' }}>
          {renderContent()} 
          </Content>
          <Footer style={{ textAlign: 'center' }}>BillPayVisto ©{new Date().getFullYear()} Created by Visto</Footer>
        </Layout>
      </Layout>

  );
};

export default DashFinancier;
