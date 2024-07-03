import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal,Badge,Select, Checkbox, message, Space, Row, Col } from 'antd';
import { EditOutlined, StopOutlined,CheckOutlined} from '@ant-design/icons';
import axios from 'axios';

import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const { Option } = Select;
const DeviseParam = () => {
  const [open, setOpen] = useState(false);
  const [deviseData, setDeviseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState(''); 
  const [deviseStatusFilter, setDeviseStatusFilter] = useState('all');
  const [status, setStatus] = useState(null);
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setStatus(value === 'true');
  };
  const handleDeviseStatusChange = (value) => {
    setDeviseStatusFilter(value);
};
useEffect(() => {
  if (editRecord) {
    setStatus(editRecord.status);
  }
}, [editRecord]);

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
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Badge
        status={status ? "success" : "error"}
        text={status ? "Actif" : "Inactif"}
  
        icon={status ? <CheckOutlined /> : <StopOutlined />}
      />
      ),
       sorter: (a, b) => a.status - b.status, 

    },
    { title: 'Devise', dataIndex: 'Nom_D', key: 'Nom_D' },
    { title: 'Symbole', dataIndex: 'Symbole', key: 'Symbole' },
    {
      title: 'Actions',
      width: 50,
        align: 'left',
      render: (_, record) => (
        <Space style={{ float: 'left' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {/* <Popconfirm
            title="Are you sure to delete this devise?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm> */}
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
       Nouvelle devise
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
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleDeviseStatusChange}>
                            <Option value="all">Tous les statuts</Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
                        </Select>
        <Table
          columns={columnsDevise}
     
          dataSource={
            deviseStatusFilter === 'all' ? deviseData: deviseData.filter(deviseData =>deviseData.status === (deviseStatusFilter === 'activated'))
        }
    
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '60px' }}
        />
      </div>

      <Modal
        title={editRecord ? "Modifier Devise" : "Créer Devise"}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }} onFinish={handleFormSubmit}>
        {editRecord && (
  <Row>
    <Col span={24}>
      <Form.Item
        name="status"
        label="Statut"
        rules={[{ required: true, message: 'Veuillez cocher le statut!' }]}
        initialValue={false}
      >
        <Row>
          <Col span={12}>
            <Checkbox
              checked={status === true}
              onChange={handleCheckboxChange}
              style={{ color: status ? 'green' : 'red' }}
              value={true}
            >
              Activé
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              checked={status === false}
              onChange={handleCheckboxChange}
              style={{ color: status ? 'red' : 'green' }}
              value={false}
            >
              Désactivé
            </Checkbox>
          </Col>
        </Row>
      </Form.Item>
    </Col>
  </Row>
)} 
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Nom_D"
                rules={[
                  { required: true, message: 'Veuillez entrer le nom de la devise ! .' },
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
                  { required: true, message: 'Veuillez entrer la description du symbole' },
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
