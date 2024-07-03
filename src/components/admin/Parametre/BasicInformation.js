import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Input, Col,Select, Row, Checkbox,message, Modal, Tooltip, Space,Badge } from 'antd';
import { EditOutlined,  UserAddOutlined,StopOutlined,CheckOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import { components } from 'react-select';
import ReactSelect from 'react-select';
import { debounce } from 'lodash';//pour search pro 
import axios from 'axios';
const { Option } = Select;
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
  // eslint-disable-next-line
  const [filterMode, setFilterMode] = useState('menu'); 
  const [parametreStatusFilter, setParametreStatusFilter] = useState('all');
  const [status, setStatus] = useState(null);
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setStatus(value === 'true');
  };
  const handleParametreStatusChange = (value) => {
    setParametreStatusFilter(value);
};
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/parametre');
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // const handleDelete = async (record) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/parametre/${record._id}`, {
  //       method: 'DELETE',
  //     });
  //     if (response.ok) {
  //       message.success('Data deleted successfully');
  //       fetchData();
  //     } else {
  //       throw new Error('Failed to delete data');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting data:', error);
  //     message.error('Failed to delete data');
  //   }
  // };

  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateBasicInformation(values);
    } else {
      await createBasicInformation(values);
    }
  };

  useEffect(() => {
    if (editRecord) {
      setStatus(editRecord.status);
    }
  }, [editRecord]);

  const updateBasicInformation = async (values) => {
    try {
      const { Nom_S, Email_S, Address_S, Code_Postal_S, Matricule_Fiscale_S, Num_Phone_S,status } = values;
  
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
        status,
        Code_Postal_S,
        Matricule_Fiscale_S,
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
        message.success('Données mises à jour avec succès');
         form.resetFields();
        setOpen(false);
        fetchData(); // Recharger les données
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      message.error('Échec de la mise à jour des données');
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
        status:true,
        Matricule_Fiscale_S,
        Num_Phone_S: formattedPhoneNumber,
      };
  
      const response = await fetch('http://localhost:5000/parametre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (response.status === 201) {
        message.success('Informations de base créées avec succès');
        form.resetFields();
        setOpen(false);
        fetchData();
      } else {
        throw new Error('Failed to create Basic Information');
      }
    } catch (error) {
      console.error('Error creating Basic Information:', error);
      message.error('Échec de la création des informations de base');
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
      message.error('Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, 300); // Debouncing de 300 ms pour réduire les appels API

  
  const columnsVisto = [
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
    { title: 'Nom', dataIndex: 'Nom_S', key: 'Nom_S' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Email', dataIndex: 'Email_S', key: 'Email_S', ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    { title: 'Pays', dataIndex: 'Paye_S', key: 'Paye_S' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Adresse', dataIndex: 'Address_S', key: 'Address_S' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Numéro de téléphone ', dataIndex: 'Num_Phone_S', key: 'Num_Phone_S', ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip> },
    { title: 'Code postal', dataIndex: 'Code_Postal_S', key: 'Code_Postal_S' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    { title: 'Matricule fiscale', dataIndex: 'Matricule_Fiscale_S', key: 'Matricule_Fiscale_S' , ellipsis: true,
    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>},
    {
      title: 'Actions',
 

      render: (_, record) => (
        <>
          <Space style={{ float: 'left' }}>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
            {/* <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm> */}
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
        placeholder="Recherche "
        value={searchText}
        onChange={(e) => {
          const text = e.target.value;
          setSearchText(text);
          onSearch(text);
        }}
        style={{ maxWidth: 780, marginBottom: 20 }}
      />
      <div style={{ clear: 'both',marginTop:"30px" }}>
      <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleParametreStatusChange}>
                            <Option value="all">Tous les statuts </Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
                        </Select>
        <Table
          columns={columnsVisto}

          dataSource={
            parametreStatusFilter === 'all' ? data : data.filter(data => data.status === (parametreStatusFilter === 'activated'))
        }
          loading={loading}
          pagination={{ pageSize: 12 }}
          style={{ clear: 'both', marginTop: '10px' }}
        />
      </div>
      
      <Modal
       title={editRecord ? "Modifier paramètre d'entreprise" : "Créer paramètre d'entreprise "}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleFormSubmit}>
          <>
          {editRecord && (
  <Row>
    <Col span={24}>
      <Form.Item
        name="status"
        label="Statut"
        rules={[{ required: true, message: 'Veuillez sélectionner le statut!' }]}
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
                  name="Nom_S"
                  rules={[
                    {
                      required: true,
                      message: 'Veuillez saisirle nom de l entreprise ',
                    },
                  ]}
                >
                  <Input name="Nom_S" placeholder="Nom de l'entreprise " style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Email_S"
                  rules={[
                    { type: 'email', message: 'E-mail invalide!' },
                    { required: true, message: 'Veuillez saisir votre adresse e-mail !' },
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
                  rules={[{ required: true, message: 'Veuillez saisir votre numéro de téléphone !' }]}
                >
                  <PhoneInput
                    country={'us'}
                    name="Num_Phone_S"
                    value={phoneNumber}
                    onChange={handleChangePhoneNumber}
                    inputStyle={{ border: 'none', boxShadow: 'none' }}
                    placeholder="Numéro de téléphone"
                    buttonStyle={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}
                  />
                </Form.Item>
                {!validPhoneNumber && (
                  <p>Veuillez saisir un numéro de téléphone valide ! .</p>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Paye_S"
                  rules={[{ required: true, message: 'Veuillez sélectionner votre pays!' }]}
                  style={{ border: 'none', borderBottom: '0.5px solid grey' }}
                >
                  <ReactSelect
                    options={countryOptions}
                    components={{ Option: CountryOption }}
                    name="Paye_S"
                    placeholder='Pays'
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
                      message: 'Veuillez saisir l adresse !.',
                    },
                  ]}
                >
                  <Input name="Address_S" placeholder="Adresse" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="Code_Postal_S"
                  rules={[
                    {
                      required: true,
                      message: 'Veuillez saisir le code postal !.',
                    },
                  ]}
                >
                  <Input placeholder="Code Postal." style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
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
                      message: 'Veuillez saisir le numéro d identification fiscale!.',
                    },
                  ]}
                >
                  <Input name="Matricule_Fiscale_S" placeholder="Matricule Fiscal." style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '16px', padding: '10px', height: '40px', width: '100%', borderBottom: '0.5px solid grey' }} />
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
              {editRecord ? 'Modifier' : 'Créer'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BasicInformation;
