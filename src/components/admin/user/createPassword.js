import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Col, Typography } from 'antd';
import { useParams } from 'react-router-dom';
const { Title } = Typography;
const PasswordImage = require('../../../images/password.jpg');

function CreatePassword() {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  const handleResetPasswordSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/clients/create-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: values.newPassword,
          token, // Envoyer le token avec la requête
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      message.success('Password reset successful');
      setTimeout(() => {
        window.location.href = '/SignIn'; // Redirection
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      message.error(error.message || 'An error occurred while resetting the password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div  className="media" style={{ backgroundColor:'#EEEEEE',minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

    <div style={{ flex: 1, paddingTop: '30px', textAlign: 'center', margin: '20px' }}>
        <Card
          style={{
            textAlign: 'center',
            width: '70%', // Ajustez la largeur au besoin
            height: '100%',
            margin: '0 auto',
            boxShadow: '0 1px 20px rgba(0, 0, 255, 0.3)',
            border: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Centrer tabListNoTitle horizontalement
          }}
        >        <>
       
         <div style={{ fontFamily: 'cursive', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold'}}>
         <Title>{'Create Password'}</Title>
    <p style={{ color: 'grey'}}>Create your password with BillPayVisto </p> 
  
    </div>
 
   
    <div style={{ float: 'left', textAlign: 'left', width: '50%', marginTop: '10px' }}>
    <Col span={20}   style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px',  marginLeft:'30px', fontFamily: 'Inter',backgroundColor:'#FFF67E' , textAlign:'justify'}}>
<span style={{marginLeft:'20px' , marginRight:'20px'}}>The password should be a <span style={{color:'red'}}> minimum of 6 characters </span>. To make it stronger, use both uppercase and lowercase letters, numbers, and symbols such as <span style={{color:'red '}}>! ? $ ù % @ | &  </span>
</span></Col>  

<div  style={{ marginTop: '40px' }}>
        <Form onFinish={handleResetPasswordSubmit}style={{ width: '85%', marginLeft:'30px' }}>
        
        <Form.Item
                  name="newPassword"
                  rules={[{ required: true, message: 'Please enter your new password.' }]}
                >
                  <Input.Password placeholder="Please enter a new Password" />
                </Form.Item>


                <Form.Item
                name="confirm"
                dependencies={['newPassword']}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The passwords do not match!'));
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Please confirm your password!" />
            </Form.Item>
          
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width:'100%'}}>
              Reset Password
            </Button>
          </Form.Item>
    
        </Form>
        </div>
          
          </div>
          <div style={{ float: 'right', textAlign: 'right', width: '50%' }}>

</div>
<div style={{ float: 'right', textAlign: 'right', width: '50%' }}>
    <img src={PasswordImage} alt="Password" style={{ width: '100%', marginTop:"0px",height:'100%' }} />

    </div>
    </>
    </Card>
    </div>

</div>
  );
}

export default CreatePassword;
