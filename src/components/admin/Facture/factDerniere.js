import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Select, InputNumber, Table, Tooltip ,Row,Col} from 'antd';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;

const CreateInvoice = () => {
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [facture, setFacture] = useState([]);
  const [clients, setClients] = useState([]);
  const [timbre, setTimbre] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
   // eslint-disable-next-line
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedTvaId, setSelectedTvaId] = useState(null);
 
  const [remise, setRemise] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [montant_HT, setMontant_HT] = useState(0);
  const [tvaList, setTvaList] = useState([]);
  // eslint-disable-next-line
  const [devise, setDevise] = useState([]);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [factureData, setFactureData] = useState([]);
  const [montant_TTC, setMontant_TTC] = useState(0);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
   // eslint-disable-next-line
   const [factureTable, setFactureTable] = useState([
    {
      title: 'Référence',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Libellé',
      dataIndex: 'libelle',
      key: 'libelle',
    },
    {
      title: 'Prix unitaire',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
    },
    {
      title: 'Quantité',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (_, record) => (
        <InputNumber
          min={1}
          defaultValue={record.quantite}
          onChange={value => handleQuantiteChange(value, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Remise (%)',
      dataIndex: 'remise',
      key: 'remise',
      render: (_, record) => (
        <InputNumber
          min={0}
          defaultValue={record.remise}
          onChange={value => handleRemiseChange(value, record.key)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'TVA (%)',
      dataIndex: 'tvaId',
      key: 'tvaId',
      render: (_, record) => (
        <Select
          defaultValue={record.tvaId}
          onChange={value => handleTVAChange(value, record.key)}
          style={{ width: '100%' }}
        >
          {tvaList.map(tva => (
            <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA} %</Option>
          ))}
        </Select>
      ),
    },
  ]
);

 
  const [data, setData] = useState([]);
  // const [selectedServiceDetails, setSelectedServiceDetails] = useState({
  //   reference: '',
  //   libelle: '',
  //   prix_unitaire: 0,
  //   categoriesId: '',
  //   deviseId: '',
  //   quantite: 1,
  //   remise: 0,
  //   tvaId: '',
  //   montant_HT: 0
  // });
  const handleRemiseChange = (value, key) => {
    setData(prevData =>
      prevData.map(item =>
        item.key === key ? { ...item, remise: value } : item
      )
    );
  };

// eslint-disable-next-line
  const handleServiceSelection = (service) => {
    setSelectedServiceDetails(service);

    // Ajouter le service sélectionné à la facture
    setFactureData([...factureData, {
      key: factureData.length + 1,
      reference: service.reference,
      libelle: service.libelle,
      prix_unitaire: service.prix_unitaire,
    }]);
  };
  const onCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchFacture();
    fetchTimbre();
    fetchServices();
    fetchClients();
    fetchTvaList();
    fetchDevise();
  }, []);

  const fetchTvaList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tva');
      setTvaList(response.data);
    } catch (error) {
      console.error('Error fetching TVA:', error);
    }
  };

  const fetchDevise = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devise');
      setDevise(response.data);
    } catch (error) {
      console.error('Error fetching devise:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchFacture = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/facture');
      setFacture(response.data);
    } catch (error) {
      console.error('Error fetching facture:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimbre = async () => {
    try {
      const response = await axios.get('http://localhost:5000/timbre');
      setTimbre(response.data);
    } catch (error) {
      console.error('Error fetching timbre:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/facture', {
        ...values,
        unite: values.unite, // Ajout de la valeur manquante pour unite
        montant_TTC: values.montant_TTC, // Ajout de la valeur manquante pour montant_TTC
        clientId: values.clientId, // Ajout de la valeur manquante pour clientId
        serviceId: [selectedServiceId], // Utilisation de selectedServiceId pour serviceIds
        timbreId: values.timbreId, // Ajout de la valeur manquante pour timbreId
      });
      if (response.status === 201) {
        await applyToService();
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        form.resetFields();
        setModalVisible(false);
        fetchFacture();
      } else {
        throw new Error('Failed to create the facture.');
      }
    } catch (error) {
      console.error('Error creating facture:', error);
      setErrorAlert(true);
    }
  };
  
  const applyToService = async () => {
    try {
      if (selectedServiceId && selectedTvaId && quantite && montant_HT) {
        await axios.patch(`http://localhost:5000/services/${selectedServiceId}`, {
          tvaId: selectedTvaId,
          quantite,
          remise,
          montant_HT,

          prix_unitaire: selectedServiceDetails.prix_unitaire,
   
        });
      } else {
        console.error(
          'Veuillez sélectionner un service, une TVA, une quantité et un montant HT.'
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'application de la TVA au service :', error);
    }
    console.log(selectedTvaId);
    console.log(remise);
    console.log(quantite);
    console.log(montant_HT);
  
  
  }; 
   const handleCreateAndUpdate = async () => {
    try {
      await onFinish(form.getFieldsValue()); // Appel de onFinish avec les valeurs du formulaire
      await applyToService(); // Appel de applyToService
    } catch (error) {
      console.error('Erreur lors de la création et de la mise à jour :', error);
    }
  };
  
  
  const calculateMontantHT = (quantite, prix_unitaire) => {
    const montant_HT = quantite * prix_unitaire; 
    setMontant_HT(montant_HT);
    calculateMontantTTC(montant_HT, selectedTVA);
    form.setFieldsValue({ montant_HT: montant_HT });
  };
  

const calculateMontantTTC = (montant_HT, tva) => {
  if (tva) {
      let pourcent_TVA;
       if (typeof tva === 'number') {
          pourcent_TVA = tva;
      } else {
          // Handle the case where tva is not a string or number
          console.error('Invalid type for tva:', typeof tva);
          return;
      }
      const montant_TTC = montant_HT * (1 + pourcent_TVA / 100);
      setMontant_TTC(montant_TTC);
      form.setFieldsValue({ montant_TTC });
  }
};


const handleQuantiteChange = (value,key) => {
  setData(prevData =>
    prevData.map(item =>
      item.key === key ? { ...item, quantite: value } : item
    )
  );
  setQuantite(value);
  calculateMontantHT(value, prix_unitaire); // Utiliser la valeur de la quantité mise à jour
};
 // eslint-disable-next-line
 const handlePrixUnitaireChange = (value,key) => {
  setData(prevData =>
    prevData.map(item =>
      item.key === key ? { ...item, prix_unitaire: value } : item
    )
  );
  setPrixUnitaire(value);
  calculateMontantHT(quantite, value); // Utiliser la valeur du prix unitaire mise à jour
};

const handleTVAChange = (value,key) => {
  setData(prevData =>
    prevData.map(item =>
      item.key === key ? { ...item, tvaId: value } : item
    )
  );
  setSelectedTvaId(value); 
  const tva = tvaList.find(tva => tva._id === value);
  if (tva) {
    setSelectedTVA(tva.Pourcent_TVA);
    calculateMontantTTC(montant_HT, tva.Pourcent_TVA);
  }
};
const handleServiceChange = (value, option) => {
  // Récupérer les détails du service sélectionné
  const serviceDetails = services.find(service => service._id === value);
  
  // Mettre à jour les détails du service sélectionné dans l'état
  setSelectedServiceDetails(serviceDetails);

  // Ajouter les détails du service sélectionné au tableau de données
  setData(prevData => [
    ...prevData,
    {
      key: String(prevData.length + 1),
      reference: serviceDetails.reference,
      libelle: serviceDetails.libelle,
      prix_unitaire: serviceDetails.prix_unitaire,
      quantite: 1, // Ajouter d'autres valeurs par défaut si nécessaire
      remise: 0,
      tvaId: '', // Ajouter la valeur par défaut pour la TVA
    }
  ]);
};

  


  
  const columns = [
    { title: 'Num_Fact', dataIndex: 'Num_Fact', key: 'Num_Fact', render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    { title: 'Date_Fact', dataIndex: 'Date_Fact', key: 'Date_Fact', render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    {
      title: 'Client',
      key: 'client_fullname',
      render: (record) => (
        <div>
          <Tooltip placement="topLeft" title={record.client.fullname}>
            <span>{record.client.fullname}</span>
          </Tooltip>
          <br />
          <span style={{ color: 'gray' }}>{record.client.email}</span>
        </div>
      ),
    },
  ];


  return (
    <div>
      <div style={{ marginBottom: 16, float: 'right' }}>
        <Button style={{ backgroundColor: '#022452' }} type="primary" onClick={() => setModalVisible(true)}>
          <PlusOutlined /> Add Facture
        </Button>
      </div>
      {successAlert && <Alert message="Success" description="Facture created successfully." type="success" showIcon />}
      {errorAlert && <Alert message="Error" description="Failed to create the facture. Please try again later." type="error" showIcon />}
      <Table
        style={{ marginTop: '60px' }}
        columns={columns}
        dataSource={facture}
        loading={loading}
      />

      <Modal
        visible={modalVisible}
        onCancel={onCloseModal}
        footer={null}
        width={1150}
        style={{ marginTop: '20px', float: 'right' }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>

        <Row gutter={[16, 16]}>
     <Col span={8} >   
     <Form.Item
            name="clientId"
            label="Client"
            rules={[{ required: true, message: 'Please select a client!' }]}
          >
            <Select placeholder="Select a client" style={{ height: '60px' }}>
              {clients.map(client => (
                <Option key={client._id} value={client._id}>
                  <div style={{ padding: '10px 0' }}>
                    <span>{client.fullname}</span>
                    <br />
                    <span style={{ fontSize: '0.9em', color: 'gray' }}>{client.email}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          </Col></Row>

          <Row gutter={[16, 16]}>
     <Col span={6} >   
     <Form.Item
            name="serviceId"
            label="Services"
            rules={[{ required: true, message: 'Please select services' }]}
          >
            <Select
              placeholder="Select services"
              onChange={handleServiceChange}
              style={{ width: '100%' }}
            >
              {services.map(service => (
                <Option key={service._id} value={service._id}>
                  {service.libelle}
                </Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
          <Col span={6} > 
<Form.Item
  name="tvaId"
  label="TVA (%)"
  rules={[{ required: true, message: 'Please select a TVA' }]}
>
  <Select placeholder="Select a TVA" onChange={handleTVAChange}>
    {tvaList.map(tva => (
      <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA} %</Option>
    ))}
  </Select>
</Form.Item>
</Col>
<Col span={6} >
<Form.Item label="Remise (%) ">
            <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} onChange={setRemise} />
          </Form.Item>
          
</Col>
<Col span={6} >
          <Form.Item
            name="timbreId"
            label="Timbre"
          >
            <Select placeholder="Select a Timbre">
              {timbre.map(timbre => (
                <Option key={timbre._id} value={timbre._id}>{timbre.Valeur} {timbre.devise ? `(${timbre.devise.Symbole})` : ''}</Option>
              ))}
            </Select>
          </Form.Item>
          </Col>
</Row>

<Row gutter={[16, 16]}>
     <Col span={8} style={{ marginBottom: '16px' }}>   
     <Form.Item
            name="unite"
            label="Unite"
            rules={[{ required: true, message: 'Please select the unite!' }]}
          >
            <Select placeholder="Select the unite">
              <Option value="heure">Heure</Option>
              <Option value="jour">Jour</Option>
              <Option value="semaine">Semaine</Option>
              <Option value="mois">Mois</Option>
              <Option value="année">Année</Option>
            </Select>
          </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '16px' }}>
          <Form.Item label="Quantité">
            <InputNumber min={1} defaultValue={1}   onChange={handleQuantiteChange}      style={{ width: '100%' }}/>
          </Form.Item>
          </Col>

          </Row>

          <Row gutter={[16, 16]}>
     <Col span={8} style={{ marginBottom: '16px' }}>  
     <Form.Item label="Prix unitaire">
            {prix_unitaire ? `${prix_unitaire} ${services[0]?.devise ? `(${services[0]?.devise?.Symbole})` : ''}` : ''}
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: '16px' }}>  
        <Form.Item label="Montant HT"   name="montant_HT">
            <InputNumber readOnly min={0} defaultValue={0}  value={montant_HT} onChange={setMontant_HT} />
          </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: '16px' }}>  
        

              <Form.Item
                name="montant_TTC"
                label="Montant TTC"
                rules={[{ required: true, message: 'Please input the Montant TTC!' }]}
              >
                <InputNumber
                  style={{ width: '100%', border: 'none' }}
                  value={montant_TTC}
                  readOnly
                />
              </Form.Item>
</Col>
</Row>



          <Form.Item>
          <Button type="primary" htmlType="button" onClick={handleCreateAndUpdate}>
  Créer la facture et mettre à jour le service
</Button>
 
          </Form.Item>
        </Form>
        {selectedServiceDetails && (
        <Table columns={factureTable} dataSource={data} pagination={false} />
      )}


      </Modal>
    </div>
  );
};

export default CreateInvoice;
