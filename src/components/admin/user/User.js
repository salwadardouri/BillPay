import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, Tooltip,Button, Tabs, Select, Drawer, Space, Form, Input, Col, Row, Alert} from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import './User.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import { components } from 'react-select';

import ReactSelect from 'react-select';
const { TabPane } = Tabs;
const { Option } = Select;
const CountryOption = (props) => {
    return (
      <components.Option {...props}>
        <img
          alt={`Flag of ${props.data.label}`}
          src={`https://flagcdn.com/16x12/${props.data.value.toLowerCase()}.png`}
          style={{ marginRight: 10 , float:'left' }}
        />
        {props.data.label}
      </components.Option>
    );
  };
const User = () => {
    const [clients, setClients] = useState([]);
    const [financiers, setFinanciers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('Clients');
    const [clientTypeFilter, setClientTypeFilter] = useState('all');
    const [selectedOption, setSelectedOption] = useState('client');
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [isMatriculeEnabled, setIsMatriculeEnabled] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const countryOptions = countryList().getData();
    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchClients();
        fetchFinanciers();
    }, []);
  

    const fetchClients = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/clients');
            if (response.ok) {
                const data = await response.json();
                setClients(data);
            } else {
                console.error('Failed to fetch clients');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFinanciers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/financier');
            if (response.ok) {
                const data = await response.json();
                setFinanciers(data);
            } else {
                console.error('Failed to fetch financiers');
            }
        } catch (error) {
            console.error('Error fetching financiers:', error);
        } finally {
            setLoading(false);
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
    const onFinishFinancier = async (values) => {
        let formattedPhoneNumber = `+${phoneNumber.replace(/\s/g, '')}`;
       values.num_phone = formattedPhoneNumber;
        values.roles = ["FINANCIER"];
        values.country = selectedCountry ? selectedCountry.label : '';

        try {
            const response = await fetch('http://localhost:5000/financier/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (!response.ok) throw new Error('Failed to create account.');

            await response.json();

            setSuccessAlert(true);

            setTimeout(() => {
                setSuccessAlert(false);
                form.resetFields();
                setOpen(false);
            }, 2000);
    
            fetchFinanciers();
        } catch (error) {
            console.error('Error:', error);
            setErrorAlert(true);
            setTimeout(() => setErrorAlert(false), 3000);
        }
    };

    const onFinishClient = async  (values) => {
        values.roles = ["CLIENT"];
        let formattedPhoneNumber = `+${phoneNumber.replace(/\s/g, '')}`;
        values.num_phone = formattedPhoneNumber;
        values.matricule_fiscale = isMatriculeEnabled ? values.matricule_fiscale_input : null;
        values.country = selectedCountry ? selectedCountry.label : '';
        try {
          const response = await fetch('http://localhost:5000/clients/create-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        })
        if (!response.ok) throw new Error('Failed to create account.');
  
        await response.json();
        
        setSuccessAlert(true);
        
        // Réinitialiser et fermer après 3 secondes
        setTimeout(() => {
          setSuccessAlert(false);
          form.resetFields(); // Réinitialise le formulaire
          setOpen(false); // Ferme le Drawer
    
        }, 2000);
        fetchClients();
      } catch (error) {
        console.error('Error:', error);
        setErrorAlert(true);
        setTimeout(() => setErrorAlert(false), 3000);
      }
    };
    
    const handleDelete = async (record) => {
        console.log('Deleting record:', record);
    };

    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

    const columnsFinancier = [
        {
            title: 'Fullname',
            dataIndex: 'fullname',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Country',
            dataIndex: 'country',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Phone Number',
            dataIndex: 'num_phone',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Postal Code',
            dataIndex: 'code_postal',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} />
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

    const columnsClient = [
        {
            title: 'Ref',
            dataIndex: 'refClient',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Fullname',
            dataIndex: 'fullname',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Email',
            dataIndex: 'email',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Country',
            dataIndex: 'country',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Phone Number',
            dataIndex: 'num_phone',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Address',
            dataIndex: 'address',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Postal Code',
            dataIndex: 'code_postal',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        ...(clientTypeFilter === 'physique'
            ? []
            : [
                {
                    title: 'TIN : Tax identification number',
                    dataIndex: 'matricule_fiscale',
                    ellipsis: true,
                    render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
                },
            ]),
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button type="link" icon={<EditOutlined />} />
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

    const handleClientTypeChange = (value) => {
        setClientTypeFilter(value);
    };

    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };

    const toggleMatricule = (value) => {
        setIsMatriculeEnabled(value === 'morale');
    };
    const drawerContent = () => {
        if (selectedOption === 'client') {
            return (
                <Form form={form} layout="vertical" onFinish={onFinishClient}>
<Row gutter={[16, 16]}>
  <Col span={12}>
    <Row>
      {isMatriculeEnabled && (
        <Col span={24} justify="end" >
           
          <Form.Item
            name="matricule_fiscale_input"
            label="Tax identification number"
            rules={[{ required: true, message: 'Please input your Matricule Fiscal!' }]}
          >
              <Input placeholder="Please input your TIN!" />
          </Form.Item>
        </Col>
      )}
    </Row>
  </Col>

  <Col span={12} style={{ marginBottom: '0px' }}>
    <Row justify="end">
      <Form.Item name="clientType">
        <Select defaultValue="physique" style={{ width: 150 }} onChange={toggleMatricule}>
          <Option value="physique">Client Physique</Option>
          <Option value="morale">Client Morale</Option>
        </Select>
      </Form.Item>
    </Row>
  </Col>
</Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="fullname"
                      label="Full Name"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter full name',
                        },
                      ]}
                    >
                      <Input placeholder="Please enter full name" />
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your E-mail!' },
                      ]}
                    >
                      <Input placeholder="Please input your E-mail!" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12} style={{ marginBottom: '16px' }}>
              
                                    <Form.Item
                                        name="num_phone"
                                        label="Phone_Number"
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                    
                                        <PhoneInput
                                            country={'us'}
                                            value={phoneNumber}
                                            onChange={handleChangePhoneNumber}
                                         
                                            placeholder="Phone number"
                                           
                                        />
                                
                                    </Form.Item>
                                    {!validPhoneNumber && (
                                        <p>Please enter a valid phone number.</p>
                                    )}
                                </Col>
                                <Col span={12} style={{ marginBottom: '16px' }}>
                                <Form.Item
  name="country"
  label='Country'
  rules={[{ required: true, message: 'Please select your country!' }]}

>
  <ReactSelect
    options={countryOptions}
    components={{ Option: CountryOption }}
    placeholder="Country"
    isClearable={true}
    onChange={(option) => setSelectedCountry(option)} // Update state when a country is selected
    styles={{
      control: (base) => ({
        ...base,

      }),
      input: (base) => ({
        ...base,
        textAlign: 'left',

      }),
      dropdownIndicator: (base) => ({
        ...base,
   
     
      }),
    }}
  />
</Form.Item>

      </Col>
 
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={12} style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[{ required: true, message: 'Please input your address!' }]}
                    >
                      <Input placeholder="Please input your address!" />
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name="code_postal"
                      label="Postal Code"
                      rules={[{ required: true, message: 'Please input your postal code!' }]}
                    >
                      <Input placeholder="Please input your postal code!"  />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            );
        } else if (selectedOption === 'financier') {
            return (
                <Form form={form} layout="vertical" onFinish={onFinishFinancier}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="fullname"
                                label="Full Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter full name',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter full name" />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ marginBottom: '16px' }}>
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    { type: 'email', message: 'The input is not valid E-mail!' },
                                    { required: true, message: 'Please input your E-mail!' },
                                ]}
                            >
                                <Input placeholder="Please input your E-mail!" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12} style={{ marginBottom: '16px' }}>
                       
                                    <Form.Item
                                        name="num_phone"
                                     label="Phone_Number"
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                    
                                        <PhoneInput
                                            country={'us'}
                                            value={phoneNumber}
                                            onChange={handleChangePhoneNumber}
                                         
                                            placeholder="Phone number"
                                           
                                        />
                                
                                    </Form.Item>
                                    {!validPhoneNumber && (
                                        <p>Please enter a valid phone number.</p>
                                    )}
                                </Col>
                        <Col span={12} style={{ marginBottom: '16px' }}>
                        <Form.Item
  name="country"
  label='Country'
  rules={[{ required: true, message: 'Please select your country!' }]}

>
  <ReactSelect
    options={countryOptions}
    components={{ Option: CountryOption }}
    placeholder="Country"
    isClearable={true}
    onChange={(option) => setSelectedCountry(option)} // Update state when a country is selected
    styles={{
      control: (base) => ({
        ...base,

      }),
      input: (base) => ({
        ...base,
        textAlign: 'left',

      }),
      dropdownIndicator: (base) => ({
        ...base,
     

      }),
    }}
  />
</Form.Item>

                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12} style={{ marginBottom: '16px' }}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: 'Please input your address!' }]}
                            >
                                <Input placeholder="Please input your address!" />
                            </Form.Item>
                        </Col>
                        <Col span={12} style={{ marginBottom: '16px' }}>
                            <Form.Item
                                name="code_postal"
                                label="Postal Code"
                                rules={[{ required: true, message: 'Please input your postal code!' }]}
                            >
                                <Input placeholder="Please input your postal code!" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            );
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 16, float: 'right' }}>
                <Button type="primary" style={{ backgroundColor:'#022452'}} icon={<UserAddOutlined />} onClick={showDrawer}>New account</Button>
            </div>
            <Drawer
                title="Create a new account"
                width={720}
                onClose={onClose}
                open={open}
                extra={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Select defaultValue="client" style={{ width: 200, marginRight: '8px' }} onChange={handleSelectChange}>
                            <Option value="client">Client</Option>
                            <Option value="financier">Financier</Option>
                        </Select>
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={() => form.submit()} type="primary" style={{ backgroundColor:'#022452'}} htmlType="submit">Submit</Button>
                        </Space>
                    </div>
                }
            >
                <div style={{width:'600px'}}>
                {successAlert && <Alert message="Success" description="Check your email to find the link." type="success" showIcon />}
                {errorAlert && <Alert message="Error" description="The account could not be created due to a server error. Please try again later!" type="error" showIcon />}
<br/></div>
                {drawerContent()}
            </Drawer>

            <div style={{ clear: 'both' }}>
                <Tabs activeKey={activeTabKey} onChange={onTabChange} >
                    <TabPane tab="Clients" key="Clients">
                        <Select defaultValue="all" style={{ width: 200, marginBottom: 20 }} onChange={handleClientTypeChange}>
                            <Option value="all">All</Option>
                            <Option value="morale">Moral</Option>
                            <Option value="physique">Physical</Option>
                        </Select>
                        <Table
                            dataSource={clientTypeFilter === 'all' ? clients : clients.filter(client => client.type === clientTypeFilter)}
                            columns={columnsClient}
                            pagination={{ pageSize: 12 }}
                            loading={loading}
                        />
                    </TabPane>
                    <TabPane tab="Financiers" key="Financiers">
                        <Table 
                            dataSource={financiers}
                            columns={columnsFinancier}
                            pagination={{ pageSize: 12 }}
                            loading={loading}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default User;
