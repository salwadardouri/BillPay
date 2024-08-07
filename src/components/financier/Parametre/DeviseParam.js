import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal,  message, Space, Row,Popconfirm, Col } from 'antd';
import { EditOutlined, } from '@ant-design/icons';
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
        const filteredDevise = response.data.filter(devise => devise.status === true);
        setDeviseData(filteredDevise);
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
    values.status = true;
    try {
      const response = await axios.post('http://localhost:5000/devise', values);
      if (response.status === 201) {
        message.success('Devise créée avec succès');
        setOpen(false);
        fetchDevise();
      } else {
        throw new Error('Failed to create devise');
      }
    } catch (error) {
      message.error('Échec de la création de la devise');
      console.error('Error creating devise:', error);
    }
  };

  const updateDevise = async (values) => {
    values.status = true;
    try {
      const response = await axios.put(`http://localhost:5000/devise/${editRecord._id}`, values);
      if (response.status === 200) {
        message.success('Devise mise à jour avec succès');
        setOpen(false);
        fetchDevise();
      } else {
        throw new Error('Failed to update devise');
      }
    } catch (error) {
      message.error('Échec de la mise à jour de la devise');
      console.error('Error updating devise:', error);
    }
  };

  // const handleDelete = async (record) => {
  //   try {
  //     const response = await axios.delete(`http://localhost:5000/devise/${record._id}`);
  //     if (response.status === 200) {
  //       message.success('Devise deleted successfully');
  //       fetchDevise();
  //     } else {
  //       throw new Error('Failed to delete devise');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting devise:', error);
  //     message.error('Failed to delete devise');
  //   }
  // };

  const handleDelete = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/devise/activated/${record._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // Ajoutez l'en-tête Content-Type
        },
        body: JSON.stringify({ status: false }) // Définissez le corps de la requête avec le statut false
      });
      if (response.ok) {
        message.success('Données désactivées avec succès');
        fetchDevise();
      } else {
        throw new Error('Failed to deactivate data');
      }
    } catch (error) {
      console.error('Error deactivating  data:', error);
      message.error('Échec de la désactivation des données');
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
      message.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, 300); // Debouncing de 300 ms pour réduire les appels API

  const columnsDevise = [
    { title: 'Devise', dataIndex: 'Nom_D', key: 'Nom_D' },
    { title: 'Symbole', dataIndex: 'Symbole', key: 'Symbole' },
    {
      title: 'Actions',
      width: 50,
        align: 'left',
      render: (_, record) => (
        <Space style={{ float: 'left' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
              title="Êtes-vous sûr de vouloir désactiver cette devise ?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger >Désactiver</Button>
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
          Ajouter une devise
        </Button>      </div>
        <Search
        placeholder="Recherche"
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
        title={editRecord ? "Modifier Devise" : "Créer une nouvelle devise"}
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
                  { required: true, message: 'Veuillez entrer le titre de la devise.' },
                ]}
              >
                <Input name="Nom_D" placeholder="Devise"    style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="Symbole"
                rules={[
                  { required: true, message: 'Veuillez saisir le symbole.' },
                ]}
              >
                <Input name="Symbole" placeholder="Symbole"    style={{ width: '100%' }}/>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              style={{ width: '100px', marginTop: '20px', backgroundColor: '#022452' }}
              htmlType="submit"
            >
              {editRecord ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeviseParam;
