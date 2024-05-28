import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input , Card ,Alert} from 'antd';
import FacebookImage from '../images/fb.png';
import GmailImage from '../images/g.png';
import LinkedinImage from '../images/in.png';
import SignInImage from '../images/login1.png';
import './SignIn.css'; 
import { ArrowLeftOutlined,MailOutlined,LockOutlined  } from '@ant-design/icons';


const SignIn = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };
    const handleButtonClick = () => {
      navigate('/');
    };
    const handleRegisterClick = () => {
      navigate('/SignUp');
    };
    const handleLinkClick = () => {
      navigate('/ForgotPassword');
    };
    const onLoginFinish = async (values) => {
      try {
        const { email, password } = values;
    
        // Prepare data based on your API requirements
        const postData = {
          email,
          password,
        };
    
        // Make a POST request to your login API
        const response = await fetch('http://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
          credentials: 'include',
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          // Handle successful login
          console.log('Login successful', responseData);
    
          // Set success message and navigate after 1 second
          setSuccessMessage('Login successful');
          setTimeout(() => {
            const { roles } = responseData.user;
            if (roles.includes('ADMIN')) {
              navigate('/DashAdmin');
            } else if (roles.includes('FINANCIER')) {
              navigate('/DashFinancier');
            } else if (roles.includes('CLIENT')) {
              navigate('/Client');
            } else {
              console.error('Unknown role:', roles);
            }
          }, 3000);
        } else {
          // Handle errors
          console.error('Error logging in', responseData);
          setErrorMessage('Invalid credentials');
          setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 1 second
        }
      } catch (error) {
        console.error('An error occurred', error);
        setErrorMessage('An error occurred');
        setTimeout(() => setErrorMessage(''), 2000); // Clear error message after 1 second
      }
    };

    
    
   
  return (

<div  className="signin"  style={{ 
      backgroundColor: '#EEEEEE',
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
             <div style={{ float: 'right', textAlign: 'right', width: '50%', marginTop: '10px' }}>
  
      <div style={{ fontFamily: 'cursive', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold'}}>
        <h2>Welcome Back !</h2>
        <p style={{ color: 'grey'}}>Sign in to continue to BillPayVisto </p>
      </div>
      <div  style={{ marginTop: '40px' }}>
      {successMessage && <Alert message={successMessage} type="success" showIcon />}
{errorMessage && <Alert message={errorMessage} type="error" showIcon/>}

         <Form name="basic" form={form}  layout="vertical" colon={false} style={{width: '85%', marginLeft:'30px', marginTop:'80px'}}
               initialValues={{remember: true,}}
               onFinish={onLoginFinish} 
               onFinishFailed={onFinishFailed}
               autoComplete="off" >
            <Form.Item  name="email"
                     rules={[
                      {
        required: true,
        message: 'Please input your email!',
      },
    ]}
  >
    <Input prefix={<MailOutlined />}  placeholder=" Email" style={{ border: 'none', borderBottom: '0.5px solid grey',
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%'}}/>
  </Form.Item>

  <Form.Item

    name="password"
    rules={[
      {
        required: true,
        message: 'Please input your password!',
      },
    ]}
  >

    <Input.Password prefix={<LockOutlined/>}  placeholder="Password "  style={{ border: 'none', borderBottom: '1px solid grey', 
  boxShadow: 'none', // Élimine l'ombre si nécessaire
  backgroundColor: 'transparent', // Peut également rendre le fond transparent
  outline: 'none',fontSize: '16px', padding: '10px', height: '40px',width: '100%' }}/>
  </Form.Item>
<Form.Item>
      <Button type="primary" htmlType="submit" style={{width:'100%' , backgroundColor:'#022452'}}>
        Submit
      </Button>
  
  </Form.Item>
</Form>
<span style={{ marginRight: '35px', cursor: 'pointer' , color:'#004AAD'}} onClick={handleLinkClick}>
      Forgot your password?
    </span>

</div>
<br/>
<div>
<div className="line" style={{ position: 'absolute',
     
     left:0,
      width: '40%',
      height: '1px',
      marginLeft:"60px",
      backgroundColor: '#ccc',}}>
      </div> <span style={{color:'grey', marginRight:"190px"}}>Sign in with </span>
      <div style={{marginRight:"170px"}}>
        
          <img src={FacebookImage} alt="Facebook" style={{ width: '40px' }} />
          <img src={GmailImage} alt="Instagram" style={{ width: '30px' }} />
          <img src={LinkedinImage} alt="Linkedin" style={{ width: '40px' }} />
        </div>
      <div style={{marginRight:"100px",fontFamily: 'cursive', color:'grey', fontWeight: 'bold'}}> Don't have an account ?    <span style={{ cursor: 'pointer',color:'#004AAD' }} onClick={handleRegisterClick}>
      Register now!
    </span></div>

    
    </div>
    </div>
    <div style={{ float: 'left', textAlign: 'left', width: '50%', marginTop: '10px' }}>
    <img src={SignInImage} alt="SignIn" style={{ width: '100%', marginTop:"30px",height:'100%'  }} />
        </div>
    </Card>
    </div>
    </div>
 
  );
};
export default SignIn;