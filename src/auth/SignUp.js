import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, Row, Col, Select,Alert } from 'antd';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import FacebookImage from '../images/fb.png';
import GmailImage from '../images/g.png';
import LinkedinImage from '../images/in.png';
import './media.css'; 
const { Option } = Select;

const SignUp = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [clientType, setClientType] = useState("Client Physique");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLoginClick= () => {
      navigate('/SignIn');
    };
  
    const handleLinkClick = () => {
      navigate('/ForgotPassword');
    };

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
          const { fullname, email, password, country, num_phone, address, code_postal, matricule } = values;
  
          // Format the phone number as desired
          let formattedPhoneNumber = `+${num_phone.replace(/\s/g, '')}`;
  
          const postData = {
              fullname,
              email,
              password,
              country,
              num_phone: formattedPhoneNumber,
              address,
              code_postal,
              roles: ["CLIENT"],
              matricule_fiscale: clientType === "Client Morale" ? matricule : undefined,
          };
  
          const response = await fetch('http://localhost:5000/auth/signupclient', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(postData),
              credentials: 'include',
          });
  
          const responseData = await response.json();
  
          if (response.ok) {
              console.log('User created successfully', responseData);
              setSuccessMessage('User created successful');
          setTimeout(() => {
              navigate('/Client');
            }, 3000);
        } else {
            // Handle errors
            console.error('Email already exists', responseData);
            setErrorMessage('Email already exists');
            setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 1 second
          }
        } catch (error) {
          console.error('An error occurred', error);
          setErrorMessage('An error occurred');
          setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 1 second
        }
      };
  
  

    const handleClientTypeChange = (value) => {
        setClientType(value);
    };

    return (
        <div className="media" style={{ flex: 1, paddingTop: '20px', textAlign: 'right',backgroundColor:'#EEEEEE' }}>
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

                    {successMessage && <Alert message={successMessage} type="success" showIcon/>}
{errorMessage && <Alert message={errorMessage} type="error" showIcon />}

<br/>
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
              label="Tax Identification Number"
              rules={[
                  {
                      required: clientType === "Client Morale",
                      message: 'Please input your Tax Identification Number!'
                  }
              ]}
          >
              <Input  placeholder="Please input your Tax Identification Number !" />
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
                label="Fullname"
                rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
            >
                <Input placeholder="Please input your FullName !"/>
            </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '0px' }}>
                                    <Form.Item
                                        name="email"
                                        label="E-mail"
                                        rules={[
                                            { type: 'email', message: 'The input is not valid E-mail!' },
                                            { required: true, message: 'Please input your E-mail!' },
                                        ]}>
                                        <Input placeholder="Please input your Email!" />
                                    </Form.Item>
                                </Col>
 
    </Row>

    <Row gutter={[16, 16]}>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                hasFeedback
            >
                <Input.Password placeholder="Please input your Password!"/>
            </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '0x' }}>
            <Form.Item
                name="confirm"
                label="Confirm Password"
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
                <Input.Password placeholder="Please confirm your password!" />
            </Form.Item>
        </Col>
    </Row>

    <Row gutter={[16, 16]}>

                                <Col span={12} style={{ marginBottom: '0px' }}>
                                    <Form.Item
                                        name="num_phone"
                                        label="Phone Number"
                                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                                    >
                                        <PhoneInput
                                            country={'us'}
                                            value={phoneNumber}
                                            onChange={handleChangePhoneNumber}
                                            inputProps={{
                                                required: true,
                                            }}
                                        />
                                    </Form.Item>
                                    {!validPhoneNumber && (
                                        <p>Please enter a valid phone number.</p>
                                    )}
                                </Col>
        <Col span={12} style={{ marginBottom: '0px' }}>

    <Form.Item
      name="country"
      label="Country"
      rules={[{ required: true, message: 'Please input your country!' }]}
    >
      <Input />
    </Form.Item>
  </Col>
    </Row>

    <Row gutter={[16, 16]}>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please input your address!' }]}
            >
                <Input  placeholder="Please input your Address!" />
            </Form.Item>
        </Col>
        <Col span={12} style={{ marginBottom: '0px' }}>
            <Form.Item
                name="code_postal"
                label="Postal Code"
                rules={[{ required: true, message: 'Please input your postal code!' }]}
            >
                <Input placeholder="Please input your Postal Code!" />
            </Form.Item>
        </Col>
    </Row>

   
  
    <Row justify="space-between" align="middle"> {/* Utilisation d'une ligne de grille pour aligner les éléments et les espacer */}
    <Col>
      <Form.Item style={{ marginBottom: 0 }}> {/* Suppression de la marge inférieure du Form.Item */}
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Col>
    <Col>
    <span style={{ marginLeft: '250px', cursor: 'pointer' , color:'blue'}} onClick={handleLinkClick}>
      Forgot your password?
    </span>
    </Col>
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
                        <span style={{ cursor: 'pointer',color:'blue' }} onClick={handleLoginClick}>
                        SignIn!  </span>
           </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SignUp;
