import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Space, Alert, Select, InputNumber, Table, Popconfirm} from 'antd';
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
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);  
  const [devise, setDevise] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
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
      console.error('Error fetching Devise:', error);
    }
  };  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching Categories:', error);
    }
  };
  useEffect(() => {
    fetchDevise();
    fetchCategories();
    fetchClients();
    fetchTvaList();
    fetchServices();
  }, []);
  const showDrawer = () => setDrawerVisible(true);

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
  };
  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/services', values);
      if (response.status === 201) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        form.resetFields();
        setDrawerVisible(false);
        fetchServices();
      } else {
        throw new Error('Failed to create the service.');
      }
    } catch (error) {
      console.error('Error creating service:', error);
      setErrorAlert(true);
    }
  };

  const columns = [
    {
      title: 'Ref',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Designation',
      dataIndex: 'libelle',
      key: 'libelle',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantite',
      key: 'quantite',
    },
    {
      title: 'Unit Price',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
    },
    {
      title: 'Montant HT',
      dataIndex: 'montant_HT',
      key: 'montant_HT',
    },
    {
      title: 'Client Fullname',
      dataIndex: ['client', 'fullname'],
      key: 'client_fullname',
    },

    {
      title: 'TVA',
      dataIndex: ['tva', 'Pourcent_TVA'],
      key: 'tva_Pourcent_TVA',
    },
    {
      title: 'Devise',
      dataIndex: ['devise', 'Nom_D'],
      key: 'devise_Nom_D',
    },
    {
      title: 'Categories',
      dataIndex: ['categories', 'Titre_Categorie'],
      key: 'categories_Titre_Categorie',
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      key: 'actions',
      render: (_, record) => (
        <>  <Space style={{float:'left'}}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm> </Space>
        </>
      ),
    },
  ];

  const handleEdit = (record) => {
    // Logic for editing
    console.log('Editing service:', record);
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/services/${serviceId}`);
      if (response.status === 200) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        fetchServices();
      } else {
        throw new Error('Failed to delete the service.');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setErrorAlert(true);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ float: 'right' ,backgroundColor:'#022452' }}>
        New service
      </Button>

      <Drawer
        title="Create a new service"
        width={720}
        onClose={onCloseDrawer}
        visible={drawerVisible}
        extra={
          <Space>
            <Button onClick={onCloseDrawer}>Cancel</Button>
            <Button  style={{ backgroundColor:'#022452'}} type="primary" onClick={() => form.submit()}>Submit</Button>
          </Space>
        }
      >
        {successAlert && <Alert message="Success" description="Service created successfully." type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="Failed to create the service. Please try again later." type="error" showIcon />}
        
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="libelle"
                label="Designation"
                rules={[{ required: true, message: 'Please input the designation!' }]}
              >
                <Input placeholder="Enter the designation" />
              </Form.Item>
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="quantite"
                label="Quantity"
                rules={[{ required: true, message: 'Please input the quantity!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter the quantity" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="prix_unitaire"
                label="Unit Price"
                rules={[{ required: true, message: 'Please input the unit price!' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="Enter the unit price" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="clientId"
                label="Client"
                rules={[{ required: true, message: 'Please select a client!' }]}
              >
                <Select placeholder="Select a client">
                  {clients.map(client => (
                    <Option key={client._id} value={client._id}>{client.fullname}</Option>
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
                <Select placeholder="Select a TVA">
                  {tvaList.map(tva => (
                    <Option key={tva._id} value={tva._id}>{tva.Pourcent_TVA}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoriesId"
                label="Categories"
                rules={[{ required: true, message: 'Please select a Categories' }]}
              >
                <Select placeholder="Select a Categories">
                  {categories.map(categories => (
                    <Option key={categories._id} value={categories._id}>{categories.Titre_Categorie}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deviseId"
                label="Devise"
                rules={[{ required: true, message: 'Please select a Devise' }]}
              >
                <Select placeholder="Select a Devise">
                  {devise.map(devise => (
                    <Option key={devise._id} value={devise._id}>{devise.Nom_D}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>

      <Table
        style={{ marginTop: '80px' }}
        columns={columns}
        dataSource={services}
        loading={loading}
    
      />
    </>
  );
};

export default ServiceList;
