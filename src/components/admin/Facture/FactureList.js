import React, { useState, useEffect } from 'react';
import { Button, Modal ,Input,Form, Row, Col, Space, Alert, Select, InputNumber, Table, Popconfirm, message,Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Search } = Input;
const { Option } = Select;


const FactureList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [clients, setClients] = useState([]);
  const [tvaList, setTvaList] = useState([]);
  const [services, setServices] = useState([]);
  const [timbre, setTimbre] = useState([]); 
  // eslint-disable-next-line
  const [devise, setDevise] = useState([]); 
  const [facture, setFacture] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantite, setQuantite] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [montant_HT, setMontant_HT] = useState(0);
  const [montant_TTC, setMontant_TTC] = useState(0);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [editRecord, setEditRecord] = useState(null);  


  useEffect(() => {
    fetchFacture();
    fetchTimbre();
    fetchClients();
    fetchTvaList();
    fetchServices();
    fetchDevise();
  }, []);
  
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

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

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
      console.error('Error fetching TVA:', error);
    }
  };
  const fetchTimbre = async () => {
    try {
      const response = await axios.get('http://localhost:5000/timbre');
      setTimbre(response.data);
    } catch (error) {
      console.error('Error fetching Timbre:', error);
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

  const createRecord = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/facture', values);
      if (response.status === 201) {
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

  const updateRecord = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/facture/${editRecord._id}`, values);
      if (response.status === 200) {
        message.success('Facture updated successfully');
        fetchFacture();
        setModalVisible();
       
      } else {
        throw new Error('Failed to update facture');
      }
    } catch (error) {
      message.error('Failed to update facture');
      console.error('Error updating facture:', error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/facture/${record._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Data deleted successfully');
        fetchFacture();
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Failed to delete data');
    }
  };

  const onCloseModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditRecord(null);
  };

  useEffect(() => {
    if (clients.length > 0) {
      // eslint-disable-next-line
       const clientOptions = clients.map((client) => ({
        label: client.fullname,
        value: client._id,
      }));
    }
  }, [clients]); 

  const handleQuantiteChange = (value) => {
    setQuantite(value);
    calculateMontantHT(value, prix_unitaire); // Utiliser la valeur de la quantité mise à jour
  };
   // eslint-disable-next-line
  const handlePrixUnitaireChange = (value) => {
    setPrixUnitaire(value);
    calculateMontantHT(quantite, value); // Utiliser la valeur du prix unitaire mise à jour
  };
  
  const handleServiceChangeCalcule = (serviceId) => {
    const selectedService = services.find(service => service._id === serviceId);
    if (selectedService) {
      setPrixUnitaire(selectedService.prix_unitaire);
      calculateMontantHT(quantite, selectedService.prix_unitaire); // Utiliser le prix unitaire du service sélectionné
    }
  };
  

  const calculateMontantHT = (quantite, prix_unitaire,remise) => {
    const montant_HT = (quantite * prix_unitaire); 
    setMontant_HT(montant_HT);
    calculateMontantTTC(montant_HT, selectedTVA);
    form.setFieldsValue({ montant_HT: montant_HT });
  };
  

  const calculateMontantTTC = (montant_HT, tva) => {
  

        const pourcent_TVA = tva;
        const montant_TTC = montant_HT * (1 + pourcent_TVA / 100);
        setMontant_TTC(montant_TTC);
        form.setFieldsValue({ montant_TTC });
    
};


const handleTVAChange = (value) => {
  const tva = tvaList.find(tva => tva._id === value);
  if (tva) {
    setSelectedTVA(tva.Pourcent_TVA);
    calculateMontantTTC(montant_HT, tva.Pourcent_TVA);
  }
};

  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateRecord(values);
    } else {
      await createRecord(values);
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    form.setFieldsValue({
      clientId: record.client?._id,
      timbreId: record.timbre?._id,
      tvaId: record.tva?._id,
      serviceId: record.service?._id,
      unite: record.unite,
      quantite: record.quantite,
      remise: record.remise,
      montant_HT: record.montant_HT,
      montant_TTC: record.montant_TTC, 

    });
    setModalVisible(true); 
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
    {
      title: 'TVA',
      dataIndex: ['tva', 'Pourcent_TVA'],
      key: 'tva_Pourcent_TVA',
      render: (value) => (
        <span>{value}%</span>
      ),
    },
    {
      title: 'Timbre',
      dataIndex: ['timbre', 'Valeur'],
      key: 'timbre_Valeur',
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    { title: 'remise', dataIndex: 'remise', key: 'remise' , render: (value) => (
      <span>{value}%</span>
    ),},
    { title: 'quantite', dataIndex: 'quantite', key: 'quantite', render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
   
    { title: 'unite', dataIndex: 'unite', key: 'unite', render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    { title: 'montant_HT', dataIndex: 'montant_HT', key: 'montant_HT' , render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'montant_TTC', dataIndex: 'montant_TTC', key: 'montant_TTC', render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
   
   
          <div>
 
       <div style={{ marginBottom: 16, float: 'right' }}>
        <Button style={{ backgroundColor: '#022452' }} type="primary" onClick={() => setModalVisible(true)}>
            <PlusOutlined /> Add Facture </Button>
            </div>
            <Search
        placeholder="Search "
        style={{ maxWidth: 780, marginBottom: 20 }}
      />
            <Table
        style={{ marginTop: '60px' }}
        columns={columns}
        dataSource={facture}
        loading={loading}
      />

      <Modal
        title={editRecord ? 'Edit Facture' : 'Add Facture'}
        visible={modalVisible}
        onCancel={onCloseModal}
        footer={null}
width={900}
      >

        {successAlert && <Alert message="Success" description="Facture created successfully." type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="Failed to create the facture. Please try again later." type="error" showIcon />}
        
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <Row gutter={[16, 16]}>
     <Col span={8} style={{ marginBottom: '16px' }}>   
       <Form.Item
                name="clientId"
                label="Client"
                rules={[{ required: true, message: 'Please select a client!' }]}
              >
                <Select placeholder="Select a client"
               
               style={{ height: '60px' }}>
                  {clients.map(client => (
                    <Option key={client._id} value={client._id} >
                          <div style={{ padding: '10px 0' }}>
                <span>{client.fullname}</span>
                <br />
                <span style={{ fontSize: '0.9em', color: 'gray' }}>{client.email}</span>
              </div></Option>
                  ))}
                </Select>
              </Form.Item>
              
            </Col>
            </Row>
            <Row gutter={[16, 16]}>
     <Col span={8} style={{ marginBottom: '16px' }}>  
     
  <Form.Item
    name="serviceId"
    label="Service"
    rules={[{ required: true, message: 'Please select a Service' }]}
  >
    <Select placeholder="Select a Service" onChange={handleServiceChangeCalcule

    }>
      {services.map(service => (
        <Select.Option key={service._id} value={service._id}>
          {service.libelle}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>
</Col>
<Col span={8}>
              <Form.Item
                name="tvaId"
                label={
                  <span>
                    TVA (%)
                  </span>
                }
                rules={[{ required: true, message: 'Please select a TVA' }]}
              >
                <Select placeholder="Select a TVA" onChange={handleTVAChange}>
                  {tvaList.map(tva => (
                    <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA} %</Option>
                  ))}
                </Select>
              </Form.Item>  
            </Col>
            <Col span={8} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="remise"
                label={
                  <span>
                    Remise (%)
                  </span>
                }
                rules={[{ required: true, message: 'Please input the remise!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter the remise" />
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
              <Form.Item
                name="quantite"
                label="Quantity"
                rules={[{ required: true, message: 'Please input the quantity!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter the quantity"
                  onChange={handleQuantiteChange}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginBottom: '16px' }}>  
          
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
    label="Prix unitaire"
  >
    {prix_unitaire ? `${prix_unitaire} ${services[0].devise ? `(${services[0].devise.Symbole})` : ''}` : ''}
  </Form.Item>
      </Col>
    
   



            <Col span={8} style={{ marginBottom: '16px' }}>    
              <Form.Item
                name="montant_HT"
                label="Montant HT"
                rules={[{ required: true, message: 'Please input the Montant_HT!' }]}
              >
                <InputNumber
                  style={{ width: '100%', border: 'none' }}
                  value={montant_HT}
                  readOnly
                />
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
            <Button
              type="primary"
              style={{ width: '100px', marginTop: '20px', backgroundColor: '#022452' }}
              htmlType="submit"
            >
              {editRecord ? 'Update' : 'Create'}
            </Button>

      
          </Form.Item>
        </Form>


   </Modal>
    </div>
  );
};

export default FactureList;
