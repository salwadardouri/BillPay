import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Row, Col,Checkbox, Modal,Space, Alert,Tooltip, 
  Select,Badge, InputNumber,message, Table} from 'antd';
import { PlusOutlined,  EditOutlined,StopOutlined,CheckOutlined } from '@ant-design/icons';
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
  // eslint-disable-next-line
  const [availableServices, setAvailableServices] = useState([]);
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
    if (response.status === 200) {
      const filteredServices = response.data.filter(service => service.categories);
      setAvailableServices(filteredServices);
      setServices(filteredServices);
    } else {
      console.error('Failed to fetch Services data');
    }
  } catch (error) {
    console.error('Error fetching Services data:', error);
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
    unite: record.unite,
    reference: record.reference,
    prix_unitaire: record.prix_unitaire,
    status: record.status,

  });
  setOpen(true);
};
const updateRecord = async (values) => {
  const { deviseId, categoriesId, ...restValues } = values; // Séparez deviseId et categoriesId du reste des valeurs

  const updatedValues = {
    ...restValues, // Gardez toutes les autres valeurs intactes
  };

  if (deviseId) {
    updatedValues.deviseId = deviseId; // Ajoutez deviseId si présent dans les valeurs
  }

  if (categoriesId) {
    updatedValues.categoriesId = categoriesId; // Ajoutez categoriesId si présent dans les valeurs
  }
  try {
    const response = await axios.put(`http://localhost:5000/services/${editRecord._id}`, values); // Utilisez l'ID de `editRecord`
    if (response.status === 200) {
      message.success('Service mis à jour avec succès');
      fetchServices(); // Rafraîchissez la liste des services
      setOpen(false);
    } else {
      throw new Error('Failed to update service');
    }
  } catch (error) {
    message.error('Échec de la mise à jour du service');
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
        <Badge
        status={status ? "success" : "error"}
        text={status ? "Actif" : "Inactif"}
  
        icon={status ? <CheckOutlined /> : <StopOutlined />}
      />
      ),
       sorter: (a, b) => a.status - b.status, 

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
      width: 300,
      key: 'libelle', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
 

    {
      title: 'Prix unitaire',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
  
    {
      title: 'Unité ',
      dataIndex: 'unite',
      key: 'unite', ellipsis: true,
      render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },
  
    {
      title: 'Devise',
      dataIndex: ['devise', 'Nom_D'],
      key: 'devise_Nom_D',
  
    },

 

    {
      title: 'Actions',
      width: 80,
      render: (_, record) => (
        <>
          <Space style={{ float: 'left' }}>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            
      
          </Space>
        </>
      ),
    },
  ];




  // const handleDelete = async (record) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/services/${record._id}`, {
  //       method: 'DELETE',
  //     });
  //     if (response.ok) {
  //       message.success('Data deleted successfully');
  //       fetchServices();
  //     } else {
  //       throw new Error('Failed to delete data');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting data:', error);
  //     message.error('Failed to delete data');
  //   }
  // };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} icon={<PlusOutlined />} style={{ float: 'right' ,backgroundColor:'#022452' }}>
        Nouveau service
      </Button>
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
      {successAlert && <Alert message="Success" description="Service créé avec succès" type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="Échec de la création du service. Veuillez réessayer plus tard." type="error" showIcon />}
        
      
      <Modal
        title={editRecord ? "Modifier Service" : "Créer un nouveau service"}
        visible={open}
        width={800}
        onCancel={() => setOpen(false)}
        footer={null}
      >  
             <div style={{ borderTop: '1px solid #ccc', marginTop: '10px', marginBottom: '20px' }}></div>

             <div style={{ marginBottom: '20px', color: '#022452', fontWeight: 'bold', fontSize: '1.1em', padding: '10px 0' }}>
             Important: Il faut informer dans le libellé pour quel pays ce service sera créé
</div>
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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

      <Col span={12} style={{ marginBottom: '16px' }}>      
     <Form.Item
name="reference"
label="Référence"
// Vous pouvez ajouter d'autres règles de validation au besoin
rules={[
  { 
    required: editRecord, 
    message: 'Veuillez saisir la référence!' 
  }
]}
style={{ display: editRecord ? 'block' : 'none' }} // Cache le champ s'il n'est pas nécessaire
>
<Input placeholder="Entrez la référence" />
</Form.Item>

      </Col>
      <Row gutter={[16, 16]}>
      <Col span={12} style={{ marginBottom: '16px' }}>      
            <Form.Item
              name="libelle"
              label="Designation"
              rules={[{ required: true, message: 'Veuillez saisir la désignation!' }]}
            >
              <Input placeholder="Entrez la désignation"  />
            </Form.Item>
      </Col>
      <Col span={12} style={{ marginBottom: '16px' }}>   
            <Form.Item
              name="deviseId"
              label="Devise"
              rules={[{ required: true, message: 'Veuillez sélectionner une devise' }]}
            >
              <Select placeholder="Sélectionnez une devise"
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
            label="Prix Uitaire"
            rules={[{ required: true, message: 'Veuillez saisir le prix unitaire!' }]}>
              <InputNumber
              style={{ width: '100%' }}
              placeholder="Entrez le prix unitaire"
         
           
                   />
             </Form.Item>
   </Col>

   <Col span={12} style={{ marginBottom: '16px' }}>
            <Form.Item
            name="unite"
            label="Unité"
            rules={[{ required: true, message: 'Sélectionnez l unité!' }]}>
        <Select
        placeholder="Sélectionnez l'unité"
    
         
     
          style={{ width: '100%' }}
        >
         <Option value="heure">Heure</Option>
      <Option value="jour">Jour</Option>
      <Option value="semaine">Semaine</Option>
      <Option value="mois">Mois</Option>
      <Option value="année">Année</Option>
        </Select>
        </Form.Item>
        </Col></Row>
        <Row gutter={[16, 16]}>
  <Col span={12} style={{ marginBottom: '16px' }}><Form.Item
              name="categoriesId"
              label="Categories"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select placeholder="Sélectionnez une catégorie"  >
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
            {editRecord ? 'Modifier' : 'Créer'}
          </Button>
        </Form.Item>




      </Form>
    </Modal>
      <div style={{ clear: 'both' ,marginTop:"30px"}}>
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleServicesStatusChange}>
                            <Option value="all">Tous les statuts</Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
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
