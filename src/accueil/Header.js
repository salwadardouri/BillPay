import React from 'react';
import { Button } from 'antd';
import './Header.css'; 
import Visto from '../images/Visto.png';

import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="header">
      {/* Ajouter une div pour l'image de fond */}
   
      
      {/* Placer l'image Visto.png ici */}
      <div style={{ marginBottom: "20px" , padding:" 10px 50px"}}>
        <img src={Visto} alt="logo" style={{ marginLeft: "10px", width: "150px" }} /> 
      </div>
      


      <div style={{ marginRight: '30px', padding:" 2px 5px"}}>
        <Link to="/SignIn">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: '#022452', fontSize: '1rem' ,marginTop:"1px" ,fontFamily: 'cursive',cursor: 'pointer'}}>
            SignIn
          </Button>
        </Link>
        <Link to="/">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: '#022452', fontSize: '1rem' ,marginTop:"1px",fontFamily: 'cursive',cursor: 'pointer' }}>
            About Us
          </Button>
        </Link>
        <Link to="/">
          {/* Rediriger vers /SignIn au lieu de /signup */}
          <Button type="link" style={{ color: '#022452',fontSize: '1rem' ,marginTop:"1px",fontFamily: 'cursive',cursor: 'pointer' }}>
            Contact
          </Button>
        </Link>
      </div>
    
    </div>
  );
};

export default Header;
