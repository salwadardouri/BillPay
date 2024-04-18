import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { TeamOutlined, MenuFoldOutlined, MenuUnfoldOutlined ,SettingOutlined} from '@ant-design/icons';
import User from './user/User';
import ParametreVisto from './Parametre/ParametreVisto';
import Services from './Services/ServiceList';
import Logo from "../../images/Logo.png"; 
import Bill from "../../images/Bill4.png"; 

const { Header, Footer, Sider, Content } = Layout;

const DashAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuKey, setSelectedMenuKey] = useState(null);

  const renderContent = () => {
    switch (selectedMenuKey) {
      case 'User':
        return <User />;
       
          case 'Parametre':
            return <ParametreVisto />;
            case 'Services':
              return <Services/>;
      
      default:
        return null;
    }
  };

  const handleMenuClick = (e) => {
    setSelectedMenuKey(e.key);
  };

  return (
    <div className="DashAdmin" style={{ background: '#EFECEC' }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider className={`sidebar ${collapsed  ? "collapsed" : ""}` } trigger={null} collapsible collapsed={collapsed} style={{ background: '#222831' }}>
        <div className={`logo-container ${collapsed ? "collapsed" : ""}`} style={{display: 'flex',alignItems: 'center',justifyContent: 'start', padding: '10px',}}>
          <div> 
             <img src={Logo} alt="Menu Logo" className="sidebar-logo"  style={{ width: '30px',height: '25px',  marginRight: '10px',}}/>
          </div>
          <div style={{ whiteSpace: 'nowrap',}}>  {!collapsed && <img src={Bill} alt="BillPayVisto" className="sidebar-logo"  style={{width: '120px',  height: '30px', marginRight: '10px',marginTop:'15px'}}/>}</div>
        </div>
        <div style={{ height: '0.2px', backgroundColor: 'grey', width: '100%' }}></div>  {/* Ligne blanche mince ajoutée ici */}

        <Menu
      mode="inline"
      selectedKeys={[selectedMenuKey]}
      onClick={handleMenuClick}
      style={{ background: '#222831', marginTop: '20px' , width:'auto'   }}
    >
    <Menu.Item
          icon={<TeamOutlined style={{ marginLeft: '-15px' }} />}
          style={{
            color: selectedMenuKey === 'User' ? 'white' : '#B5C0D0',
            fontFamily: 'sans-serif',
            fontSize: '15px',
            background: selectedMenuKey === 'User' ? 'transparent' : 'transparent',
     
          }}
          key="User"
        >
          <span>Users</span>
        </Menu.Item>
        <Menu.Item
          icon={<TeamOutlined style={{ marginLeft: '-15px' }} />}
          style={{
            color: selectedMenuKey === 'Services' ? 'white' : '#B5C0D0',
            fontFamily: 'sans-serif',
            fontSize: '15px',
            background: selectedMenuKey === 'Services' ? 'transparent' : 'transparent',
     
          }}
          key="Services"
        >
          <span>Services</span>
        </Menu.Item>
        <Menu.Item
          icon={<SettingOutlined style={{ marginLeft: '-15px' }} />}
          style={{
            color: selectedMenuKey === 'Parametre' ? 'white' : '#B5C0D0',
            fontFamily: 'sans-serif',
            fontSize: '15px',
            background: selectedMenuKey === 'Parametre' ? 'transparent' : 'transparent',
     
          }}
          key="Parametre"
        >
          <span>Settings</span>
        </Menu.Item>
    </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: 'white', height: '68px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ marginTop: '15px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0C0C0C' }}
            />
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
