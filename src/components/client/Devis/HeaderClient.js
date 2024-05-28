import React from 'react';
import { Button } from 'antd';
import './HeaderClient.css'; 


import { Link } from 'react-router-dom';
import {LogoutOutlined} from '@ant-design/icons';


const HeaderClient = () => {
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
    <div className="headerclient">
      {/* Ajouter une div pour l'image de fond */}
   
      
      {/* Placer l'image Visto.png ici */}
      {/* <div style={{ marginBottom: "20px" , padding:" 10px 50px"}}>
        <img src={Visto} alt="logo" style={{ marginLeft: "10px", width: "150px" }} /> 
      </div>
       */}


      <div style={{ marginRight: '30px', float:'right'}}>

        <div style={{ display: 'flex', alignItems: 'center' , float:'right' , marginRight:'30px', marginTop:'auto'}}>
        <Button
          onClick={handleLogout}
          icon={<LogoutOutlined />}
          type="text"
          style={{  color: 'white', fontSize: '16px' }}
        >
     
        </Button>
        </div>
        <Link to="/SignIn">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: 'white', fontSize: '1rem' ,marginTop:"1px" ,fontFamily: 'cursive',cursor: 'pointer'}}>
            SignIn
          </Button>
        </Link>
        <Link to="/SignUp">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: 'white', fontSize: '1rem' ,marginTop:"1px" ,fontFamily: 'cursive',cursor: 'pointer'}}>
            SignUp
          </Button>
        </Link>
        <Link to="/">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: 'white', fontSize: '1rem' ,marginTop:"1px",fontFamily: 'cursive',cursor: 'pointer' }}>
            Home
          </Button>
        </Link>
        <Link to="/Client/Devis">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: 'white',fontSize: '1rem' ,marginTop:"1px",fontFamily: 'cursive',cursor: 'pointer' }}>
            Devis
          </Button>
        </Link>
      </div>
    
    </div>
  );
};

export default HeaderClient;
