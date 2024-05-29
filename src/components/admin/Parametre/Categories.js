import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal,Select, Badge,Tooltip,Popconfirm,  message, Space, Row, Checkbox,Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
          <Badge dot style={{ backgroundColor: status ? 'green' : 'red' }} />
      ),
  },
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
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleCategoriesStatusChange}>
                            <Option value="all">All</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
        <Table
          columns={columnsCategory}
          dataSource={
            categoriesStatusFilter === 'all' ? categoryData: categoryData.filter(categoryData =>categoryData.status === (categoriesStatusFilter === 'activated'))
        }
    
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '60px' }}
        />
      </div>

      <Modal
        title={editRecord ? "Edit Category" : "Create New Category"}
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
        label="Status"
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
              Activated
            </Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox
              checked={status === false}
              onChange={handleCheckboxChange}
              style={{ color: status ? 'red' : 'green' }}
              value={false}
            >
              Inactivated
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
