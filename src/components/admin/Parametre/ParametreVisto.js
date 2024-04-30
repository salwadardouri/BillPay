import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, Select, Form, Input, Col, Row, message, Modal, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const { TabPane } = Tabs;
const { Option } = Select;

const ParametreVisto = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('BasicInformation');
  const [selectedOption, setSelectedOption] = useState('BasicInformation'); // Mettre à jour l'option sélectionnée
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [CategoryData, setCategoryData] = useState([]);
  const [tvaData, setTvaData] = useState([]);
  const [timbreData, setTimbreData] = useState([]);
  const [taxOption, setTaxOption] = useState('tva'); // Correction du nom de la variable
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validPhoneNumber, setValidPhoneNumber] = useState(true);
// eslint-disable-next-line
  const handleTaxOptionChange = (value) => {
    setTaxOption(value);
  };
  const [taxOptionTable, setTaxOptionTable] = useState('tva');
    const handleTaxOptionTableChange = (value) => {
        setTaxOptionTable(value);
    };
  useEffect(() => {
    if (taxOption === 'tva') {
      fetchTvaData();
    } else if (taxOption === 'timbre') {
      fetchTimbreData();
    }
  }, [taxOption]);
  const openModal = (option) => {
    setOpen(true);
    setSelectedOption(option);
}
    useEffect(() => {
        fetchData();
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/categories');
            if (response.ok) {
                const data = await response.json();
                setCategoryData(data);
            } else {
                console.error('Failed to fetch category data');
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    };

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
        console.log('Editing:', record);
    };

    const handleDelete = async (record) => {
        console.log('Deleting:', record);
    };

 


    const onTabChange = (key) => {
      setActiveTabKey(key);
      setSelectedOption(key); // Mettre à jour selectedOption
  };
  const handleFormSubmit = async () => {
    try {
        const values = await form.validateFields();
        // Utiliser selectedOption pour déterminer quel type de données créer
        if (selectedOption === 'BasicInformation') {
            createBasicInformation(values);
        } else if (selectedOption === 'Categories') {
            createCategory(values);
        } else if (selectedOption === 'Tax') {
            if (taxOption === 'tva') {
                createTVA(values);
            } else if (taxOption === 'timbre') {
                createTimbre(values);
            }
        }
    } catch (error) {
        console.error('Form validation failed:', error);
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
    const { Nom_S, Email_S,Paye_S,Address_S,Code_Postal_S,Matricule_Fiscale_S,Num_Phone_S } = values;
    // Assurez-vous que le numéro de téléphone est formaté correctement
      // Format the phone number as desired
      let formattedPhoneNumber = `+${Num_Phone_S.replace(/\s/g, '')}`;
  
      const postData = {
      Nom_S,
      Email_S,
      Paye_S,
      Address_S,
      Code_Postal_S,
      Matricule_Fiscale_S,
      Num_Phone_S: formattedPhoneNumber, // Le numéro de téléphone formaté
    };

    
    const response = await fetch('http://localhost:5000/parametre', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
      credentials: 'include',
  });
    if (response.status === 201) {
      message.success('Basic Information created successfully');
      form.resetFields(); // Réinitialiser les champs du formulaire
      fetchData(); // Recharger les données
    } else {
      throw new Error('Failed to create Basic Information');
    }
  } catch (error) {
    console.error('Error creating Basic Information:', error);
    message.error('Failed to create Basic Information');
  }
};


    const createCategory = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/categories', values);
            if (response.status === 201) {
                message.success('Category created successfully');
                form.resetFields();
                fetchCategory();
            } else {
                throw new Error('Failed to create Category');
            }
        } catch (error) {
            console.error('Error creating Category:', error);
            message.error('Failed to create Category');
        }
    };

    const createTVA = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/tva', values);
            if (response.status === 201) {
                message.success('TVA created successfully');
                form.resetFields();
                fetchTvaData();
            } else {
                throw new Error('Failed to create TVA');
            }
        } catch (error) {
            console.error('Error creating TVA:', error);
            message.error('Failed to create TVA');
        }
    };

    const createTimbre = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/timbre', values);
            if (response.status === 201) {
                message.success('Timbre created successfully');
                form.resetFields();
                fetchTimbreData();
            } else {
                throw new Error('Failed to create Timbre');
            }
        } catch (error) {
            console.error('Error creating Timbre:', error);
            message.error('Failed to create Timbre');
        }
    };

    const fetchTvaData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/tva');
            if (response.ok) {
                const data = await response.json();
                setTvaData(data);
            } else {
                console.error('Failed to fetch TVA data');
            }
        } catch (error) {
            console.error('Error fetching TVA data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimbreData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/timbre');
            if (response.ok) {
                const data = await response.json();
                setTimbreData(data);
            } else {
                console.error('Failed to fetch timbre data');
            }
        } catch (error) {
            console.error('Error fetching timbre data:', error);
        } finally {
            setLoading(false);
        }
    };

    const columnsVisto = [
      { title: 'Ref', dataIndex: 'ref', key: 'ref' },
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
    ];
    const columnsCategory = [
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
    ];
    const columnsTva = [
      { title: 'Pourcent_TVA', dataIndex: 'Pourcent_TVA', key: 'Pourcent_TVA' },
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
    ];
    const columnsTimbre = [
      { title: 'Valeur', dataIndex: 'Valeur', key: 'Valeur' },
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
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, float: 'right' }}>
                <Button type="primary" icon={<UserAddOutlined />} onClick={() => setOpen(true)}>Create</Button>
            </div>
            <div style={{ clear: 'both' }}>
                <Tabs activeKey={activeTabKey} onChange={onTabChange}>
                    <TabPane tab="Basic Information" key="BasicInformation">
                    <Table  dataSource={data.map(item => ({ ...item, key: item._id }))} columns={columnsVisto} loading={loading}  pagination={{ pageSize: 12 }} />
                        {/* Table for Basic Information */}
                    </TabPane>
                    <TabPane tab="Categories" key="Categories">
                    <Table     dataSource={CategoryData.map(item => ({ ...item, key: item._id }))} columns={columnsCategory} loading={loading}      pagination={{ pageSize: 12 }}/>
                        {/* Table for Categories */}
                    </TabPane>
                    <TabPane tab="Tax" key="Tax">
    <Select defaultValue={'tva'} style={{ width: 200, marginBottom: 20 }} value={taxOptionTable} onChange={handleTaxOptionTableChange}>
       
        <Option value="tva">TVA</Option>
        <Option value="timbre">Timbre</Option>
    </Select>
    {taxOptionTable && ( // Vérifiez si une option de taxe a été sélectionnée
        <Table
            dataSource={taxOptionTable === 'tva' ? tvaData : timbreData}
            columns={taxOptionTable === 'tva' ? columnsTva : columnsTimbre}
            loading={loading}
            pagination={{ pageSize: 12 }}
        />
    )}
</TabPane>



                </Tabs>
            </div>
            <Modal
                title="Create New Record"
                visible={open}
                onCancel={() => setOpen(false)}
                footer={null}
            >
                <Form style={{ marginTop: '30px' }}form={form} onFinish={handleFormSubmit}>
                
                {selectedOption === 'BasicInformation' && (
                    <>
                                 <Row gutter={16}>
        <Col span={12}>
  <Form.Item
    name="Nom_S"

   
    rules={[
      {
        required: true,
        message: 'Please enter the full name.', // Corrected the grammar
        // Removed the type: 'string' check because it's unnecessary for text inputs
      },
    ]}
  >
    <Input placeholder="Full name"  style={{ border: 'none', backgroundColor: 'transparent', outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
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
              <Input placeholder="E-mail!" style={{ border: 'none', backgroundColor: 'transparent', outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
              name="Paye_S"
              rules={[
                {
                  required: true,
                  message: 'Please enter the country!.',
                },
              ]}
            >
              <Input  placeholder="Country"style={{ border: 'none', backgroundColor: 'transparent', outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}} />
            </Form.Item>
          </Col>
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
              <Input  placeholder="Address!"style={{ border: 'none', backgroundColor: 'transparent', outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}} />
            </Form.Item>
          </Col>
          </Row>
          <Row  gutter={16}>
          <Col span={12} style={{ marginBottom: '0px' }}>
                                    <Form.Item
                                        name="Num_Phone_S"
                                        style={{ border: 'none', borderBottom: '0.5px solid grey',}}
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                    
                                        <PhoneInput
                                            country={'us'}
                                            value={phoneNumber}
                                            onChange={handleChangePhoneNumber}
                                            inputStyle={{ border: 'none', boxShadow: 'none' }}
                                            placeholder="Phone number"
                                           
                                        />
                                
                                    </Form.Item>
                                    {!validPhoneNumber && (
                                        <p>Please enter a valid phone number.</p>
                                    )}
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
              <Input placeholder="Postal code."  />
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
              <Input placeholder="Tax Identification Number ." />
            </Form.Item>
          </Col>
      </Row>
                    </>
                )}
                {selectedOption === 'Categories' && (
                    <>
                       <Row gutter={16}>
            <Col span={12}>
      <Form.Item
        name="Titre_Categorie"
        
        rules={[
          {
            required: true,
            message: 'Please enter the Category.', // Corrected the grammar
            // Removed the type: 'string' check because it's unnecessary for text inputs
          },
        ]}
      >
        <Input placeholder=" Category" />
      </Form.Item>
      </Col>
      <Col span={12}>
      <Form.Item
        name="Description_Categorie"
        style={{float:'center'}}
        rules={[
          {
            required: true,
            message: 'Please enter Description_Categorie.', // Corrected the grammar
            // Removed the type: 'string' check because it's unnecessary for text inputs
          },
        ]}
      >
        <Input placeholder=" Description"/>
      </Form.Item>
    </Col>
    </Row>
    </>
                )}
    {selectedOption === 'Tax' && (
            <>
              {taxOption === 'tva' && (
                <Form.Item
                  name="Pourcent_TVA"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the TVA percentage.',
                    },
                  ]}
                >
                  <Input placeholder=" TVA percentage"  />
                </Form.Item>
              )}
              {taxOption === 'timbre' && (
                <Form.Item
                  name="Valeur"
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the stamp value.',
                    },
                  ]} 
                >
                  <Input placeholder="stamp value" />
                </Form.Item>
              )}
            </>
          )}
                    <Form.Item>
                        <Button style={{width:'100px', marginTop:'20px'}} type="primary" htmlType="submit"onClick={() => openModal(activeTabKey)}>Create</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ParametreVisto;
