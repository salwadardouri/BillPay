import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input , Card,Alert} from 'antd';
import FacebookImage from '../images/fb.png';
import GmailImage from '../images/g.png';
import LinkedinImage from '../images/in.png';
import SignInImage from '../images/forgot1.png';
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
<div  className="media"  style={{ 
      backgroundColor: '#AAB8FD', 
      minHeight: '100vh', // Ensure the background color fills the viewport 
     }}>
      <div style={{paddingTop: '10px'}} >
      <Button type="primary" style={{ float: 'left', background: 'transparent', color: '#022452',marginTop:'280px' }} onClick={handleButtonClick}>
      <ArrowLeftOutlined />
    </Button>
        </div>

<div style={{ flex: 1, paddingTop: '30px', textAlign: 'left', margin: '10px' }}>
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
    
 
    </div>


    <div style={{marginLeft:'30px', marginRight:'40px', fontFamily:'Poppins',textAlign:'justify', color:'#004AAD', fontSize:'15px'}}>Enter Your Mail Send Code Your Mail Please Check And Varify If Your Mail Before Account Create You Have A Code Inbox. Create Code  & Your New Password  !</div>
   <div  style={{ marginTop: '30px' }}>
 
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
   
    name="email"
    
    rules={[
      {
        required: true,
        message: 'Please input your email!',
      },
    ]}
  >
    <Input prefix={<MailOutlined />}  placeholder=" Email" style={{ border: 'none', marginBottom:'30px',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparen
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%',borderBottom: '0.5px solid grey'}}/>
  </Form.Item> 
<Form.Item>
      <Button type="primary" htmlType="submit" onClick={() => { handleResetPassword()}} style={{width:'100%' , backgroundColor:'#022452'}}>
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
      <div style={{marginLeft: '50px',fontFamily: 'cursive', color:'grey', fontWeight: 'bold'}}> Wait, I remember my password...  ?  <a href="/SignIn" style={{ cursor: 'pointer',color:'#004AAD' }}>Click here</a></div>

    
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