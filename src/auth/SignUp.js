import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, Row, Col, Select ,message} from 'antd';
import PhoneInput from 'react-phone-input-2';
import countryList from 'react-select-country-list';
import { components } from 'react-select';
import 'react-phone-input-2/lib/style.css';
import ReactSelect from 'react-select';

import FacebookImage from '../images/fb.png';
import GmailImage from '../images/g.png';
import LinkedinImage from '../images/in.png';
import {  ArrowLeftOutlined,MailOutlined,GlobalOutlined,LockOutlined ,UserOutlined,EnvironmentOutlined } from '@ant-design/icons';
import './media.css'; 
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
const SignUp = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [clientType, setClientType] = useState("Client Physique");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);

 
      const handleButtonClick = () => {
        navigate('/');
      };
    const handleLoginClick= () => {
      navigate('/SignIn');
    };
  
    // const handleLinkClick = () => {
    //   navigate('/ForgotPassword');
    // };

    const handleChangePhoneNumber = (value) => {
        setPhoneNumber(value);
        setValidPhoneNumber(validatePhoneNumber(value));
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
        return phoneNumberPattern.test(phoneNumber);
    };

    const onFinish = async (values) => {
        try {
          const {
            fullname,
            email,
            password,
            country,
            num_phone,
            address,
            code_postal,
            matricule,
          } = values;
    
          // Formater le numéro de téléphone
          const formattedPhoneNumber = `+${num_phone.replace(/\s/g, '')}`;
    
          const postData = {
            fullname,
            email,
            password,
            country: country.label,
            num_phone: formattedPhoneNumber,
            address,
            code_postal,
            roles: ['CLIENT'],
            matricule_fiscale: clientType === 'Client Morale' ? matricule : undefined,
          };
    
          const response = await fetch('http://localhost:5000/auth/signupclient', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
            credentials: 'include', // pour les cookies et les sessions
          });
    
          const responseData = await response.json();
    
          if (response.ok) {
            // Si tout est correct
            message.success('Utilisateur créé avec succès');
            setTimeout(() => {
              navigate('/Client');
            }, 3000); // Naviguer après 3 secondes
          } else {
            // Gérer les erreurs spécifiques
            if (response.status === 409) {
              // Conflit, comme un email déjà existant
              message.error('L\'email existe déjà');
            } else if (response.status === 400) {
              // Erreur de validation
              message.error(`Erreur de validation: ${responseData.message}`);
            } else {
              // Autres erreurs
              message.error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
            }
            // Effacer le message d'erreur après un certain temps
            setTimeout(() => message.error(''), 3000);
          }
        } catch (error) {
          // Gestion des exceptions non prévues
          console.error('Une erreur s\'est produite', error);
          message.error('Une erreur s\'est produite');
          setTimeout(() => message.error(''), 3000);
        }
      };
  
      const countryOptions = countryList().getData();
    const handleClientTypeChange = (value) => {
        setClientType(value);
    };

    return (
        <div  className="media"  style={{ 
            backgroundColor: '#AAB8FD', 
            minHeight: '100vh', // Ensure the background color fills the viewport
        
      
      
          }}>
            <div style={{paddingTop: '10px'}} >
          
            <Button type="primary" style={{ float: 'left', background: 'transparent', color: '#022452',marginTop:'280px' }} onClick={handleButtonClick}>
            <ArrowLeftOutlined />
          </Button>
              </div>
           
            <Card
                style={{
                    textAlign: 'center',
                    width: '70%',
                    height: '100%',
                    margin: '0 auto',
                    boxShadow: '0 1px 20px rgba(0, 0, 255, 0.3)',
                    border: 0,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                   
                <div style={{ float: 'center', textAlign: 'center', width: '100%', marginTop: '10px' }}>
     
                    <div style={{ fontFamily: 'cursive', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold' }}>
              
                        <h2>Create New Account !</h2>
                        <p style={{ color: 'grey' }}>Get your free BillPayVisto account now </p>
                    </div>
                    <div style={{ marginTop: '30px' }}>

                    <Form
    form={form}
    name="basic"
    onFinish={onFinish}
    layout="vertical"
    colon={false}
    style={{ width: '90%', marginLeft: '30px' }}
    scrollToFirstError
>
<Row gutter={[16, 16]}>
  <Col span={12}>
    <Row style={{ display: clientType === "Client Morale" ? "block" : "none" }}>
      <Col style={{ marginBottom: '0px' }}>
          <Form.Item
              name="matricule"
           
              rules={[
                  {
                      required: clientType === "Client Morale",
                      message: 'Please input your Tax Identification Number!'
                  }
              ]}
          >
              <Input  placeholder=" Tax Identification Number !" refix={<LockOutlined/>} style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
          </Form.Item>
      </Col>
    </Row>
  </Col>
  <Col span={12} style={{ marginBottom: '0px' }}>
    <Row justify="end">
      <Form.Item
          name="clientType"
          initialValue="Client Physique"
          rules={[{ required: true, message: 'Please select client type!' }]}
      >
          <Select onChange={handleClientTypeChange} placeholder="Select Client Type">
              <Option value="Client Morale">Client Morale</Option>
              <Option value="Client Physique">Client Physique</Option>
          </Select>
      </Form.Item>
    </Row>
  </Col>
</Row>

 
    <Row gutter={[16, 16]}>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="fullname"
               
                rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
            >
                <Input placeholder=" FullName " prefix={<UserOutlined/>}style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
            </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '0px' }}>
                                    <Form.Item
                                        name="email"
                                      
                                        rules={[
                                            { type: 'email', message: 'The input is not valid E-mail!' },
                                            { required: true, message: ' E-mail' },
                                        ]}>
                                        <Input prefix={<MailOutlined />}  placeholder=" Email" style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
  </Form.Item>
                                </Col>
 
    </Row>

    <Row gutter={[16, 16]}>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="password"
               
                rules={[{ required: true, message: 'Please input your password!' }]}
                hasFeedback
            >
                 <Input.Password prefix={<LockOutlined/>}  placeholder="Password "  style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
  </Form.Item>
           
        </Col>
        <Col span={12} style={{ marginBottom: '0x' }}>
            <Form.Item
                name="confirm"
              
                dependencies={['password']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password prefix={<LockOutlined/>}  placeholder="Confirm your Password " style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
            </Form.Item>
        </Col>
    </Row>

    <Row gutter={[16, 16]}>
    
      <Col span={12} style={{ marginBottom: '0px', textAlign: 'left' }}> 
        <Form.Item
          name="num_phone"
          style={{ border: 'none', borderBottom: '0.5px solid grey' }}
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <PhoneInput
            country={'us'}
            value={phoneNumber}
            onChange={handleChangePhoneNumber}
            inputStyle={{ border: 'none', boxShadow: 'none', textAlign: 'left' }} 
            placeholder="Phone number"
            buttonStyle={{ border: 'none', boxShadow: 'none' , backgroundColor:'transparent' }} // Supprime la bordure de l'indicateur
          />
        </Form.Item>
        {!validPhoneNumber && <p>Please enter a valid phone number.</p>}
      </Col>
   

      <Col span={12} style={{ marginBottom: '0px', textAlign: 'left' }}>
  <Form.Item
    name="country"
    rules={[{ required: true, message: 'Please select your country!' }]}
    style={{ border: 'none', borderBottom: '0.5px solid grey' }}
   
  > 
    <ReactSelect
      options={countryOptions}
      components={{ Option: CountryOption }}
      placeholder={<><GlobalOutlined style={{ marginRight: '8px' , color:'black',fontSize: '16px', }} /> Country</>}
      isClearable={true}
    
      styles={{
        control: (base) => ({
          ...base,
          border: 'none', // Supprime la bordure
          boxShadow: 'none', // Supprime l'ombre
          fontSize: '16px',
          color:'grey'
        }),
        input: (base) => ({
          ...base,
          textAlign: 'left', // Alignement à gauche
          fontSize: '16px',
          
         
        }),
        dropdownIndicator: (base) => ({
          ...base,
          border: 'none', // Supprime la bordure de l'indicateur de liste déroulante
          fontSize: '16px',
        }),
      }}
    />
   
  </Form.Item>
      </Col>
    </Row>
    <Row gutter={[16, 16]}>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="address"
               
                rules={[{ required: true, message: 'Please input your address!' }]}
            >
                <Input prefix={<EnvironmentOutlined/>} placeholder="Address" style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
            </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="code_postal"
              
                rules={[{ required: true, message: 'Please input your postal code!' }]}
            >
                <Input prefix={<EnvironmentOutlined/>} placeholder="Postal Code"style={{ border: 'none',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
            </Form.Item>
        </Col>
    </Row>

   
  
    <Row justify="space-between" align="middle"> {/* Utilisation d'une ligne de grille pour aligner les éléments et les espacer */}
    <Col>
      <Form.Item style={{ marginBottom: 0 }}> {/* Suppression de la marge inférieure du Form.Item */}
        <Button type="primary" htmlType="submit" style={{ backgroundColor:'#022452'}}>
          Register
        </Button>
      </Form.Item>
    </Col>
    {/* <Col>
    <span style={{ marginLeft: '250px', cursor: 'pointer' , color:'#004AAD'}} onClick={handleLinkClick}>
      Forgot your password?
    </span>
    </Col> */}
  </Row>
</Form>
                    </div>
                    <br />
                    <div>
                        <div className="line" style={{
                            position: 'absolute',
                            left: 210,
                            width: '40%',
                            height: '1px',
                            marginLeft: "60px",
                            backgroundColor: '#ccc',
                        }}>
                        </div>
                        <span style={{ color: 'grey',float:'center' }}>Create an account with </span>
                        <div style={{ float:'center' }}>
                            <img src={FacebookImage} alt="Facebook" style={{ width: '40px' }} />
                            <img src={GmailImage} alt="Instagram" style={{ width: '30px' }} />
                            <img src={LinkedinImage} alt="Linkedin" style={{ width: '40px' }} />
                        </div>
                        <div style={{ float:'center', fontFamily: 'cursive', color: 'grey', fontWeight: 'bold' }}> Don't have an account ?  
                        <span style={{ cursor: 'pointer',color:'#004AAD'  }} onClick={handleLoginClick}>
                        SignIn!  </span>
           </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;
