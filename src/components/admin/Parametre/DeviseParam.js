import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal, Popconfirm, message, Space, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const DeviseParam = () => {
  const [open, setOpen] = useState(false);
  const [deviseData, setDeviseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState(''); 

  useEffect(() => {
    fetchDevise();
  }, []);

  const fetchDevise = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/devise');
      if (response.status === 200) {
        setDeviseData(response.data);
      } else {
        console.error('Failed to fetch devise data');
      }
    } catch (error) {
      console.error('Error fetching devise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setOpen(true);
    form.setFieldsValue(record);
  };

  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateDevise(values);
    } else {
      await createDevise(values);
    }
  };

  const createDevise= async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/devise', values);
      if (response.status === 201) {
        message.success('Devise created successfully');
        setOpen(false);
        fetchDevise();
      } else {
        throw new Error('Failed to create devise');
      }
    } catch (error) {
      message.error('Failed to create devise');
      console.error('Error creating devise:', error);
    }
  };

  const updateDevise = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/devise/${editRecord._id}`, values);
      if (response.status === 200) {
        message.success('Devise updated successfully');
        setOpen(false);
        fetchDevise();
      } else {
        throw new Error('Failed to update devise');
      }
    } catch (error) {
      message.error('Failed to update devise');
      console.error('Error updating devise:', error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(`http://localhost:5000/devise/${record._id}`);
      if (response.status === 200) {
        message.success('Devise deleted successfully');
        fetchDevise();
      } else {
        throw new Error('Failed to delete devise');
      }
    } catch (error) {
      console.error('Error deleting devise:', error);
      message.error('Failed to delete devise');
    }
  };

  const onSearch = debounce(async (query) => {
    setLoading(true);
    try {
      if (query.trim() === '') {
        // Si le champ de recherche est vide, rechargez toutes les catégories
        fetchDevise();
      } else {
        // Recherche des catégories avec la clé de recherche
        const response = await axios.post(`http://localhost:5000/devise/search?key=${query}`);
        setDeviseData(response.data);
      }
    } catch (error) {
      message.error('Error during search');
    } finally {
      setLoading(false);
    }
  }, 300); // Debouncing de 300 ms pour réduire les appels API

  const columnsDevise = [
    { title: 'Nom_D', dataIndex: 'Nom_D', key: 'Nom_D' },
    { title: 'Symbole', dataIndex: 'Symbole', key: 'Symbole' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space style={{ float: 'left' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this devise?"
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
    <>
      <div style={{ marginBottom: 16, float: 'right' }}>
        <Button
          type="primary"
          style={{ backgroundColor: '#022452' }}
          onClick={() => setOpen(true)}
        >
          New Collection
        </Button>      </div>
        <Search
        placeholder="Search "
        value={searchText}
        onChange={(e) => {
          const text = e.target.value;
          setSearchText(text);
          onSearch(text);
        }}
        style={{ maxWidth: 780, marginBottom: 20 }}
      />

      <div style={{ clear: 'both' }}>
        <Table
          columns={columnsDevise}
          dataSource={deviseData}
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '60px' }}
        />
      </div>

      <Modal
        title={editRecord ? "Edit Devise" : "Create New Devise"}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }} onFinish={handleFormSubmit}>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Nom_D"
                rules={[
                  { required: true, message: 'Please enter the devise title.' },
                ]}
              >
                <Input name="Nom_D" placeholder="Nom_D" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '450px', borderBottom: '0.5px solid grey' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="Symbole"
                rules={[
                  { required: true, message: 'Please enter the symbole description.' },
                ]}
              >
                <Input name="Symbole" placeholder="Symbole" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '450px', borderBottom: '0.5px solid grey' }} />
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
    </>
  );
};

export default DeviseParam;
