import React, { useState, useEffect } from 'react';
import { Table,  Button, Tabs, Select, Drawer,  Form, Input, Col, Row,message,Popconfirm,Space } from 'antd';

import {  EditOutlined, DeleteOutlined,UserAddOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const { Option } = Select;

const ParametreVisto = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('BasicInformation');
    const [selectedOption, setSelectedOption] = useState('BasicInformation');
    const [form] = Form.useForm();
     const [open, setOpen] = useState(false);
    const [CategoryData, setCategoryData] = useState([]);
    const [tvaData, setTvaData] = useState([null]); // État pour stocker les données de TVA
    const [timbreData, setTimbreData] = useState([null]);
    const [taxOption, setTaxOption] = useState(null); // Initialize to null
    const [taxOptionTable, setTaxOptionTable] = useState(null);
    const handleTaxOptionTableChange = (value) => {
      setTaxOptionTable(value);
  };
    const handleTaxOptionChange = (value) => {
        setTaxOption(value);
    };
  
    useEffect(() => {
        fetchData();
        fetchCategory();
        fetchTimbreData();
        fetchTvaData();
    }, []);
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


    const fetchCategory = async () => {
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
      // Mettez ici la logique pour éditer un enregistrement
      console.log('Editing Financier:', record);
    };
  
    const handleDelete = async (record) => {
      // Mettez ici la logique pour supprimer un enregistrement
      console.log('Deleting Financier:', record);
    };
    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };
    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };

    
    const onTabChange = (key) => {
      setActiveTabKey(key);
  };
  
  const handleFormSubmit = async () => {
    try {
        const values = await form.validateFields();
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


    const createBasicInformation = async (values) => {
        try {
            const response = await fetch('http://localhost:5000/parametre', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Basic Information created successfully');
                form.resetFields();
                fetchData();
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
            const response = await fetch('http://localhost:5000/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                message.success('Category created successfully');
                form.resetFields();
                fetchData();
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
          const response = await fetch('http://localhost:5000/tva', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
          });
          if (response.ok) {
              message.success('TVA created successfully');
              form.resetFields();
              fetchTvaData(); // Ajoutez ceci pour mettre à jour les données TVA après la création
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
          const response = await fetch('http://localhost:5000/timbre', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
          });
          if (response.ok) {
              message.success('Timbre created successfully');
              form.resetFields();
              fetchTimbreData(); // Ajoutez ceci pour mettre à jour les données de Timbre après la création
          } else {
              throw new Error('Failed to create Timbre');
          }
      } catch (error) {
          console.error('Error creating Timbre:', error);
          message.error('Failed to create Timbre');
      }
  };
  
    useEffect(() => {
      if (taxOption === 'tva') {
          fetchTvaData();
      } else if (taxOption === 'timbre') {
          fetchTimbreData();
      }
  }, [taxOption]);

 
    const drawerContent = () => {
        return (
            <Form
                form={form}
                onFinish={handleFormSubmit}
                layout="vertical"
                scrollToFirstError
            >
                {selectedOption === 'BasicInformation' && (
                    <>
                             <Row gutter={16}>
        <Col span={12}>
  <Form.Item
    name="Nom_S"
    label="FullName"
    rules={[
      {
        required: true,
        message: 'Please enter the full name.', // Corrected the grammar
        // Removed the type: 'string' check because it's unnecessary for text inputs
      },
    ]}
  >
    <Input placeholder="Please enter full name" />
  </Form.Item>
</Col>
          
          <Col span={12}>
            <Form.Item
              name="Email_S"
              label="Email"
              rules={[
                { type: 'email', message: 'The input is not valid E-mail!' },
                { required: true, message: 'Please input your E-mail!' },
              ]}
              
            >
              <Input placeholder="Please input your E-mail!" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
        <Col span={12}>
            <Form.Item
              name="Paye_S"
              label="Country"
              rules={[
                {
                  required: true,
                  message: 'Please enter the country!.',
                },
              ]}
            >
              <Input  placeholder="Please enter the country:" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Address_S"
              label="Address"
              rules={[
                {
                  required: true,
                  message: 'Please enter the address!.',
                },
              ]}
            >
              <Input  placeholder="Please enter the address!" />
            </Form.Item>
          </Col>
          </Row>
          <Row>
          <Col span={12}>
            <Form.Item
              name="Num_Phone_S"
              label="Phone number"
              rules={[
                {
                  required: true,
                  message: 'Please enter the phone number!.',
                },
              ]}
            >
              <Input placeholder="Please enter the phone number!" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="Code_Postal_S"
              label="Postal code"
              rules={[
                {
                  required: true,
                  message: 'Please enter the postal code!.',
                },
              ]}
            >
              <Input placeholder="Please enter the postal code!."  />
            </Form.Item>
          </Col>
          </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="Matricule_Fiscale_S"
              label="Tax identification number"
              rules={[
                {
                  required: true,
                  message: 'Please enter the tax identification number!.',
                },
              ]}
            >
              <Input placeholder="Please enter the tax identification number !."  />
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
    </>
                )}
  {selectedOption === 'Tax' && (
                    <>
                        <Select defaultValue={null} style={{ width: 150 }} onChange={handleTaxOptionChange}>
                            <Option value={null} disabled hidden>
                                Select Tax Option
                            </Option>
                            <Option value="tva">TVA</Option>
                            <Option value="timbre">Timbre</Option>
                        </Select>
                        {taxOption === 'tva' && (
                            <Form.Item
                                name="Pourcent_TVA"
                                label="Pourcentage TVA"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the TVA percentage.',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter TVA percentage" />
                            </Form.Item>
                        )}
                        {taxOption === 'timbre' && (
                            <Form.Item
                                name="Valeur"
                                label="Valeur Timbre"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the Timbre value.',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter Timbre value" />
                            </Form.Item>
                        )}
                    </>
  )}

</Form>
);
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
              <Button type="primary" icon={<UserAddOutlined />} onClick={showDrawer}>Create</Button>
          </div>
          <Drawer
              title="Create your data"
              width={720}
              onClose={onClose}
              visible={open}
              extra={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Select defaultValue={selectedOption}  style={{ width: 200, marginRight: '8px' }}  onChange={handleSelectChange}>
                          <Option value="BasicInformation">Basic Information</Option>
                          <Option value="Categories">Categories</Option>
                          <Option value="Tax">Tax</Option>
                      </Select>
                      <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={() => form.submit()} type="primary" htmlType="submit">Submit</Button>
                        </Space>
                  </div>
              }
          >
              {drawerContent()}
          </Drawer>
          <div style={{ clear: 'both' }}>
              <Tabs activeKey={activeTabKey} onChange={onTabChange}>
                  <TabPane tab="Basic Information" key="BasicInformation">
                      <Table  dataSource={data.map(item => ({ ...item, key: item._id }))} columns={columnsVisto} loading={loading}  pagination={{ pageSize: 12 }} />
                  </TabPane>
                  <TabPane tab="Categories" key="Categories">
                      <Table     dataSource={CategoryData.map(item => ({ ...item, key: item._id }))} columns={columnsCategory} loading={loading}      pagination={{ pageSize: 12 }}/>
                  </TabPane>
                  <TabPane tab="Tax" key="Tax">
    <Select defaultValue={null} style={{ width: 200, marginBottom: 20 }} value={taxOptionTable} onChange={handleTaxOptionTableChange}>
        <Option value={null} disabled hidden>
            Select Tax Option
        </Option>
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
      </div>
  );

};

export default ParametreVisto;
