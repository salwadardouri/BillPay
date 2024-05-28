// /src/AccueilClient.js
import React from 'react';
import Header from './Devis/HeaderClient';
import Title from 'antd/lib/typography/Title';
const AccueilClient = () => {
  return (
    <div>
      <Header />
      <div style={{marginLeft: '300px',  textAlign: 'center' }}>
      <div style={{ width: '75%', marginTop: '50px', background: 'transparent', border: 'none' }}>
      <Title className="animated-title" style={{ fontFamily: 'Oswald', color: '#292559', marginBottom: '0', fontSize: '70px', marginTop: '0px' }}>Welcome Back to BillPayVisto !</Title>
     </div>
      </div>
    </div>
  );
};

export default AccueilClient;
