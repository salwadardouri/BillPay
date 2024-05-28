import React, { useState, useEffect } from 'react';
import { Table, Popconfirm,Tooltip,Button,  Modal,Select, Drawer, Badge,Checkbox, Space, message, Form, Input, Col, Row, Alert} from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined ,EyeOutlined,CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';import './User.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import { components } from 'react-select';
import axios from 'axios';
import ReactSelect from 'react-select';
import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;

const { Option } = Select;



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

const User = () => {
     // eslint-disable-next-line
    const [clients, setClients] = useState([]);

    const [loading, setLoading] = useState(false);

    const [clientTypeFilter, setClientTypeFilter] = useState('all');
    // eslint-disable-next-line
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


    const [searchText, setSearchText] = useState(''); 
    const [editRecordClient, setEditRecordClient] = useState(null);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [status, setStatus] = useState(null);
    const [visible, setVisible] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const handleViewClient = (recordClient) => {
      setSelectedClient(recordClient);
      setVisible(true);
  };

  
    const handleCheckboxChange = (event) => {
      const { value } = event.target;
      setStatus(value === 'true');
    };
  
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
        setDrawerVisible(false);
        form.resetFields();
        setEditRecordClient(null); 

    };

    const handleEditClient = (recordClient) => {
      setEditRecordClient(recordClient);
      setOpen(true);
    
      // Obtenez la valeur du pays du record
      const country = countryOptions.find((option) => option.label === recordClient.country);
    
      // Définissez les valeurs des champs, y compris le pays
      form.setFieldsValue({
        ...recordClient,
        matricule_fiscale_input: recordClient.matricule_fiscale, 
        country: country, // Définit la valeur du champ du pays
      });
    };
    
  
    useEffect(() => {
      fetchClients();
  
  }, []);
  
  
  const fetchClients = async () => {
      setLoading(true);
      try {
          const response = await fetch('http://localhost:5000/clients');
          if (response.ok) {
              const data = await response.json();
              // Filtrer les clients avec status=true
              const clientsWithTrueStatus = data.filter(client => client.status === true);
              setClients(clientsWithTrueStatus);
          } else {
              console.error('Failed to fetch clients');
          }
      } catch (error) {
          console.error('Error fetching clients:', error);
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

    const handleFormSubmitClient= async (values) => {
      if (editRecordClient) {
        await updateClient(values);
      } else {
        await onFinishClient(values);
      }
    };


    useEffect(() => {
      if (editRecordClient) {
        setStatus(editRecordClient.status);
      }
    }, [editRecordClient]);
  
    const updateClient = async (values) => {
      try {
        const { fullname, email,status, code_postal, siteweb, Nom_entreprise, address, matricule_fiscale, num_phone, num_fax, num_bureau } = values;

    
        // Récupérez la valeur du pays du formulaire
        const selectedCountry = form.getFieldValue('country');
        
        // Vérifiez si une valeur de pays est sélectionnée
        const countryLabel = selectedCountry ? selectedCountry.label : '';
     // Formatage des numéros de téléphone
     const formattedPhoneNumber = num_phone.replace(/\s/g, '');
     const formattedFaxNumber = num_fax.replace(/\s/g, '');
     const formattedBureauNumber = num_bureau.replace(/\s/g, '');
        const postData = {
          fullname,
          email,
          country: countryLabel,
          address,
        
          matricule_fiscale,
          code_postal,
          status,
            Nom_entreprise,

  siteweb,
  num_phone: formattedPhoneNumber,
  num_fax: formattedFaxNumber,
  num_bureau: formattedBureauNumber,
        };
    
        const response = await fetch(`http://localhost:5000/clients/${editRecordClient._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
    
        if (response.ok) {
          message.success('Data updated successfully');
           form.resetFields();
          setOpen(false);
          fetchClients();  // Recharger les données
        } else {
          throw new Error('Failed to update data');
        }
      } catch (error) {
        message.error('Failed to update data');
        console.error('Error updating data:', error);
      }
    };
    
    
   
    const onFinishClient = async  (values) => {
        values.roles = ["CLIENT"];
        let formattedPhoneNumber = `+${phoneNumber.replace(/\s/g, '')}`;
        let formattedFaxNumber= `+${phoneNumber.replace(/\s/g, '')}`;
        let formattedBureauNumber = `+${phoneNumber.replace(/\s/g, '')}`;
        values.num_phone = formattedPhoneNumber;
        values.num_bureau = formattedBureauNumber;
        values.num_fax = formattedFaxNumber;
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
    const handleDeleteClient = async (recordClient) => {
      try {
        const response = await fetch(`http://localhost:5000/clients/activated/${recordClient._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json' // Ajoutez l'en-tête Content-Type
          },
          body: JSON.stringify({ status: false }) // Définissez le corps de la requête avec le statut false
        });
        if (response.ok) {
          message.success('Client deleted successfully');
          fetchClients();
        } else {
          throw new Error('Failed to delete client');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        message.error('Failed to delete client');
      }
    };
    
 


    const onSearch = debounce(async (query) => {
      setLoading(true);
      try {
        const res = await axios.post(`http://localhost:5000/clients/search?key=${query}`);
        setClients(res.data);
      } catch (error) {
        console.error('Error during search:', error);
        message.error('Error during search');
      } finally {
        setLoading(false);
      }
    }, 300);


    const columnsClient = [
      {    title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status) => (
            <Badge dot style={{ backgroundColor: status ? 'green' : 'red' }} />
        ),
    },



        {
            title: 'Fullname',
            dataIndex: 'fullname',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
            title: 'Email',
            width: 300,
            dataIndex: 'email',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        // {
        //     title: 'Country',
        //     dataIndex: 'country',
        //     ellipsis: true,
        //     render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        // },
        {
            title: 'Phone Number',
            dataIndex: 'num_phone',
            ellipsis: true,
            render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        },
        {
          title: 'Type',
          dataIndex: 'type',
          ellipsis: true,
          width: 100,
          render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
      },
        // {
        //     title: 'Address',
        //     dataIndex: 'address',
        //     ellipsis: true,
        //     render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        // },
        // {
        //     title: 'Postal Code',
        //     dataIndex: 'code_postal',
        //     ellipsis: true,
        //     render: text => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
        // },
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
            render: (_, recordClient) => (
                <>
                 <Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEditClient(recordClient)} />
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => handleDeleteClient(recordClient)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                        
                    </Popconfirm>
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewClient(recordClient)} />
                    </Space>  </>
            ),
        },
    ];

    const handleClientTypeChange = (value) => {
        setClientTypeFilter(value);
    };
// eslint-disable-next-line
    const handleSelectChange = (value) => {
        setSelectedOption(value);
    };
 

    const toggleMatricule = (value) => {
        setIsMatriculeEnabled(value === 'morale');
    };
    const drawerContentClient= () => (
    <Form form={form} layout="vertical" onFinish={handleFormSubmitClient}>
   
   {editRecordClient && (
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


   <Row gutter={[16, 16]}>
<Col span={12}>
  <Row>
    {isMatriculeEnabled && (
      <Col span={24} justify="end" >
         
        <Form.Item
          name="matricule_fiscale_input"
          label="Tax identification number"
          rules={[
    {
      required: editRecordClient ? true : false,
      message: 'Please input your Matricule Fiscal!',
    },
  ]}
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
                    <Row gutter={16}>
        <Col span={12}>
            <Form.Item
                name="Nom_entreprise"
                label="Name Society"
              
            >
                <Input placeholder="Please enter Name Society" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="siteweb"
                label="Web Site"
              
            >
                <Input placeholder="Please enter full name" />
            </Form.Item>
        </Col>
        </Row>
        <Row gutter={[16, 16]}>
                      <Col span={12} style={{ marginBottom: '16px' }}>
                  
                                        <Form.Item
                                            name="num_fax"
                                            label="Phone_Number"
                                            
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
                      name="num_bureau"
                      label="Phone Number"
                     
                  >
                  
                      <PhoneInput
                          country={'us'}
                          value={phoneNumber}
                          onChange={handleChangePhoneNumber}
                       
                          placeholder="Phone number "
                         
                      />
              
                  </Form.Item>
                  {!validPhoneNumber && (
                      <p>Please enter a valid phone number.</p>
                  )}
              </Col></Row>
                  </Form>);
    


    return (
        <div>
            <div style={{ marginBottom: 16, float: 'right' }}>
                <Button type="primary" style={{ backgroundColor:'#022452'}} icon={<UserAddOutlined />} onClick={showDrawer}>New account</Button>
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
     <Drawer
    title="Create a new account"
    width={720}
    onClose={onClose}
    open={open}
    visible={drawerVisible}
    extra={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <Space>
                <Button onClick={onClose}>Cancel</Button>
               
                <Button style={{ backgroundColor:'#022452'}} type="primary" onClick={() => form.submit()} htmlType="submit">
  {editRecordClient  ? 'Update' : 'Create'}

</Button>
{loading && <div>Loading...</div>}
            </Space>
        </div>
    }
>
    <div style={{width:'600px'}}>
        {successAlert && <Alert message="Success" description="Check your email to find the link." type="success" showIcon />}
        {errorAlert && <Alert message="Error" description="The account could not be created due to a server error. Please try again later!" type="error" showIcon />}
        <br/>
    </div>
 
    {drawerContentClient()}
</Drawer>



            <div style={{ clear: 'both' }}>
        
                
                  
                    <Select defaultValue="all" style={{ width: 150, marginBottom: 20}} onChange={handleClientTypeChange}>
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

         
            </div>
            <Modal
                title="User Details"
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setVisible(false)}>
                        Close
                    </Button>,
                ]}
            >
                {selectedClient && (
                    <div>
                               <p>
                            <strong>Status:</strong>{' '}
                            {selectedClient.status ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}{' '}
                            {selectedClient.status ? 'Active' : 'Inactive'}
                        </p>
                        <p>
                            <strong>Fullname:</strong> {selectedClient.fullname}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedClient.email}
                        </p>
                        {selectedClient.Nom_entreprise && (
                            <p>
                                <strong>Society Name:</strong> {selectedClient.Nom_entreprise}
                            </p>
                        )}
                        {selectedClient.siteweb  && (
                            <p>
                                <strong>Web Site :</strong> {selectedClient.siteweb}
                            </p>
                        )}
                        <p>
                            <strong>Phone Number:</strong> {selectedClient.num_phone}
                        </p>
               
                        <p>
                            <strong>Address:</strong> {selectedClient.address}
                        </p>
                        {selectedClient.type && (
                            <p>
                                <strong>Type:</strong> {selectedClient.type}
                            </p>
                        )}
                      {selectedClient.matricule_fiscale_input&& (
    <p>
        <strong>Matricule Fiscale:</strong> {selectedClient.matricule_fiscale_input}
    </p>
)}

                         {selectedClient.num_fax && (
                            <p>
                                <strong> Fax number:</strong> {selectedClient.num_fax}
                            </p>
                        )}
                        {selectedClient.num_bureau && (
                            <p>
                                <strong>bureau number:</strong> {selectedClient.num_bureau}
                            </p>
                        )}
                 
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default User;