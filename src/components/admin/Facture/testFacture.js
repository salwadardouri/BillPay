import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Space, Alert, Select, InputNumber, Table, Popconfirm,message} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const testFacture = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [clients, setClients] = useState([]);
  const [tvaList, setTvaList] = useState([]);
  const [services, setServices] = useState([]);
  const [timbre, setTimbre] = useState([]); 
  const [facture, setFacture] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantite, setQuantite] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [montant_HT, setMontant_HT] = useState(0);
  const [montant_TTC, setMontant_TTC] = useState(0);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [editRecord, setEditRecord] = useState(null);
  const showDrawer = () => setDrawerVisible(true);
  useEffect(() => {
    fetchFacture();
    fetchTimbre();
    fetchClients();
    fetchTvaList();
    fetchServices();
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
      console.error('Error fetching Categories:', error);
    }
  };
  const createRecord= async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/facture', values);
      if (response.status === 201) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        form.resetFields();
        setDrawerVisible(false);
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
      const response = await axios.put(`http://localhost:5000/facture/${editRecord._id}`, values); // Utilisez l'ID de `editRecord`
      if (response.status === 200) {
        message.success('Facture updated successfully');
        fetchFacture(); 
        onCloseDrawer(); 
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
  const onCloseDrawer = () => {
    setDrawerVisible(false);
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
    calculateMontantHT(value, prix_unitaire);
  };
  // eslint-disable-next-line
  const handlePrixUnitaireChange = (value) => {
    setPrixUnitaire(value);
    calculateMontantHT(quantite, value);
  };
  const calculateMontantHT = (quantite, prix_unitaire) => {
    const montant_HT = quantite * prix_unitaire;
    setMontant_HT(montant_HT);
    calculateMontantTTC(montant_HT, selectedTVA); // Mettre à jour le montant TTC lors du changement du montant HT
    form.setFieldsValue({ montant_HT: montant_HT })// Mettre à jour la valeur dans le formulaire
  };
 
  const calculateMontantTTC = (montant_HT, tva) => {
    if (tva) {
      let pourcent_TVA = parseFloat(tva.slice(0, -1)); // Enlever le dernier caractère (si besoin)
      const montant_TTC = montant_HT * (1 + pourcent_TVA / 100);
      setMontant_TTC(montant_TTC);
      form.setFieldsValue({ montant_TTC });
    }
  };
const handleTVAChange = (value) => {
  const tva = tvaList.find(tva => tva._id === value);
  if (tva) {
    setSelectedTVA(tva.Pourcent_TVA);
    calculateMontantTTC(montant_HT, tva.Pourcent_TVA);
  }
};
  
  const handleFormSubmit = async (values) => {
    if (editRecord) { // Si nous sommes en mode édition
      await updateRecord(values); // Appelez la fonction de mise à jour
    } else {
      await createRecord(values); // Sinon, créez un nouveau record
    }
  };
  const handleEdit = (record) => {
    setEditRecord(record);
  
    form.setFieldsValue(  { clientId: record.client?._id,
      timbreId: record.timbre?._id,
      tvaId: record.tva?._id,
      serviceId: record.service?._id,
      unite: record.unite,
      quantite: record.quantite,
      remise: record.remise,
      montant_HT: record.montant_HT,
      montant_TTC: record.montant_TTC, 
      total_TVA: record.total_TVA});
  
  
  
    setDrawerVisible(true); 
  };

  const columns = [

    { title: 'Num_Fact', dataIndex: 'Num_Fact', key: 'Num_Fact' },
        { title: 'Date_Fact', dataIndex: 'Date_Fact', key: 'Date_Fact' },
        { title: 'quantite', dataIndex: 'quantite', key: 'quantite' },
        { title: 'remise', dataIndex: 'remise', key: 'remise' },
        { title: 'unite', dataIndex: 'unite', key: 'unite' },
        { title: 'montant_HT', dataIndex: 'montant_HT', key: 'montant_HT' },
        { title: 'montant_TTC', dataIndex: 'montant_TTC', key: 'montant_TTC' },
        { title: 'total_TVA', dataIndex: 'total_TVA', key: 'total_TVA' },
       
        {
          title: 'Client',
          key: 'client_fullname',
          render: (record) => (
            <div>
              <span>{record.client.fullname}</span>
              <br />
              <span style={{ color: 'gray' }}>{record.client.email}</span>
            </div>
          ),
        },
        {
          title: 'TVA',
          dataIndex: ['tva', 'Pourcent_TVA'],
          key: 'tva_Pourcent_TVA',
        },
        {
          title: 'Actions',
          render: (_, record) => (
            <>
              <Space style={{ float: 'left' }}>
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
            </>
          ),
        },
      ];
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ float: 'right' ,backgroundColor:'#022452' }}>
        New facture
      </Button>

      <Drawer
          title={editRecord ? 'Edit service' : 'Create a new service'} 
          width={720}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        extra={
          <Space>
            <Button onClick={onCloseDrawer}>Cancel</Button>
            <Button  style={{ backgroundColor:'#022452'}} type="primary"   onClick={() => form.submit()}  htmlType="submit"> 
              {editRecord ? 'Update' : 'Create'}</Button>
          </Space>
        }
      >
        {successAlert && <Alert message="Success" description="Service created successfully." type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="Failed to create the service. Please try again later." type="error" showIcon />}
        
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="unite"
                label="unite"
                rules={[{ required: true, message: 'Please input the unite!' }]}
              >
                <Input placeholder="Enter the unite" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>
            <Form.Item
              name="quantite"
              label="Quantity"
               rules={[{ required: true, message: 'Please input the quantity!' }]}>
                  <InputNumber
                  style={{ width: '100%' }}
                
                  placeholder="Enter the quantity"
                  onChange={handleQuantiteChange}
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="remise"
                label="remise"
                rules={[{ required: true, message: 'Please input the remise!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter the remise" />
              </Form.Item>
            </Col>
          
     <Col span={12} style={{ marginBottom: '16px' }}>   
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
           
            
            <Col span={12}>
     
            <Form.Item
                name="tvaId"
                label="TVA"
                rules={[{ required: true, message: 'Please select a TVA' }]}
              >
                <Select placeholder="Select a TVA"
               
                 onChange={handleTVAChange}  // Relier l'événement `onChange` à `handleTVAChange`
                 >
                  {tvaList.map(tva => (
                    <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA} %</Option>
                  ))}
                </Select>
              </Form.Item>  
    
    
    
    </Col>
            <Col span={12}>
              <Form.Item
                name="timbreId"
                label="Timbre"
                rules={[{ required: true, message: 'Please select a Timbre' }]}
              >
                <Select placeholder="Select a timbre">
                  {timbre.map(timbre => (
                    <Option key={timbre._id} value={timbre._id}>{timbre.Valeur} </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceId"
                label="Service"
                rules={[{ required: true, message: 'Please select a Service' }]}
              >
                <Select placeholder="Select a Service">
                  {services.map(services => (
                    <Option key={services._id} value={services._id}>{services.libelle}</Option>
                  ))}
                </Select>
              </Form.Item>
              
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>    
     <Form.Item
  name="montant_HT"
  label="Montant HT"
  rules={[{ required: true, message: 'Please input the Montant_HT!' }]}
>
  <InputNumber
    style={{ width: '100%',border: 'none'  }}
  
    value={montant_HT}
    onChange={(value) => setMontant_HT(value)} 
    readOnly
  />
</Form.Item>         
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>
            <Form.Item
                name="montant_TTC"
                label="Montant TTC"
                rules={[{ required: true, message: 'Please input the Montant TTC!' }]}>
                <InputNumber
                  style={{ width: '100%',border: 'none' }}
                  value={montant_TTC}
               
                  onChange={(value) => setMontant_TTC(value)}
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>
            <Form.Item
                name="total_TVA"
                label="total_TVA"
                rules={[{ required: true, message: 'Please input the total_TVA!' }]}>
                <InputNumber
                  style={{ width: '100%',border: 'none' }}
                  placeholder="Enter the total_TVA " 
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Table
        style={{ marginTop: '80px' }}
        columns={columns}
        dataSource={facture}
        loading={loading}
    
      />
    </>
  );
};





export default testFacture;
