import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input , Card ,Col,Alert} from 'antd';
import FacebookImage from '../images/fb.png';
import GmailImage from '../images/g.png';
import LinkedinImage from '../images/in.png';
import SignInImage from '../images/forgot.png';
import { ArrowLeftOutlined   } from '@ant-design/icons';
import { MailOutlined } from '@ant-design/icons';
import './media.css'; 
//import Title from 'antd/lib/typography/Title';
const ForgotPassword = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const handleButtonClick = () => {
      navigate('/');
    };

    const handleResetPassword = async () => {
      try {
  
        const email = form.getFieldValue('email'); // Récupérer l'email depuis le champ d'email du formulaire
        const response = await fetch('http://localhost:5000/auth/reset-password-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          console.log('Reset password request successful', responseData);
          setSuccessMessage('Please check your inbox for an email containing a link to reset your password. Click on the link to access the password reset interface');
          setTimeout(() => {
            navigate(`/ResetPassword?email=${email}&resetCodeExpiration=${responseData.resetCodeExpiration}`);
          }, 4000);
        } else {
          if (responseData.statusCode === 400 && responseData.message === 'resendError') {
            console.error('resendError');
            setInfoMessage('Please wait for a while before being able to resend another link to this email!');
            setTimeout(() => setInfoMessage(''), 2000);
          } else {
            console.error('User not found. Please verify the email address entered and try again', responseData);
            setErrorMessage('User not found. Please verify the email address entered and try again');
            setTimeout(() => setErrorMessage(''), 3000);
          }
        }
      } catch (error) {
        console.error('An error occurred', error);
        setErrorMessage('An error occurred');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    };
  return (
    <div className="media" style={{backgroundColor:'#EEEEEE' }}>
      <div style={{paddingTop: '10px'}}>
         
      <Button type="primary" shape="circle" style={{ float: 'left', background: 'white', color: 'blue' , marginTop:'300px'}} onClick={handleButtonClick}>
      <ArrowLeftOutlined />
    </Button>
        </div>
<div style={{ flex: 1, paddingTop: '60px', textAlign: 'left', margin: '10px' }}>
    <Card
          style={{
             textAlign:'left',
            width: '70%', // Adjust the width as needed
            height: '100%',
            margin: '0 auto',
            boxShadow: '0 1px 20px rgba(0, 0, 255, 0.3)',
            border: 0,
            display: 'flex',
            flexDirection: 'column',
      
          }}>
 <div style={{ float: 'left', textAlign: 'left', width: '50%', marginTop: '10px' }}>
 {successMessage && <Alert message={successMessage} type="success" showIcon/>}
   {infoMessage && <Alert message={infoMessage} type="info" showIcon/>}
 
{errorMessage && <Alert message={errorMessage} type="error"   showIcon/>}
    <div style={{ fontFamily: 'cursive', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold'}}>
    <h2>Forgot Password ?</h2>
    <p style={{ color: 'grey'}}>Reset password with BillPayVisto </p> 
    <br/>
    
 <Col span={20}   style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px',  marginLeft:'30px', fontFamily: 'Inter',backgroundColor:'#FFE3CA' , textAlign:'justify'}}>
<span style={{marginLeft:'20px' , marginRight:'20px'}}>Enter Your Mail Send Code Your Mail Please Check And Varify If Your Mail Before Account Create You Have A Code Inbox. Create Code  & Your New Password  !</span></Col>

    </div>
   <div  style={{ marginTop: '40px' }}>
 
<Form 
 name="basic"
 form={form}
     layout="vertical"
    
    colon={false}
    style={{
        width: '85%', marginLeft:'30px'
    }}
    initialValues={{
        remember: true,
      }}
  
  onFinishFailed={onFinishFailed}
  autoComplete="off"
  >
<Form.Item
    label="Enter your E-mail"
    name="email"
    
    rules={[
      {
        required: true,
        message: 'Please input your email!',
      },
    ]}
  >
     <Input    prefix={<MailOutlined />} placeholder="Please enter your E-mail!"  />
  </Form.Item> 
<Form.Item>
      <Button type="primary" htmlType="submit" onClick={() => { handleResetPassword()}} style={{width:'100%'}}>
      Send Reset Email
      </Button>
  
  </Form.Item>
</Form>
</div>
<div>
<div className="line" style={{ position: 'absolute',
     
     left:0,
      width: '40%',
      height: '1px',
      marginLeft:"60px",
      backgroundColor: '#ccc',}}>
      </div> <span style={{color:'grey', marginLeft:"185px"}}>Sign in with </span>
      <div style={{marginLeft: '170px'}}>
        
          <img src={FacebookImage} alt="Facebook" style={{ width: '40px' }} />
          <img src={GmailImage} alt="Instagram" style={{ width: '30px' }} />
          <img src={LinkedinImage} alt="Linkedin" style={{ width: '40px' }} />
        </div>
      <div style={{marginLeft: '50px',fontFamily: 'cursive', color:'grey', fontWeight: 'bold'}}> Wait, I remember my password...  ?  <a href="/SignIn">Click here</a></div>

    
    </div>
    </div>
      <div style={{ float: 'right', textAlign: 'right', width: '50%', marginTop: '10px' }}>
    <img src={SignInImage} alt="SignIn" style={{ width: '100%', marginTop:"30px",height:'100%' }} />
    </div>
    </Card>
    </div>
    </div>
 
  );
};
export default ForgotPassword ;