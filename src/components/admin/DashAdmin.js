import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined,LogoutOutlined} from '@ant-design/icons';

import Logo from "../../images/Logo.png"; 
import Bill from "../../images/Bill4.png"; 
import User from './user/User';
import ServiceList from './Services/ServiceList';
import FactureList from './Facture/FactureList';
import BasicInformation from './Parametre/BasicInformation';
import Categories from './Parametre/Categories';
import Tax from './Parametre/TaxVisto';
import DeviseParam from './Parametre/DeviseParam';


const { Header, Footer, Sider, Content } = Layout;

const DashAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState('User'); 
  const handleMenuItemClick = (key) => {
    setSelectedMenuKey(key);
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'User':
        return <User />;
      case 'Services':
        return <ServiceList />;
        case 'Factures':
          return <FactureList />;
      case 'BasicInformation':
        return <BasicInformation />;
      case 'Categories':
        return <Categories />;
      case 'Tax':
        return <Tax />;
        case 'DeviseParam':
          return <DeviseParam />;
      default:
        return null;
    }
  };
  const getMenuItems = (onClickMenuItem) => [
    {
      key: 'User',
      label:   <div
      onClick={() => onClickMenuItem('User')}
      style={{
        color: selectedMenuKey === 'User' ? 'white' : '#B5C0D0',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        backgroundColor: selectedMenuKey === 'User' ? 'transparent' : 'transparent',
        textShadow: selectedMenuKey === 'User' ? '1px 1px 5px rgba(0, 0, 0, 0.3)' : 'none', // Added textShadow for user button
      }}
    >
      User
    </div>
    },
    {
      key: 'Services',
      label:    <div
      onClick={() => onClickMenuItem('Services')}
      style={{
        color: selectedMenuKey === 'Services' ? 'white' : '#B5C0D0',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        background: selectedMenuKey === 'Services' ? 'transparent' : 'transparent',
      }}
    >
      Services
    </div>
    },
    {
      key: 'Factures',
      label:    <div
      onClick={() => onClickMenuItem('Factures')}
      style={{
        color: selectedMenuKey === 'Factures' ? 'white' : '#B5C0D0',
        fontFamily: 'sans-serif',
        fontSize: '15px',
        background: selectedMenuKey === 'Factures' ? 'transparent' : 'transparent',
      }}
    >
     Factures
    </div>
    },
    {
      key: 'Settings',
      label: (
        <div
          onClick={() => onClickMenuItem('BasicInformation')}
          style={{
            color: selectedMenuKey === 'Settings' ? 'white' : '#B5C0D0',
            fontFamily: 'sans-serif',
            fontSize: '15px',
            background: selectedMenuKey === 'Settings' ? 'transparent' : 'transparent',
          }}
        >
         Settings
        </div>
      ),
      children: [
        {
          key: 'BasicInformation',
          label: (
            <div
              onClick={() => onClickMenuItem('BasicInformation')}
              style={{
                color: selectedMenuKey === 'BasicInformation' ? 'white' : '#B5C0D0',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                background: selectedMenuKey === 'BasicInformation' ? 'transparent' : 'transparent',
              }}
            >
              Basic Information
            </div>
          ),
        },
        {
          key: 'Categories',
          label: (
            <div
              onClick={() => onClickMenuItem('Categories')}
              style={{
                color: selectedMenuKey === 'Categories' ? 'white' : '#B5C0D0',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                background: selectedMenuKey === 'Categories' ? 'transparent' : 'transparent',
              }}
            >
              Category
            </div>
          ),
        },
        {
          key: 'Tax',
          label: (
            <div
              onClick={() => onClickMenuItem('Tax')}
              style={{
                color: selectedMenuKey === 'Tax' ? 'white' : '#B5C0D0',
                textShadow: selectedMenuKey === 'Tax' ? '1px 1px 5px rgba(0, 0, 0, 0.3)' : 'transparent',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                backgroundColor: selectedMenuKey === 'Tax' ? 'transparent' : 'transparent',
              }}
            >
              Tax
            </div>
          ),
        },
        {
          key: 'DeviseParam',
          label: (
            <div
              onClick={() => onClickMenuItem('DeviseParam')}
              style={{
                color: selectedMenuKey === 'DeviseParam' ? 'white' : '#B5C0D0',
                textShadow: selectedMenuKey === 'DeviseParam' ? '1px 1px 5px rgba(0, 0, 0, 0.3)' : 'transparent',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                backgroundColor: selectedMenuKey === 'Tax' ? 'transparent' : 'transparent',
              }}
            >
              Devise
            </div>
          ),
        },
      ],
    },
  ];
  

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


  return (
    <div className="DashAdmin" style={{ background: '#EFECEC' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider  className={`sidebar ${collapsed  ? "collapsed" : ""}` } trigger={null} collapsible collapsed={collapsed} style={{ background: '#222831' }}>
        <div className={`logo-container ${collapsed ? "collapsed" : ""}`} style={{display: 'flex',alignItems: 'center',justifyContent: 'start', padding: '10px',}}>
          <div> 
             <img src={Logo} alt="Menu Logo" className="sidebar-logo"  style={{ width: '30px',height: '25px',  marginRight: '10px',}}/>
          </div>
          <div style={{ whiteSpace: 'nowrap',}}>  {!collapsed && <img src={Bill} alt="BillPayVisto" className="sidebar-logo"  style={{width: '120px',  height: '30px', marginRight: '10px',marginTop:'15px'}}/>}</div>
        </div>
        <div style={{ height: '0.2px', backgroundColor: 'grey', width: '100%' }}></div>
         <Menu style={{ background: '#222831', marginTop: '20px', width: 'auto' }} mode="inline" items={getMenuItems(handleMenuItemClick)} defaultSelectedKeys={['User']} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: 'white', height: '68px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginTop: '15px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            />
  <div style={{ display: 'flex', alignItems: 'center' , float:'right' , marginRight:'30px', marginTop:'-25px'}}>
        <Button
          onClick={handleLogout}
          icon={<LogoutOutlined />}
          type="text"
          style={{  color: '#0C0C0C', fontSize: '16px' }}
        >
     
        </Button>
      </div>
          </Header>
      
          <Content style={{ margin: '30px 20px', padding: 24, minHeight: 280, background: 'white', borderRadius: '10px' }}>
          {renderContent()} 
          </Content>
          <Footer style={{ textAlign: 'center' }}>BillPayVisto ©{new Date().getFullYear()} Created by Visto</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default DashAdmin;
