import React, { useState, useEffect } from 'react';
import { Button, Drawer, Form, Input, Row, Col, Space, Alert, Select, InputNumber,message, Table, Popconfirm} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const { Option } = Select;

const ServiceList = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [searchText, setSearchText] = useState(''); 

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);  
  const [devise, setDevise] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editRecord, setEditRecord] = useState(null);

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
  useEffect(() => {
    fetchDevise();
    fetchCategories();

    fetchServices();
  }, []);

  const showDrawer = () => setDrawerVisible(true);

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
    setEditRecord(null); 
  };

  const createRecord= async (values) => {
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

    deviseId: record.devise?._id,
 
    categoriesId: record.categories?._id,
    libelle: record.libelle,
    reference: record.reference,
    prix_unitaire: record.prix_unitaire,

  });



  setDrawerVisible(true); 
};
const updateRecord = async (values) => {
  try {
    const response = await axios.put(`http://localhost:5000/services/${editRecord._id}`, values); // Utilisez l'ID de `editRecord`
    if (response.status === 200) {
      message.success('Service updated successfully');
      fetchServices(); // Rafraîchissez la liste des services
      onCloseDrawer(); // Fermez le Drawer
    } else {
      throw new Error('Failed to update service');
    }
  } catch (error) {
    message.error('Failed to update service');
    console.error('Error updating service:', error);
  }
};
const onSearch = debounce(async (query) => {
  setLoading(true);
  try {
    if (query.trim() === '') {
      // Si le champ de recherche est vide, rechargez toutes les catégories
      fetchServices();
      fetchCategories();
      fetchDevise();
    } else {
      // Recherche des catégories avec la clé de recherche
      const response = await axios.post(`http://localhost:5000/services/search?key=${query}`);
      setDevise(response.data);
      setCategories(response.data);
      setServices(response.data); // Met à jour les données de la table avec les résultats de recherche
    }
  } catch (error) {
    message.error('Error during search');
  } finally {
    setLoading(false);
  }
}, 300); // Debouncing de 300 ms pour réduire les appels API


  const columns = [
    {
      title: 'Ref',
      dataIndex: 'reference',
      key: 'reference',
    },
    // {
    //   title: 'Category & Designation',
    //   key: 'category_and_designation',
    //   render: (record) => (
    //     <div>
    //       <span>{record.categories.Titre_Categorie}</span>
    //       <br />
    //       <span style={{ color: 'gray' }}>{record.libelle}</span>
    //     </div>
    //   ),
    // },
    {
      title: 'Categories',
      dataIndex: ['categories', 'Titre_Categorie'],
      key: 'categories_Titre_Categorie',
    },
    {
      title: 'Designation',
      dataIndex: 'libelle',
      key: 'libelle',
    },
 

    {
      title: 'Unit Price',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
    },
    {
      title: 'Devise',
      dataIndex: ['devise', 'Symbole'],
      key: 'devise_Symbole',
  
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
      const response = await fetch(`http://localhost:5000/services/${record._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        message.success('Data deleted successfully');
        fetchServices();
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
        New service
      </Button>
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

      <Drawer
        title={editRecord ? 'Edit service' : 'Create a new service'} 
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

        <Col span={12} style={{ marginBottom: '16px' }}>      
       <Form.Item
  name="reference"
  label="Reference"
  // Vous pouvez ajouter d'autres règles de validation au besoin
  rules={[
    { 
      required: editRecord, 
      message: 'Please input the reference!' 
    }
  ]}
  style={{ display: editRecord ? 'block' : 'none' }} // Cache le champ s'il n'est pas nécessaire
>
  <Input placeholder="Enter the reference" />
</Form.Item>

        </Col>
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
              name="prix_unitaire"
              label="Unit Price"
              rules={[{ required: true, message: 'Please input the unit price!' }]}>
                <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter the unit price"
           
             
                     />
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
