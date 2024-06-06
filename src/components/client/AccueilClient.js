import React, { useState, useEffect } from 'react';
import Header from './HeaderClient';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import { Avatar, Card, message,Button, Modal, Form, Select,Input,Row ,Col } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactSelect from 'react-select';
import countryList from 'react-select-country-list';

import { components } from 'react-select';
   // eslint-disable-next-line
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
const AccueilClient = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
    // eslint-disable-next-line
  const [selectedCountry, setSelectedCountry] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const countryOptions = countryList().getData();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found');
        }

        const response = await axios.get('http://localhost:5000/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
        // Gérer les erreurs ici
      }
    };

    fetchUserProfile();
  }, []);

  const showModal = () => {
    form.setFieldsValue({
      ...userProfile,
      country: userProfile?.country ? { label: userProfile.country, value: userProfile.country } : null,
    });
    setIsModalVisible(true);
  };
  
 
  const handleOk = async () => {
    try {
      const values = form.getFieldsValue();
      const { fullname, email, code_postal, siteweb, Nom_entreprise, address, matricule_fiscale, num_phone, num_fax, num_bureau} = values;
  

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
        fullname: fullname ,
        email: email ,
        country: countryLabel ,
        address: address ,
        matricule_fiscale: matricule_fiscale ,
        code_postal: code_postal,
        status: true,
        Nom_entreprise: Nom_entreprise ,
        siteweb: siteweb ,
        num_phone: formattedPhoneNumber ,
        num_fax: formattedFaxNumber ,
        num_bureau: formattedBureauNumber ,
      };
  
      // Filtrer les propriétés indéfinies
      const filteredPostData = Object.fromEntries(Object.entries(postData).filter(([_, v]) => v !== undefined));
  
      const response = await fetch(`http://localhost:5000/clients/${userProfile._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredPostData),
      });
  
      if (response.ok) {
        message.success('Data updated successfully');
        form.resetFields();
        setIsModalVisible(false);
        // Rafraîchir les données utilisateur après la mise à jour
        const updatedProfileResponse = await axios.get('http://localhost:5000/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setUserProfile(updatedProfileResponse.data);
      } else {
        throw new Error('Failed to update data');
      }
    } catch (error) {
      message.error('Failed to update data');
      console.error('Error updating data:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleChangePhoneNumber = (value) => {
    setPhoneNumber(value);
    setValidPhoneNumber(validatePhoneNumber(value));
};

const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
};
  return (
    <div>
      <Header />
      <div style={{ display: 'flex', width: '100%', padding: '20px' }}>
        <div style={{ width: '30%', padding: '20px' }}>
          {userProfile && (
            <Card style={{ marginLeft: '40px', width: '100%', height: '600px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title className="animated-title" style={{ fontFamily: 'cursive', color: 'black', marginBottom: '0', textAlign: 'center', fontSize: '30px', marginTop: '10px', fontWeight: 300 }}>
                  My Profile
                </Title>
                <Avatar style={{ backgroundColor: '#FC6736', fontWeight: 'bold', cursor: 'pointer', width: '100px', height: '100px', fontSize: '50px', marginTop: '30px' }}>
                  {userProfile.fullname.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ height: '0.1px', backgroundColor: 'gray', width: '100%', marginTop: '20px' }}></div>
                <div style={{ marginTop: '10px' }}>
                  <Title className="animated-title" style={{ fontWeight: 300, fontFamily: 'cursive', cursor: 'pointer', color: 'black', marginBottom: '0', textAlign: 'left', fontSize: '20px', marginTop: '40px' }}>
                    {userProfile.fullname}
                  </Title>
                  <Title className="animated-title" style={{ fontWeight: 300, fontFamily: 'cursive', cursor: 'pointer', color: 'black', marginBottom: '0', textAlign: 'left', fontSize: '20px', marginTop: '40px' }}>
                    {userProfile.email}
                  </Title>
                  <br/>
                  <p style={{ fontWeight: 300, fontFamily: 'cursive', cursor: 'pointer', textAlign: 'justify' }}>
                    With BillpayVisto, effortlessly manage your quotes and invoices with ease. Request, accept, or reject quotes with just a few clicks, and access your invoices anytime. Don't worry, our notifications will keep you informed of all your updates and important reminders.
                  </p>
                </div>
            
              </div>
            </Card>
          )}
        </div>
        <div style={{ width: '70%', display: 'flex' }}>
          <div style={{ textAlign: 'center', marginRight: '60px', marginLeft: '50px' }}>
            <Title className="animated-title" style={{ textAlign: 'left', fontFamily: 'Oswald', color: '#292559', marginBottom: '0', fontSize: '60px', marginTop: '30px' }}>
              Welcome Back to BillPayVisto!
            </Title>
            <Button type="primary" onClick={showModal} style={{ marginTop: '40px', backgroundColor: '#022452', marginRight:'-620px'}}>
    Edit Profile
</Button>

            <Card style={{ marginTop: '20px', width: '95%', height: 'auto', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                  <strong>Fullname:</strong>
                  <span>{userProfile?.fullname}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                  <strong>Email:</strong>
                  <span>{userProfile?.email}</span>
                </div>
                {userProfile?.Nom_entreprise && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Society Name:</strong>
                    <span>{userProfile.Nom_entreprise}</span>
                  </div>
                )}
                {userProfile?.siteweb && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Web Site:</strong>
                    <span>{userProfile.siteweb}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                  <strong>Phone Number:</strong>
                  <span>{userProfile?.num_phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                  <strong>Phone Number:</strong>
                  <span>{userProfile?.country}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                  <strong>Address:</strong>
                  <span>{userProfile?.address}</span>
                </div>
                {userProfile?.type && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Type:</strong>
                    <span>{userProfile.type}</span>
                  </div>
                )}
                {userProfile?.matricule_fiscale && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Matricule Fiscale:</strong>
                    <span>{userProfile.matricule_fiscale}</span>
                  </div>
                )}
                {userProfile?.num_fax && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Fax Number:</strong>
                    <span style={{ textAlign: 'right' }}>{userProfile.num_fax}</span>
                  </div>
                )}
                {userProfile?.num_bureau && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginBottom: '10px' }}>
                    <strong>Bureau Number:</strong> 
                    <span style={{ textAlign: 'left' }}>{userProfile.num_bureau}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Modal title="Edit Profile" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form} layout="vertical">
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
        onChange={(option) => setSelectedCountry(option)} 
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
          {userProfile?.type !== 'physique' && (
            <>
              <Form.Item label="Matricule Fiscale" name="matricule_fiscale">
                <Input />
              </Form.Item>
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
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default AccueilClient;
