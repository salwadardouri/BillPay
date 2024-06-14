import React, { useState, useEffect } from 'react';
import { Table, Tooltip,Button, Tabs, Modal,Select, Drawer, Badge,Checkbox, Space, message, Form, Input, Col, Row, Alert} from 'antd';
import { EditOutlined, UserAddOutlined ,EyeOutlined,CheckCircleOutlined, CloseCircleOutlined,StopOutlined,CheckOutlined} from '@ant-design/icons';import './User.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list';
import { components } from 'react-select';
import axios from 'axios';
import ReactSelect from 'react-select';
import { debounce } from 'lodash';
const { Search } = Input;
const { TabPane } = Tabs;
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
    const [clients, setClients] = useState([]);
    const [financiers, setFinanciers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('Clients');
    const [clientTypeFilter, setClientTypeFilter] = useState('allclient');
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [successAlert, setSuccessAlert] = useState(false);
    const [errorAlert, setErrorAlert] = useState(false);
    const [isMatriculeEnabled, setIsMatriculeEnabled] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const countryOptions = countryList().getData();
    const [clientStatusFilter, setClientStatusFilter] = useState('allclient');
    const [financierStatusFilter, setFinancierStatusFilter] = useState('all');
    const [searchText, setSearchText] = useState(''); 
    const [editRecordClient, setEditRecordClient] = useState(null);
    const [editRecordFinancier, setEditRecordFinancier] = useState(null);
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
        setEditRecordFinancier(null); 
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
    const handleEditFinancier = (recordFinancier) => {
      setEditRecordFinancier(recordFinancier);
      setOpen(true);
    
      // Obtenez la valeur du pays du record
      const country = countryOptions.find((option) => option.label === recordFinancier.country);
    
      // Définissez les valeurs des champs, y compris le pays
      form.setFieldsValue({
        ...recordFinancier,
       
        country: country, // Définit la valeur du champ du pays
      });
    };
  
    useEffect(() => {
        fetchClients();
        fetchFinanciers();
    }, []);

    const fetchFinanciers = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
    
        if (!accessToken) {
          console.error('No access token found');
          return;
        }
    
        const response = await fetch('http://localhost:5000/financier?roles=FINANCIER', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
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
    

    const fetchClients = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
    
        if (!accessToken) {
          console.error('No access token found');
          return;
        }
    
        const response = await fetch('http://localhost:5000/clients?roles=CLIENT', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
    
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
    

    const handleChangePhoneNumber = (value) => {
        setPhoneNumber(value);
        setValidPhoneNumber(validatePhoneNumber(value));
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumberPattern.test(phoneNumber);
    };
    const handleFormSubmitFinancier = async (values) => {
      if (editRecordFinancier) {
        await updateFinancier(values);
      } else {
        await onFinishFinancier(values);
      }
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
        const { fullname, status,email,code_postal, siteweb, Nom_entreprise, address, matricule_fiscale, num_phone, num_fax, num_bureau } = values;
    
        // Récupérez la valeur du pays du formulaire
        const selectedCountry = form.getFieldValue('country');
        
        // Vérifiez si une valeur de pays est sélectionnée
        const countryLabel = selectedCountry ? selectedCountry.label : '';
        
        // Formatage des numéros de téléphone si présents
        const formattedPhoneNumber = num_phone ? num_phone.replace(/\s/g, '') : null;
        const formattedFaxNumber = num_fax ? num_fax.replace(/\s/g, '') : null;
        const formattedBureauNumber = num_bureau ? num_bureau.replace(/\s/g, '') : null;
     
        // Construisez les données à envoyer en excluant les champs vides
        const postData = {
          fullname: fullname,
          email: email ,
          country: countryLabel ,
          address: address ,
          matricule_fiscale: matricule_fiscale ,
          code_postal: code_postal ,
          status: status ,
          Nom_entreprise: Nom_entreprise ,
          siteweb: siteweb,
          num_phone: formattedPhoneNumber ,
          num_fax: formattedFaxNumber ,
          num_bureau: formattedBureauNumber,
        };
        
        // Filtrer les propriétés indéfinies
        const filteredPostData = Object.fromEntries(Object.entries(postData).filter(([_, v]) => v !== undefined));
    
        const response = await fetch(`http://localhost:5000/clients/${editRecordClient._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(filteredPostData),
        });
    
        if (response.ok) {
          message.success('Data updated successfully');
          form.resetFields();
          setOpen(false);
          fetchClients(); 
        } else {
          throw new Error('Failed to update data');
        }
      } catch (error) {
        message.error('Failed to update data');
        console.error('Error updating data:', error);
      }
    };
    
    useEffect(() => {
      if (editRecordFinancier) {
        setStatus(editRecordFinancier.status);
      }
    }, [editRecordFinancier]);
  
    const updateFinancier = async (values) => {
      try {
        const { fullname, email, code_postal, num_phone,address ,status } = values;
    
        // Récupérez la valeur du pays du formulaire
        const selectedCountry = form.getFieldValue('country');
        
        // Vérifiez si une valeur de pays est sélectionnée
        const countryLabel = selectedCountry ? selectedCountry.label : '';

        
        const formattedPhoneNumber = `${num_phone.replace(/\s/g, '')}`;
        const postData = {
          fullname,
          email,
          country: countryLabel,
          address,
          num_phone: formattedPhoneNumber,
 
          status,
          code_postal,
        };
    
        const response = await fetch(`http://localhost:5000/financier/${editRecordFinancier._id}`, {
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
          fetchFinanciers();  // Recharger les données
        } else {
          throw new Error('Failed to update data');
        }
      } catch (error) {
        message.error('Failed to update data');
        console.error('Error updating data:', error);
      } finally {
        // Après avoir reçu la réponse de la requête PATCH, mettre à jour loading à false
        setLoading(false);
      }
    };
    
    const onFinishFinancier = async (values) => {
      let formattedPhoneNumber = `+${values.num_phone.replace(/\s/g, '')}`;
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
    
        const responseData = await response.json();
    
        if (response.ok) {
          // Stocker les jetons dans localStorage
          localStorage.setItem('accessToken', responseData.accessToken);
          localStorage.setItem('refreshToken', responseData.refreshToken);
    
          setSuccessAlert(true);
    
          setTimeout(() => {
            setSuccessAlert(false);
            form.resetFields();
            setOpen(false);
          }, 2000);
    
          fetchFinanciers();
        } else {
          throw new Error('Failed to create account.');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorAlert(true);
        setTimeout(() => setErrorAlert(false), 3000);
      }
    };
    const onFinishClient = async (values) => {
      values.roles = ["CLIENT"];
      let formattedPhoneNumber = `+${values.num_phone.replace(/\s/g, '')}`;
      let formattedFaxNumber = `+${values.num_fax.replace(/\s/g, '')}`;
      let formattedBureauNumber = `+${values.num_bureau.replace(/\s/g, '')}`;
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
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          // Stocker les jetons dans localStorage
          localStorage.setItem('accessToken', responseData.accessToken);
          localStorage.setItem('refreshToken', responseData.refreshToken);
    
          setSuccessAlert(true);
    
          // Réinitialiser et fermer après 3 secondes
          setTimeout(() => {
            setSuccessAlert(false);
            form.resetFields(); // Réinitialise le formulaire
            setOpen(false); // Ferme le Drawer
          }, 2000);
    
          fetchClients();
        } else {
          throw new Error('Failed to create account.');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorAlert(true);
        setTimeout(() => setErrorAlert(false), 3000);
      }
    };
    
 
    const onTabChange = (key) => {
        setActiveTabKey(key);
    };

const onSearch = debounce(async (query) => {
  setLoading(true);
  try {
    if (activeTabKey === 'Clients') {
      if (query.trim() === '') {
        fetchClients();
      
        
      } else {
        const res = await axios.post(`http://localhost:5000/clients/search?key=${query}`);
        setClients(res.data);
      }
    } else {
      if (query.trim() === '') {
        fetchFinanciers();
        
      } else {
        const res = await axios.post(`http://localhost:5000/financier/search?key=${query}`);
        setFinanciers(res.data);
      }
    }
  } catch (error) {
    message.error('Error during search');
  } finally {
    setLoading(false);
  }
}, 300);
    const columnsFinancier = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 90,
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
            width: 100,
            render: (_, recordFinancier) => (
                <>
                            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditFinancier(recordFinancier)} />
                 
                    
                </>
            ),
        },
    ];

    const columnsClient = [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 90,
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
          sorter: (a, b) => a.type - b.type,
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
            width: 100,
            render: (_, recordClient) => (
                <>
                 <Space>
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEditClient(recordClient)} />
                
                    <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewClient(recordClient)} />
                    </Space>  </>
            ),
        },
    ];

    const handleClientTypeChange = (value) => {
        setClientTypeFilter(value);
    };

    const handleClientStatusChange = (value) => {
      setClientStatusFilter(value);
  };

  const handleFinancierStatusChange = (value) => {
      setFinancierStatusFilter(value);
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
                <Input  name="Nom_entreprise" placeholder="Please enter Name Society" />
            </Form.Item>
        </Col>
        <Col span={12}>
            <Form.Item
                name="siteweb"
                label="Web Site"
              
            >
                <Input  name="siteweb" placeholder="Please enter full name" />
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
    const drawerContentFinancier= () => (<Form form={form} layout="vertical" onFinish={handleFormSubmitFinancier}>
   {editRecordFinancier && (
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

    
    width={720}
    onClose={onClose}
    open={open}
    visible={drawerVisible}
    extra={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <Space>
                <Button onClick={onClose}>Cancel</Button>
               
                <Button style={{ backgroundColor:'#022452'}} type="primary" onClick={() => form.submit()} htmlType="submit">
  {editRecordClient || editRecordFinancier ? 'Update' : 'Create'}

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
    {activeTabKey === 'Financiers' && drawerContentFinancier()}
    {activeTabKey === 'Clients' && drawerContentClient()}
</Drawer>



            <div style={{ clear: 'both' ,marginTop:"30px" }}>
                <Tabs activeKey={activeTabKey} onChange={onTabChange}  >
                    <TabPane tab="Clients" key="Clients">
                  
                    <Select defaultValue="allclient" style={{ width: 150, marginBottom: 20}} onChange={handleClientTypeChange}>
                            <Option value="allclient">All of types</Option>
                            <Option value="morale">Moral</Option>
                            <Option value="physique">Physical</Option>
                         
                        </Select>
                        <Select defaultValue="allclient" style={{ width: 150, marginBottom: 20,marginLeft:'10px' }} onChange={handleClientStatusChange}>
                            <Option value="allclient">All of status</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
                
                      
                        <Table
    dataSource={
        clientTypeFilter === 'allclient'
            ? clients.filter(clients => clients.status === (clientStatusFilter === 'allclient' ? clients.status : clientStatusFilter === 'activated'))
            : clients.filter(clients=> clients.type === clientTypeFilter && clients.status === (clientStatusFilter === 'allclient' ? clients.status : clientStatusFilter === 'activated'))
    }
    columns={columnsClient}
    pagination={{ pageSize: 12 }}
    loading={loading}
/>

                    </TabPane>
                    <TabPane tab="Financiers" key="Financiers">
                        <Select defaultValue="all" style={{ width: 150, marginBottom: 20 }} onChange={handleFinancierStatusChange}>
                            <Option value="all">All of status</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
                        <Table
    dataSource={
        financierStatusFilter === 'all' ? financiers : financiers.filter(financiers => financiers.status === (financierStatusFilter === 'activated'))
    }
    columns={columnsFinancier}
    pagination={{ pageSize: 12 }}
    loading={loading}
/>
                    </TabPane>
                </Tabs>
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