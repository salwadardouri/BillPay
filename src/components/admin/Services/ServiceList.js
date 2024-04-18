import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Space, Alert, Select, InputNumber, Table, Popconfirm , message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const ServiceList = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/clients')
      .then(response => response.json())
      .then(data => {
        setClients(data);
      })
      .catch(error => {
        console.error('Error fetching clients:', error);
      });
  }, []);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const onFinish = (values) => {
    const postData = {
      ...values,
      clientId: selectedClientId,
    };

    fetch('http://localhost:5000/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    .then(response => response.ok ? response.json() : Promise.reject('Failed to create account.'))
    .then(data => {
      setSuccessAlert(true);
      setTimeout(() => setSuccessAlert(false), 3000);
    })
    .catch(error => {
      console.error('Error:', error);
      setErrorAlert(true);
    });
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ float: 'right' }}>
        New service
      </Button>
      <Drawer
        title="Create a new account"
        width={720}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={() => form.submit()} type="primary">Submit</Button>
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
                rules={[
                  { required: true, message: 'Please input your Designation! ' },
                ]}
              >
  <Input placeholder="Please input your Designation!" />
              </Form.Item>
            </Col>
      
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="quantite"
                label="Quantity"
                rules={[{ required: true, message: 'Please input your quantite!' }]}
              >
          
                <Input placeholder="Please input your Quantity!"  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            </Row>
            <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="prix_unitaire"
                label="Unit Price"
                rules={[{ required: true, message: 'Please input your prix unitaire!' }]}
              >
                
                <InputNumber style={{ width: '100%' }} placeholder="Please input your Unit Price!" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="clientId"
                label="Client"
                rules={[{ required: true, message: 'Please select a client!' }]}
              >
                <Select placeholder="Select a client" onChange={value => setSelectedClientId(value)}>
                  {clients.map(client => (
                    <Option key={client._id} value={client._id}>{client.email}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      <ServicesListe />
    </>
  );
};

const ServicesListe = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchClients();
  }, []);

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

  const handleEdit = (record) => {
    setEditingService(record);
    setDrawerVisible(true);
  };

  const handleDelete = async (record) => {
    // Mettez ici la logique pour supprimer un service
    console.log('Deleting service:', record);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingService(null);
    form.resetFields();   
  };

  const onFinish = async (formData) => {
    try {
      // Mettez ici la logique pour mettre à jour un service
      console.log('Form data:', formData);
      onCloseDrawer();
    } catch (error) {
      console.error('Error updating service:', error);
      message.error('An error occurred while updating service');
    }
  };

  const columns = [
    {
      title: 'Ref',
      dataIndex: 'reference',
    },
    {
      title: 'Designation',
      dataIndex: 'libelle',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantite',
    },
    {
      title: 'Unit Price',
      dataIndex: 'prix_unitaire',
    },
    {
      title: 'Montant HT',
      dataIndex: 'montant_HT',
    },
    {
      title: 'Client Fullname',
      dataIndex: 'client',
      render: (client) => (
        <span>{client ? `${client.fullname} ` : 'N/A'}</span>
      ),
    },
    {
      title: 'Client Email',
      dataIndex: 'client',
      render: (client) => (
        <span>{client ? ` ${client.email}` : 'N/A'}</span>
      ),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table style={{ marginTop: '100px' }} columns={columns} dataSource={services} loading={loading} />

      <Drawer
        title="Edit Service"
        placement="right"
        width={720}
        closable={false}
        onClose={onCloseDrawer}
        visible={drawerVisible}
      >
        <Form form={form} onFinish={onFinish} initialValues={editingService}>
          <Row gutter={16}>
            
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="libelle"
                label="libelle"
                rules={[
                  { required: true, message: 'Please input your libelle! ' },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="quantite"
                label="quantite"
                rules={[{ required: true, message: 'Please input your quantite!' }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} style={{ marginBottom: '16px' }}>
              <Form.Item
                name="prix_unitaire"
                label="prix_unitaire"
                rules={[{ required: true, message: 'Please input your prix_unitaire!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
    
            <Col span={12} style={{ marginBottom: '16px' }}>
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
          </Row>
          <Row>
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default ServiceList;
