import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal, Tooltip,Popconfirm,  message, Space, Row,Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;

const Categories = () => {
  const [open, setOpen] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState(''); 


  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/categories');
      if (response.status === 200) {
        // Filtrer les catégories ayant le statut true
        const filteredCategories = response.data.filter(category => category.status === true);
        setCategoryData(filteredCategories);
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

  const createCategory = async (values) => {
    values.status = true;
    try {
      const response = await axios.post('http://localhost:5000/categories', values);
      if (response.status === 201) {
        message.success('Category created successfully');
        setOpen(false);
        fetchCategory();
      } else {
        throw new Error('Failed to create category');
      }
    } catch (error) {
      message.error('Failed to create category');
      console.error('Error creating category:', error);
    }
  };

  const updateCategory = async (values) => {
    values.status = true;
    try {
      const response = await axios.put(`http://localhost:5000/categories/${editRecord._id}`, values);
      if (response.status === 200) {
        message.success('Category updated successfully');
        setOpen(false);
        fetchCategory();
      } else {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      message.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await axios.delete(`http://localhost:5000/categories/${record._id}`);
      if (response.status === 200) {
        message.success('Category deleted successfully');
        fetchCategory();
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      message.error('Failed to delete category');
    }
  };

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
 
    { title: 'Titre_Categorie', dataIndex: 'Titre_Categorie', key: 'Titre_Categorie'  , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Description_Categorie', dataIndex: 'Description_Categorie', key: 'Description_Categorie' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space style={{ float: 'left' }}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this category?"
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
  const handleCloseModal = () => {
    form.resetFields(); // Réinitialiser les champs du formulaire
    setOpen(false); // Fermer le modèle
  };
  
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
          columns={columnsCategory}
          dataSource={categoryData}
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '60px' }}
        />
      </div>

      <Modal
        title={editRecord ? "Edit Category" : "Create New Category"}
        visible={open}
    
        footer={null}
        onCancel={handleCloseModal}
      >
        <Form form={form} layout="vertical" style={{ marginTop: '20px' }} onFinish={handleFormSubmit}>
      

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="Titre_Categorie"
                rules={[
                  { required: true, message: 'Please enter the category title.' },
                ]}
              >
                <Input name="Titre_Categorie" placeholder="Category title" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '450px', borderBottom: '0.5px solid grey' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                name="Description_Categorie"
                rules={[
                  { required: true, message: 'Please enter the category description.' },
                ]}
              >
                <Input name="Description_Categorie" placeholder="Category description" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '450px', borderBottom: '0.5px solid grey' }} />
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

export default Categories;