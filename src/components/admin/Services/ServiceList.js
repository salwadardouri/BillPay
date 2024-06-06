import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col,Checkbox, Modal,Space, Alert,Tooltip, Select,Badge, InputNumber,message, Table, Popconfirm} from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const { Option } = Select;

const ServiceList = () => {

  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [searchText, setSearchText] = useState(''); 
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);  
  const [devise, setDevise] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [servicesStatusFilter, setServicesStatusFilter] = useState('all');
  const [status, setStatus] = useState(null);
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setStatus(value === 'true');
  };
  const handleServicesStatusChange = (value) => {
    setServicesStatusFilter(value);
};
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
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/categories');
      if (response.status === 200) {
        // Filtrer les catégories ayant le statut true
        const filteredCategories = response.data.filter(category => category.status === true);
        setCategories(filteredCategories);
      } else {
        console.error('Failed to fetch category data');
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDevise();
    fetchCategories();
    fetchServices();
  }, []);



  const createRecord= async (values) => {
    values.status = true;
    try {
      const response = await axios.post('http://localhost:5000/services', values);
      if (response.status === 201) {
        setSuccessAlert(true);
        setTimeout(() => setSuccessAlert(false), 3000);
        form.resetFields();
        setOpen(false);
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
    status: record.status,

  });
  setOpen(true);
};
const updateRecord = async (values) => {
  try {
    const response = await axios.put(`http://localhost:5000/services/${editRecord._id}`, values); // Utilisez l'ID de `editRecord`
    if (response.status === 200) {
      message.success('Service updated successfully');
      fetchServices(); // Rafraîchissez la liste des services
      setOpen(false);
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
          <Badge dot style={{ backgroundColor: status ? 'green' : 'red' }} />
      ),
  },
    {
      title: 'Ref',
      dataIndex: 'reference',
      key: 'reference',  ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
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
      key: 'categories_Titre_Categorie', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
    {
      title: 'Designation',
      dataIndex: 'libelle',
      key: 'libelle', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
 

    {
      title: 'Unit Price',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
   
    {
      title: 'Devise',
      dataIndex: ['devise', 'Nom_D'],
      key: 'devise_Nom_D',
  
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
      <Button type="primary" onClick={() => setOpen(true)} icon={<PlusOutlined />} style={{ float: 'right' ,backgroundColor:'#022452' }}>
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
      {successAlert && <Alert message="Success" description="Service created successfully." type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="Failed to create the service. Please try again later." type="error" showIcon />}
        
      
      <Modal
        title={editRecord ? "Edit Category" : "Create New Category"}
        visible={open}
        width={800}
        onCancel={() => setOpen(false)}
        footer={null}
      >  <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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
      <div style={{ clear: 'both' ,marginTop:"30px"}}>
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleServicesStatusChange}>
                            <Option value="all">All of status</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
      <Table
        style={{ marginTop: '10px' ,clear: 'both'}}
        columns={columns}
        dataSource={
          servicesStatusFilter === 'all' ? services: services.filter(services =>services.status === (servicesStatusFilter === 'activated'))
      }
        loading={loading}
      />  </div>
    </>
  );
};

export default ServiceList;
