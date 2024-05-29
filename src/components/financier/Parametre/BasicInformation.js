import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Col, Row, message, Modal, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import { components } from 'react-select';
import ReactSelect from 'react-select';
import { debounce } from 'lodash';//pour search pro 
import axios from 'axios';

const { Search } = Input;
const CountryOption = (props) => {
  return (
    <components.Option {...props}>
      <img
        alt={`Flag of ${props.data.label}`}
        src={`https://flagcdn.com/16x12/${props.data.value.toLowerCase()}.png`}
        style={{ marginRight: 10, float: 'left' }}
      />
      {props.data.label}
    </components.Option>
  );
};

const BasicInformation = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
  const [editRecord, setEditRecord] = useState(null);
  const countryOptions = countryList().getData();
  const [searchText, setSearchText] = useState(''); 
  // eslint-disable-next-line
  const [selectedCountry, setSelectedCountry] = useState(null);


  useEffect(() => {
    fetchData();

}, []);


const fetchData = async () => {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:5000/parametre');
        if (response.ok) {
            const data = await response.json();
            // Filtrer les clients avec status=true
            const paramWithTrueStatus = data.filter(parametre => parametre.status === true);
            setData(paramWithTrueStatus);
        } else {
            console.error('Failed to fetch parametre');
        }
    } catch (error) {
        console.error('Error fetching parametre:', error);
    } finally {
        setLoading(false);
    }
};
  const handleEdit = (record) => {
    setEditRecord(record);
    setOpen(true);
  
    // Obtenez la valeur du pays du record
    const country = countryOptions.find((option) => option.label === record.Paye_S);
  
    // Définissez les valeurs des champs, y compris le pays
    form.setFieldsValue({
      ...record,
      Paye_S: country, // Définit la valeur du champ du pays
    });
  };


  const handleDelete = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/parametre/activated/${record._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // Ajoutez l'en-tête Content-Type
        },
        body: JSON.stringify({ status: false }) // Définissez le corps de la requête avec le statut false
      });
      if (response.ok) {
        message.success('Data deleted successfully');
        fetchData();
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Failed to delete data');
    }
  };
  
  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateBasicInformation(values);
    } else {
      await createBasicInformation(values);
    }
  };

  const updateBasicInformation = async (values) => {
    try {
      const { Nom_S, Email_S, Address_S, Code_Postal_S, Matricule_Fiscale_S, Num_Phone_S } = values;
  
      // Récupérez la valeur du pays du formulaire
      const selectedCountry = form.getFieldValue('Paye_S');
      
      // Vérifiez si une valeur de pays est sélectionnée
      const countryLabel = selectedCountry ? selectedCountry.label : '';
  
      const formattedPhoneNumber = `${Num_Phone_S.replace(/\s/g, '')}`;
  
      const postData = {
        Nom_S,
        Email_S,
        Paye_S: countryLabel,
        Address_S,
        Code_Postal_S,
        Matricule_Fiscale_S,
        status:true,
        Num_Phone_S: formattedPhoneNumber,
      };
  
      const response = await fetch(`http://localhost:5000/parametre/${editRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.ok) {
        message.success('Data updated successfully');
         form.resetFields();
        setOpen(false);
        fetchData(); // Recharger les données
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      message.error('Failed to update data');
      console.error('Error updating data:', error);
    }
  };
  
  
  const handleChangePhoneNumber = (value) => {
    setPhoneNumber(value);
    setValidPhoneNumber(validatePhoneNumber(value));
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };


  const createBasicInformation = async (values) => {
    try {
      const { Nom_S, Email_S, Address_S, Code_Postal_S, Matricule_Fiscale_S, Num_Phone_S } = values;
  
      // Récupérer la valeur du pays sélectionné
      const selectedCountry = form.getFieldValue('Paye_S');
      
      // Vérifier si une valeur de pays est sélectionnée
      const countryValue = selectedCountry ? selectedCountry.label : '';
  
      // Formater le numéro de téléphone
      const formattedPhoneNumber = `+${Num_Phone_S.replace(/\s/g, '')}`;
  
      const postData = {
        Nom_S,
        Email_S,
        Paye_S: countryValue,
        Address_S,
        Code_Postal_S,
        Matricule_Fiscale_S,
        Num_Phone_S: formattedPhoneNumber,
        status:true,
      };
  
      const response = await fetch('http://localhost:5000/parametre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.status === 201) {
        message.success('Basic Information created successfully');
        form.resetFields();
        setOpen(false);
        fetchData();
      } else {
        throw new Error('Failed to create Basic Information');
      }
    } catch (error) {
      console.error('Error creating Basic Information:', error);
      message.error('Failed to create Basic Information');
    }
  };
  const onSearch = debounce(async (query) => {
    setLoading(true);
    try {
      if (query.trim() === '') {
        // Si le champ de recherche est vide, rechargez toutes les catégories
        fetchData();
      } else {
        // Recherche des catégories avec la clé de recherche
        const response = await axios.post(`http://localhost:5000/parametre/search?key=${query}`);
        setData(response.data); // Met à jour les données de la table avec les résultats de recherche
      }
    } catch (error) {
      message.error('Error during search');
    } finally {
      setLoading(false);
    }
  }, 300); // Debouncing de 300 ms pour réduire les appels API

  
  const columnsVisto = [
    { title: 'FullName', dataIndex: 'Nom_S', key: 'Nom_S' },
    { title: 'Email', dataIndex: 'Email_S', key: 'Email_S' },
    { title: 'Country', dataIndex: 'Paye_S', key: 'Paye_S' },
    { title: 'Address', dataIndex: 'Address_S', key: 'Address_S' },
    { title: 'Phone number', dataIndex: 'Num_Phone_S', key: 'Num_Phone_S' },
    { title: 'Postal code', dataIndex: 'Code_Postal_S', key: 'Code_Postal_S' },
    { title: 'Tax identification number', dataIndex: 'Matricule_Fiscale_S', key: 'Matricule_Fiscale_S' },
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

  return (
    <div>
      <div style={{ marginBottom: 16, float: 'right' }}>
        <Button style={{ backgroundColor: '#022452' }} type="primary" icon={<UserAddOutlined />} onClick={() => setOpen(true)}>Create</Button>
      </div>
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
          columns={columnsVisto}
          dataSource={data}
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '60px' }}
        />
      </div>
      <Modal
       title={editRecord ? "Edit Data" : "Create New data"}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Nom_S"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the full name.',
                    },
                  ]}
                >
                  <Input name="Nom_S" placeholder="Full name" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Email_S"
                  rules={[
                    { type: 'email', message: 'The input is not valid E-mail!' },
                    { required: true, message: 'Please input your E-mail!' },
                  ]}
                >
                  <Input name="Email_S" placeholder="E-mail!" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12} style={{ marginBottom: '0px' }}>
                <Form.Item
                  name="Num_Phone_S"
                  style={{ border: 'none', borderBottom: '0.5px solid grey', }}
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <PhoneInput
                    country={'us'}
                    name="Num_Phone_S"
                    value={phoneNumber}
                    onChange={handleChangePhoneNumber}
                    inputStyle={{ border: 'none', boxShadow: 'none' }}
                    placeholder="Phone number"
                    buttonStyle={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}
                  />
                </Form.Item>
                {!validPhoneNumber && (
                  <p>Please enter a valid phone number.</p>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Paye_S"
                  rules={[{ required: true, message: 'Please select your country!' }]}
                  style={{ border: 'none', borderBottom: '0.5px solid grey' }}
                >
                  <ReactSelect
                    options={countryOptions}
                    components={{ Option: CountryOption }}
                    name="Paye_S"
                    placeholder='Country'
                    isClearable={true}
                    onChange={(option) => setSelectedCountry(option)}
                    
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: 'none',
                        boxShadow: 'none',
                        fontSize: '16px',
                        color: 'grey'
                      }),
                      input: (base) => ({
                        ...base,
                        textAlign: 'left',
                        fontSize: '16px',
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        border: 'none',
                        fontSize: '16px',
                      }),
                    }}
                  />
              
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="Address_S"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the address!.',
                    },
                  ]}
                >
                  <Input name="Address_S" placeholder="Address" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Code_Postal_S"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the postal code!.',
                    },
                  ]}
                >
                  <Input placeholder="Postal code." style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name="Matricule_Fiscale_S"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the tax identification number!.',
                    },
                  ]}
                >
                  <Input name="Matricule_Fiscale_S" placeholder="Tax Identification Number ." style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
            </Row>
          </>
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
    </div>
  );
};

export default BasicInformation;
