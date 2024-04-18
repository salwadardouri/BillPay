import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Table, message,Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const Categories = () => {
    const [open, setOpen] = useState(false);
    const [activeTabKey2, setActiveTabKey2] = useState('Create');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [CategoryData, setCategoryData] = useState([]);//État pour stocker les données de categorie
    const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch('http://localhost:5000/categories');
          if (response.ok) {
            const data = await response.json();
            setCategoryData(data);
          } else {
            console.error('Failed to fetch data');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    
      const handleEdit = (record) => {
        // Mettez ici la logique pour éditer un enregistrement
        console.log('Editing Financier:', record);
      };
    
      const handleDelete = async (record) => {
        // Mettez ici la logique pour supprimer un enregistrement
        console.log('Deleting Financier:', record);
      };
      const CreateCategory = async (values) => {
        try {
          const {Titre_Categorie,Description_Categorie} = values;
    
          const postData = {
            Titre_Categorie,
            Description_Categorie
          };
    
          const response = await fetch('http://localhost:5000/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
          });
    
          if (response.ok) {
            console.log('Form submitted successfully');
            const responseData = await response.json();
            console.log('API Response:', responseData);
            message.success('Parametre created successfully'); // Affiche une alerte de succès
            form.resetFields(); // Réinitialise le formulaire
            // Rafraîchir les données après la soumission réussie
            
            fetchData();
          } else {
            console.error('Failed to submit form');
            message.error('Category already exists, please enter another '); // Affiche une alerte d'erreur
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          message.error('Failed to create Category'); // Affiche une alerte d'erreur
        } finally {
          onClose();
        }
      };
    
      const onTab2Change = (key) => {
        setActiveTabKey2(key);
      };
    
      const showDrawer = () => {
        setOpen(true);
      };
    
      const onClose = () => {
        setOpen(false);
      };
    
      const tabListNoTitle = [
        {
          key: 'Create',
          tab: (
            <Button type="primary">
              Create
            </Button>
          ),
        },
      ];
      const contentListNoTitle = {
        Create: (
          <Form
            name="Create Category"
            layout="vertical"
            form={form}
            onFinish={CreateCategory}
            scrollToFirstError
          >
            <Row gutter={16}>
            <Col span={12}>
      <Form.Item
        name="Titre_Categorie"
        label="Title of Category"
        rules={[
          {
            required: true,
            message: 'Please enter the Category.', // Corrected the grammar
            // Removed the type: 'string' check because it's unnecessary for text inputs
          },
        ]}
      >
        <Input placeholder="Please enter Category" />
      </Form.Item>
      <Form.Item
        name="Description_Categorie"
        label="Description_Categorie"
        rules={[
          {
            required: true,
            message: 'Please enter the  Description_Categorie.', // Corrected the grammar
            // Removed the type: 'string' check because it's unnecessary for text inputs
          },
        ]}
      >
        <Input placeholder="Please enter Description_Categorie" />
      </Form.Item>
    </Col>
    </Row>
    </Form>
    ),
  };
    return (
        <>
        <Button type="primary" style={{ float: 'right' }} onClick={showDrawer} icon={<PlusOutlined />}>
          Create
        </Button>
        <Drawer
          title="Create a new financial account"
          width={720}
          onClose={onClose}
          visible={open}
          bodyStyle={{ paddingBottom: 80 }}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey2}
          onTabChange={onTab2Change}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={() => form.submit()} type="primary">Create</Button>
        
            </Space>
          }
        >
          {contentListNoTitle[activeTabKey2]}
        </Drawer>
        <div style={{ marginTop: '100px' }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table
            columns={[
              { title: 'Titre_Categorie', dataIndex: 'Titre_Categorie', key: 'Titre_Categorie' },
              { title: 'Description_Categorie', dataIndex: 'Description_Categorie', key: 'Description_Categorie' },
            {
                title: 'Actions',
                render: (_, record) => (
                  <>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                      title="Are you sure to delete this user?"
                      onConfirm={() => handleDelete(record)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </>
                ),
              },
            ]}
            dataSource={CategoryData.map(item => ({ ...item, key: item._id }))}
            />
          )}
        </div>
      </>
    );
  };
export default Categories;
