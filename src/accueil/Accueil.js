import React from 'react';
import Header from './Header'; // Ajustez le chemin d'import selon votre structure de dossier
import BillPayVisto from '../images/BillPayVisto.png';
import { Card } from 'antd';
import Title from 'antd/lib/typography/Title';
import './Accueil.css';

function Accueil() {
  return (
    <div className="accueil">
      <Header />
        
      {/* Placer l'image Visto.png ici */}
      <div className="background-image">
        <img src={BillPayVisto} alt="background" className="animated-image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      
      <div style={{ marginLeft:'10px', margin: '0 auto', padding: '70px 50px', textAlign: 'left' }}>
      <div style={{ width: '50%', marginTop: '50px', background: 'transparent', border: 'none' }}>
          <p style={{ marginBottom: '10px',fontWeight: 'bold', fontFamily: 'Inter' }}>Welcome to our billing and payment management application, where simplifying your financial processes is our priority</p>
          <Title className="animated-title" style={{ fontFamily: 'Oswald', color: '#292559', marginBottom: '0', fontSize: '110px', marginTop: '0px' }}>BillPayVisto</Title>

          <Card className="animated-card" style={{ fontFamily: 'Inter',backgroundColor:'#FECF47',textAlign: 'left'  ,fontWeight: 'bold' , border:'#FECF47',marginBottom: '50px'}}>Simplify your invoice management, securely handle your payments, all from one place.</Card>
        </div>
</div>

    </div>
  );
}

export default Accueil;
