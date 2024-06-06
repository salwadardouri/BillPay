import React, { useState, useEffect } from 'react';
import { Layout, Menu,Button , Avatar, Dropdown,Badge} from 'antd';
import { UserOutlined, FileOutlined,FileTextOutlined,SettingOutlined,MenuFoldOutlined,AppstoreOutlined, BellOutlined,DashboardOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import User from './user/User';
import Tax from './Parametre/TaxVisto';
import ServiceList from './Services/ServiceList';
import Categories from './Parametre/Categories';
import BasicInformation from './Parametre/BasicInformation';
import Devise from '../admin/Parametre/DeviseParam';
import FactureList from './Facture/FactureList';
import DevisList from './Devis/DevisList';
import CreateInvoice from './Facture/CreateInvoice';
import Logo from "../../images/2.png"; 
import Bill from "../../images/1.png"; 
import './DashAdmin.css'; 
const { Header, Footer, Sider, Content } = Layout;


const DashAdmin = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState('user');
  const [collapsed, setCollapsed] = useState(false);  
  const [notifications, setNotifications] = useState([]);
  const handleMenuSelect = ({ key }) => {
    setSelectedMenuItem(key);
  };


  useEffect(() => {
    // Remplacez ceci par votre logique pour obtenir les notifications par l'ID de l'utilisateur
    const fetchNotifications = async () => {
      const response = await fetch(`/api/notifications?userId`);
      const data = await response.json();
      setNotifications(data);
    };

    fetchNotifications();
  });

    const handleLogout = async () => {
      try {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
  
        if (confirmed) {
          const response = await fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
  
          if (response.ok) {
            // Rediriger vers la page de connexion ou une autre page après la déconnexion
            window.location.href = '/SignIn';
          } else {
            console.error('Erreur lors de la déconnexion');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
      }
    };
    const handleChangePassword = async () => {
      try {
        const confirmed = window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?');
  
        if (confirmed) {
          const response = await fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
          if (response.ok) {
            // Rediriger vers la page de connexion ou une autre page après la déconnexion
            window.location.href = '/SignIn';
          } else {
            console.error('Erreur lors de la déconnexion');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion', error);
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
            case 'Tax':
              return <Tax />;
              case 'Devise':
                return <Devise />;
                case 'Devis':
                  return <DevisList />;
                case 'Factures':
                  return <FactureList />;
                   case 'Facture':
                   return <CreateInvoice />;
      default:
        return null;
    }
  };
  const notificationMenu = (
    <Menu>
      {notifications.length === 0 ? (
        <Menu.Item key="0">Aucune notification</Menu.Item>
      ) : (
        notifications.map((notification, index) => (
          <Menu.Item key={index}>{notification.message}</Menu.Item>
        ))
      )}
    </Menu>
  );
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <span style={{marginLeft:'30px'}}>Admin</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={handleChangePassword}>
        Change Password 
      </Menu.Item>
      <Menu.Item key="2" onClick={handleLogout}>
       LogOut
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
       <Menu.Item key="dashboard" icon={<DashboardOutlined />} className={selectedMenuItem === 'dashboard' ? 'selected-menu-item' : ''}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="User" icon={<UserOutlined />} className={selectedMenuItem === 'User' ? 'selected-menu-item' : ''}>
            Users
          </Menu.Item>
          <Menu.SubMenu key="Catalogue" icon={<AppstoreOutlined/>} title="Catalog">
            <Menu.Item key="Categories">Category</Menu.Item>
            <Menu.Item key="Services">Services</Menu.Item>
          </Menu.SubMenu>
         
          <Menu.Item key="Devis" icon={<FileOutlined />} className={selectedMenuItem === 'Devis' ? 'selected-menu-item' : ''}>
           Devis
          </Menu.Item>
          <Menu.Item key="Factures" icon={<FileTextOutlined />} className={selectedMenuItem === 'Factures' ? 'selected-menu-item' : ''}>
         Factures
          </Menu.Item>
         <Menu.Item key="Facture" icon={<FileTextOutlined />} className={selectedMenuItem === 'Facture' ? 'selected-menu-item' : ''}>
          Facture
          </Menu.Item> 
           <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="Settings">
            <Menu.Item key="BasicInformation">Basic Information</Menu.Item>
            <Menu.Item key="Tax">Tax</Menu.Item>
            <Menu.Item key="Devise">Devise</Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
      <Header style={{ padding: 0, background: 'white', height: '68px' }}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{ marginTop: '15px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      />
      <div style={{ display: 'flex', alignItems: 'center', float: 'right', marginRight: '30px', marginTop: '-25px' }}>
      <Dropdown overlay={notificationMenu} trigger={['click']}>
          <Badge count={notifications.length} offset={[10, 0]}>
            <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' ,marginRight: '25px' }} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={menu} trigger={['click']} style={{ marginLeft: '15px' }}>
          <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
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

export default DashAdmin;
