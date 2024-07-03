import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal,Select, Badge,Tooltip,  message, Space, Row, Checkbox,Col } from 'antd';
import { EditOutlined,StopOutlined,CheckOutlined} from '@ant-design/icons';
import axios from 'axios';

import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const { Option } = Select;
const Categories = () => {
  const [open, setOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState(''); 
  const [categoriesStatusFilter, setCategoriesStatusFilter] = useState('all');
  const [status, setStatus] = useState(null);
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setStatus(value === 'true');
  };
  const handleCategoriesStatusChange = (value) => {
    setCategoriesStatusFilter(value);
};
useEffect(() => {
  if (!open) {
    form.resetFields();
  }
}, [open, form]);
  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/categories');
      if (response.status === 200) {
        setCategoryData(response.data);
      } else {
        console.error('Failed to fetch category data');
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
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
      await updateCategory(values);
    } else {
      await createCategory(values);
    }
  };
  useEffect(() => {
    if (editRecord) {
      setStatus(editRecord.status);
    }
  }, [editRecord]);

  const createCategory = async (values) => {
    values.status = true;
    try {
      const response = await axios.post('http://localhost:5000/categories', values);
      if (response.status === 201) {
        message.success('Catégorie créée avec succès');
        setOpen(false);
        fetchCategory();
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      message.error('Échec de la création de la catégorie');
      console.error('Error creating category:', error);
    }
  };

  const updateCategory = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/categories/${editRecord._id}`, values);
      if (response.status === 200) {
        message.success('Catégorie mise à jour avec succès');
        setOpen(false);
        fetchCategory();
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      message.error('Échec de la mise à jour de la catégorie');
      console.error('Error updating category:', error);
    }
  };

  // const handleDelete = async (record) => {
  //   try {
  //     const response = await axios.delete(`http://localhost:5000/categories/${record._id}`);
  //     if (response.status === 200) {
  //       message.success('Category deleted successfully');
  //       fetchCategory();
  //     } else {
  //       throw new Error('Failed to delete category');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //     message.error('Failed to delete category');
  //   }
  // };

  const onSearch = debounce(async (query) => {
    setLoading(true);
    try {
      if (query.trim() === '') {
        // Si le champ de recherche est vide, rechargez toutes les catégories
        fetchCategory();
      } else {
        // Recherche des catégories avec la clé de recherche
        const response = await axios.post(`http://localhost:5000/categories/search?key=${query}`);
        setCategoryData(response.data); // Met à jour les données de la table avec les résultats de recherche
      }
    } catch (error) {
      message.error('Error during search');
    } finally {
      setLoading(false);
    }
  }, 300); // Debouncing de 300 ms pour réduire les appels API

  const columnsCategory = [
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Badge
        status={status ? "success" : "error"}
        text={status ? "Actif" : "Inactif"}
  
        icon={status ? <CheckOutlined /> : <StopOutlined />}
      />
      ),
       sorter: (a, b) => a.status - b.status, 

    },
    { title: 'Titre', dataIndex: 'Titre_Categorie', key: 'Titre_Categorie'  , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Description', dataIndex: 'Description_Categorie', key: 'Description_Categorie' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    {
      title: 'Actions',
      width: 110,
        align: 'left',
      render: (_, record) => (
        <Space style={{ float: 'left' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          {/* <Popconfirm
            title="Are you sure to delete this category?"
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
          Nouvelle catégorie
        </Button>      </div>
        <Search
        placeholder="Recherche "
        value={searchText}
        onChange={(e) => {
          const text = e.target.value;
          setSearchText(text);
          onSearch(text);
        }}
        style={{ maxWidth: 780, marginBottom: 20 }}
      />

      <div style={{ clear: 'both' ,marginTop:"30px"}}>
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleCategoriesStatusChange}>
                            <Option value="all">Tous les statuts</Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
                        </Select>
        <Table
          columns={columnsCategory}
          dataSource={
            categoriesStatusFilter === 'all' ? categoryData: categoryData.filter(categoryData =>categoryData.status === (categoriesStatusFilter === 'activated'))
        }
    
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '10px' }}
        />
      </div>

      <Modal
        title={editRecord ? " Modifier Categorie" : "Créer une nouvelle catégorie"}
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
        rules={[{ required: true, message: 'Please select the status!' }]}
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

          <Row gutter={18}>
            <Col span={18}>
              <Form.Item
                name="Titre_Categorie"
                rules={[
                  { required: true, message: 'Veuillez entrer l titre de la catégorie..' },
                ]}
              >
                <Input name="Titre_Categorie" placeholder="Titre"    style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item
                name="Description_Categorie"
                rules={[
                  { required: true, message: 'Veuillez entrer la description de la catégorie..' },
                ]}
              >
                  <Input.TextArea name="Description_Categorie" placeholder="Description"    style={{ width: '100%' , height:'100px'}}/>
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

export default Categories;
