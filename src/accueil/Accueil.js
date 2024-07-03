import React from 'react';
import Header from './Header'; // Ajustez le chemin d'import selon votre structure de dossier
import BillPayVisto from '../images/BillPayVisto.png';
import { Card ,Layout, Row, Col} from 'antd';
import Title from 'antd/lib/typography/Title';
import './Accueil.css';
import VistoBlanc from '../images/vistoblanc.png';

const { Footer } = Layout;
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
          <p style={{ marginBottom: '10px',fontWeight: 'bold', fontFamily: 'Inter' }}>Bienvenue sur notre application de gestion de facturation et de paiement, où simplifier vos processus financiers est notre priorité.</p>
          <Title className="animated-title" style={{ fontFamily: 'Oswald', color: '#292559', marginBottom: '0', fontSize: '110px', marginTop: '0px' }}>BillPayVisto</Title>

          <Card className="animated-card" style={{ fontFamily: 'Inter',backgroundColor:'#FECF47',textAlign: 'left'  ,fontWeight: 'bold' , border:'#FECF47',marginBottom: '50px'}}>Simplifiez la gestion de vos factures, gérez vos paiements en toute sécurité, le tout depuis un seul endroit.</Card>
        </div>
</div>
<div >
<Footer style={{backgroundColor:'#7E8EF1' }}>
<Row justify="space-between" align="middle">
      <Col>
        <p style={{ color: 'white', fontSize: '1.3rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }}>
          BillPayVisto
        </p>
        <div style={{ marginBottom: "20px", padding: "10px 50px" }}>
          <img src={VistoBlanc} alt="logo" style={{ marginLeft: "10px", width: "150px", height: '40px' }} />
        </div>
      </Col>
      <Col style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
        <p style={{ color: 'white', fontSize: '1.3rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }}>
          Nous Contact
        </p>
        <p style={{ color: 'white', fontSize: '1.3rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer', marginLeft: "20px" }}>
          À propos
        </p>
      </Col>
      <Col>
        <p style={{ color: 'white', fontSize: '1.3rem', marginTop: "1px", fontFamily: 'cursive', cursor: 'pointer' }}>
          Nous rejoindre
        </p>
      </Col>
    </Row>
    <div style={{ textAlign: 'center', color: 'white',}}> 
      BillPayVisto ©{new Date().getFullYear()} Créé par Visto
    </div>
  </Footer>
  </div>
    </div>
  );
}

export default Accueil;
