import React, { useState, useEffect } from 'react';
import Visto from '../../../images/Visto.png';
import Header from '../HeaderClient';
import axios from 'axios';
import {  Table,Typography, Button,Space ,Modal ,Spin, Alert  } from 'antd';
import { EyeOutlined} from '@ant-design/icons';
const { Title } = Typography;
const InvoiceList = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isShowModalVisible, setIsShowModalVisible] = useState(false);
    const [selectedFacture, setSelectedFacture] = useState(null);
    const showShowModal = (record) => {
        setIsShowModalVisible(true);
        setSelectedFacture(record);
      
      };
      const handleShowModalCancel = () => {
        setIsShowModalVisible(false);
      };
      const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };
      
    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('Access token not found');
                }
                const response = await axios.get('http://localhost:5000/auth/profile/Client', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
                setError('Erreur lors de la récupération du profil utilisateur.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const columns = [
        {
            title: 'Numéro de Facture',
            dataIndex: 'Num_Fact',
            key: 'Num_Fact',
        },
        {
            title: 'Date de Facture',
            dataIndex: 'Date_Fact',
            key: 'Date_Fact',
            render: date => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Services',
            dataIndex: 'services',
            key: 'services',
            render: services => (
                <ul>
                    {services.map(service => (
                        <li key={service._id}>
                            {service.libelle} ({service.quantite} {service.unite}) - {service.montant_HT_Apres_Remise} 
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            title: 'Total TTC',
            dataIndex: 'total_TTC',
            key: 'total_TTC',
        },
      
        {
            title: 'Devise',
            dataIndex: 'devise',
            key: 'devise',
            render: devise => devise ? `${devise.Nom_D} (${devise.Symbole})` : '',
        },
        {
            title: 'Actions',
            render: (_, record) => (
              <Space style={{ float: 'left' }}>
                <Button type="link" icon={<EyeOutlined />} onClick={() => showShowModal(record)} />
               
              </Space>
            ),
          },
    ];
    const columnsShow = [
        {
          title: 'Ref',
          dataIndex: 'reference',
          key: 'reference',
          width: '140px',
        },
        
        {
          title: 'Designation',
          dataIndex: 'libelle',
          key: 'libelle',
        
        },
         {
          title: 'Unite',
          dataIndex: 'unite',
          key: 'unite',
          width: '100px',
        },
        {
          title: 'Qté',
          dataIndex: 'quantite',
          key: 'quantite',
          width: '80px',
        },
        {
          title: 'PU',
          dataIndex: 'prix_unitaire',
          key: 'prix_unitaire',
          width: '120px',
        },
      
       
        {
          title: 'Montant HT',
          dataIndex: 'montant_HT',
          key: 'montant_HT',
          width: '150px',
        },
      ];
    
    if (loading) {
        return <Spin tip="Chargement..." />;
    }

    if (error) {
        return <Alert message="Erreur" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Header />
            <div style={{marginRight:'65px' , marginLeft:'70px'}}>
            <h1>Invoices</h1>
            {userProfile && userProfile.facture.length > 0 ? (
                <Table
                    dataSource={userProfile.facture}
                    columns={columns}
                    rowKey="_id"
                    pagination={false}
                />
            ) : (
                <p>No invoices available.</p>
            )}
            </div>
            <Modal
  width={1000}
  visible={isShowModalVisible}
  footer={
    <div style={{ textAlign: "left", padding: "10px 0" }}>
      <p style={{ fontWeight: 'bold' }}>Close this invoice at the amount of: {selectedFacture && selectedFacture.total_TTC_Lettre} {selectedFacture && selectedFacture.devise && selectedFacture.devise.Nom_D}</p>

      {/* Bouton de téléchargement */}
      

    </div>
  }
  onCancel={() => handleShowModalCancel(false)}
>


  {/* Header with image */}
  <div style={{ marginBottom: "20px", textAlign: "left" }}>
    <img src={Visto} alt="logo" style={{ width: "150px" }} />
  </div>

  {/* Invoice details */}
  {selectedFacture && (
    <>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={3} style={{ fontWeight: 'bold' }}>Invoice N° : {selectedFacture.Num_Fact}</Title>
        <p><span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(selectedFacture.Date_Fact)}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '10px', marginTop: '-90px' }}>
          <p>{selectedFacture.parametre.Nom_S}</p>
          <p>{selectedFacture.parametre.Address_S}</p>
          <p>{selectedFacture.parametre.Paye_S}</p>
          <p>{selectedFacture.parametre.Num_Phone_S}</p>
          <p>{selectedFacture.parametre.Matricule_Fiscale_S}</p>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <p><span style={{ fontWeight: 'bold' }}>Client : </span>{selectedFacture.client.fullname}</p>
          <p><span style={{ fontWeight: 'bold' }}>TIN :</span> {selectedFacture.client.matricule_fiscale || 'N/A'}</p>
          <p><span style={{ fontWeight: 'bold' }}>Address :</span> {selectedFacture.client.address}</p>
          <p><span style={{ fontWeight: 'bold' }}>Num Phone :</span> {selectedFacture.client.num_phone}</p>
        </div>
      </div>

      <Table columns={columnsShow} dataSource={selectedFacture.services} pagination={false} />

      <div style={{ textAlign: "right", marginTop: "0px" }}>
        <p><span style={{ fontWeight: 'bold' }}>Total HT: </span>{selectedFacture.total_HT}</p>

        <p><span style={{ fontWeight: 'bold' }}>Total Remise :</span> {selectedFacture.total_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total Net HT :</span> {selectedFacture.total_HT_Apres_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total TVA :</span> {selectedFacture.total_TVA}</p>
        <p><span style={{ fontWeight: 'bold' }}>Stamp :</span> {selectedFacture.timbre.Valeur}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total TTC :</span> {selectedFacture.total_TTC}</p>
      </div>
    </>
  )}
</Modal>

        </div>
    );
};

export default InvoiceList;
