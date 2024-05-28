import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Space, Alert, Select, InputNumber,message, Table, Popconfirm} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ServiceList = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [clients, setClients] = useState([]);
  const [tvaList, setTvaList] = useState([]);

  const [categories, setCategories] = useState([]);  
  const [devise, setDevise] = useState([]);

  const [devis, setDevis] = useState([]);
   // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [quantite, setQuantite] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [montant_HT, setMontant_HT] = useState(0);
  const [montant_TTC, setMontant_TTC] = useState(0);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [editRecord, setEditRecord] = useState(null);


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
      console.error('Error fetching Devise:', error);
    }
  };
    const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching Categories:', error);
    }
  };
  const fetchDevis = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devis');
      setDevis(response.data);
    } catch (error) {
      console.error('Error fetching Categories:', error);
    }
  };
  useEffect(() => {
    fetchDevise();
    fetchCategories();
    fetchClients();
    fetchTvaList();
    fetchDevis();
  }, []);
  useEffect(() => {
    if (clients.length > 0) {
       // eslint-disable-next-line
      const clientOptions = clients.map((client) => ({
        label: client.fullname,
        value: client._id,
      }));
    }
  }, [clients]); 
  const showDrawer = () => setDrawerVisible(true);

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
    setEditRecord(null); 
  };

  const createRecord= async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/devis', values);
      if (response.status === 201) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        form.resetFields();
        setDrawerVisible(false);
        fetchDevis();
      } else {
        throw new Error('Failed to create the devis.');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setErrorAlert(true);
    }
  };

  const handleQuantiteChange = (value) => {
    setQuantite(value);
    calculateMontantHT(value, prix_unitaire);
  };

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
      const montant_TTC = montant_HT * (1 + tva / 100);
      setMontant_TTC(montant_TTC);
      form.setFieldsValue({ montant_TTC });
    }
  };

// eslint-disable-next-line
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

  form.setFieldsValue({
    clientId: record.client?._id,
    deviseId: record.devise?._id,
    categoriesId: record.categories?._id,
    libelle: record.libelle,
    quantite: record.quantite,
    unite: record.unite,
    commentaire: record.commentaire,
    Date_Envoi:record.Date_Envoi,
    montant_HT:record.montant_HT,
    montant_TTC:record.montant_TTC,
    Total_HT:record.Total_HT,
    prix_unitaire:record.prix_unitaire,
    Total_TVA:record.Total_TVA,
    Total_TTC:record.Total_TTC,
    Etat:record.Etat,
    Num_Fact:record.Num_Fact,
    tvaId:record.tvaId,
    timbreId:record.timbreId,
  
  });



  setDrawerVisible(true); 
};
const updateRecord = async (values) => {
  try {
    const response = await axios.put(`http://localhost:5000/devis/${editRecord._id}`, values); // Utilisez l'ID de `editRecord`
    if (response.status === 200) {
      message.success('devis updated successfully');
      fetchDevis(); // Rafraîchissez la liste des services
      onCloseDrawer(); // Fermez le Drawer
    } else {
      throw new Error('Failed to update devis');
    }
  } catch (error) {
    message.error('Failed to update devis');
    console.error('Error updating devis:', error);
  }
};


  const columns = [
    {
        title: 'Date_Envoi',
        dataIndex: 'Date_Envoi',
        key: 'Date_Envoi',
      },
  
    {
      title: 'Categories',
      dataIndex: ['categories', 'Titre_Categorie'],
      key: 'categories_Titre_Categorie',
    },
    {
        title: 'libelle',
        dataIndex: 'libelle',
        key: 'libelle',
      },
  

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




  const handleDelete = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/devis/${record._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Data deleted successfully');
        fetchDevis();
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Failed to delete data');
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ float: 'right' ,backgroundColor:'#022452' }}>
        New Devis
      </Button>

      <Drawer
        title={editRecord ? 'Edit devis' : 'Create a new devis'} 
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
        <Col span={12} style={{ marginBottom: '16px' }}>      
              <Form.Item
                name="libelle"
                label="Designation"
                rules={[{ required: true, message: 'Please input the designation!' }]}
              >
                <Input placeholder="Enter the designation"  />
              </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '16px' }}>   
              <Form.Item
                name="deviseId"
                label="Devise"
                rules={[{ required: true, message: 'Please select a Devise' }]}
              >
                <Select placeholder="Select a Devise"
                >
                  {devise.map(devise => (
                    <Option key={devise._id} value={devise._id}>
                      <div>
                         <span>
                         {devise.Nom_D} ({devise.Symbole})
                         </span>
                     </div>
                   </Option>
                  ))}
                </Select>
              </Form.Item>
         </Col>
         </Row>
         <Row gutter={[16, 16]}>
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
        <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
              name="prix_unitaire"
              label="Unit Price"
              rules={[{ required: true, message: 'Please input the unit price!' }]}>
                <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter the unit price"
                onChange={handlePrixUnitaireChange}
             
                     />
               </Form.Item>
     </Col>
     </Row>
     
    <Row gutter={[16, 16]}>
    <Col span={12} style={{ marginBottom: '16px' }}>       
    
        
    <Form.Item
                name="tvaId"
                label="TVA"
                rules={[{ required: true, message: 'Please select a TVA' }]}
              >
                <Select placeholder="Select a TVA"
               
                 onChange={handleTVAChange}  // Relier l'événement `onChange` à `handleTVAChange`
                 >
                  {tvaList.map(tva => (
                    <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA}</Option>
                  ))}
                </Select>
              </Form.Item>  
    
    
    
    </Col>
    <Col span={12} style={{ marginBottom: '16px' }}><Form.Item
                name="categoriesId"
                label="Categories"
                rules={[{ required: true, message: 'Please select a Categories' }]}
              >
                <Select placeholder="Select a Categories"  >
                  {categories.map(categories => (
                    <Option key={categories._id} value={categories._id}>{categories.Titre_Categorie}</Option>
                  ))}
                </Select>
              </Form.Item> </Col>
    </Row>
    <Row gutter={[16, 16]}>
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
      
    </Row>
            



  


        </Form>
      </Drawer>

      <Table
        style={{ marginTop: '80px' }}
        columns={columns}
        dataSource={devis}
        loading={loading}
    
      />
    </>
  );
};

export default ServiceList;
