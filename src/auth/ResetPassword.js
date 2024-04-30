import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Form, Input, Space, Alert, message ,Col } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './media.css'; 
import SignInImage from '../images/password.jpg';


const { Title, Text } = Typography;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [form] = Form.useForm(); // Définir l'objet form
  const resetCodeExpiration = searchParams.get('resetCodeExpiration');
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [countdownInterval, setCountdownInterval] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  useEffect(() => {
    if (resetCodeExpiration) {
      const expirationDate = new Date(resetCodeExpiration);
      const now = new Date();
      const differenceInSeconds = Math.floor((expirationDate - now) / 1000);
      setSecondsRemaining(differenceInSeconds);

      // Démarrez un compte à rebours pour afficher l'alerte lorsque le temps est écoulé
      const countdownInterval = setInterval(() => {
        setSecondsRemaining((prevSeconds) => {
          if (prevSeconds <= 0) {
            clearInterval(countdownInterval); // Arrête le compte à rebours lorsque secondsRemaining atteint 0
            setErrorMessage('Your timeout has expired. Click the button below to request a new code.');
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      // Nettoyez l'intervalle lorsque le composant est démonté ou lorsque le compte à rebours atteint 0
      return () => clearInterval(countdownInterval);
    }
  }, [resetCodeExpiration]);


  useEffect(() => {
    if (secondsRemaining === 0) {
      clearInterval(countdownInterval);
      setErrorMessage('Your timeout has expired. Click the button below to request a new code.');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  }, [secondsRemaining, countdownInterval]);

  const resetSecondsRemaining = () => {
    setSecondsRemaining(0);
  };

  const handleCodeSubmit = async (values) => {
    // Gérer la soumission du code ici
    try {
      // Soumettre le code pour vérification
      const response = await fetch('http://localhost:5000/auth/compare-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: values.code }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Code verification successful', responseData);
        setStep(2); // Passer à l'étape suivante
  
        // Réinitialiser le compte à rebours
        clearInterval(countdownInterval);
        const expirationDate = new Date(responseData.resetCodeExpiration);
        const now = new Date();
        const differenceInSeconds = Math.floor((expirationDate - now) / 1000);
        setSecondsRemaining(differenceInSeconds);
  
        // Lancer un nouveau compte à rebours
        const interval = setInterval(() => {
          setSecondsRemaining((prev) => prev - 1);
        }, 1000);
        setCountdownInterval(interval);
  
        setErrorMessage('');
      } else {
        console.error('Error verifying code', responseData);
        message.error(responseData.message); // Afficher l'erreur
        // setTimeout(() => {
        //   setErrorMessage('');
        // }, 3000); // Supprime le message d'erreur après 3 secondes
      }
    } catch (error) {
      console.error('An error occurred', error);
      // Gérer l'erreur
    }
  };

  const handleResetPasswordSubmit = async (values) => {
    try {
      const response = await fetch('http://localhost:5000/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword: values.newPassword }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log('Password reset successful', responseData);
        // Afficher une alerte de succès
        setSuccessMessage('Password reset successful');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/SignIn'); // Rediriger vers la page de connexion après la réinitialisation du mot de passe
        }, 3000); // Supprime le message de succès après 3 secondes
      }
    } catch (error) {
      console.error('An error occurred', error);
      // Gérer l'erreur
    }
  };

  const handleResetPasswordRequest = async () => {
    try {
      // Envoyer une demande pour un nouveau code
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
        setTimeout(() => setSuccessMessage(''), 2000);
        // Réinitialiser secondsRemaining à 0
        resetSecondsRemaining();
     
        // Réinitialiser le compte à rebours
        clearInterval(countdownInterval);
        const expirationDate = new Date(responseData.resetCodeExpiration);
        const now = new Date();
        const differenceInSeconds = Math.floor((expirationDate - now) / 1000);
        setSecondsRemaining(differenceInSeconds);

        // Lancer un nouveau compte à rebours
        const interval = setInterval(() => {
          setSecondsRemaining((prev) => prev - 1);
        }, 1000);
        setCountdownInterval(interval);

      } else {
        if (responseData.statusCode === 400 && responseData.message === 'resendError') {
          console.error('resendError');
          setInfoMessage('Please wait for a while before being able to resend another link to this email!');
          setTimeout(() => setInfoMessage(''), 5000);
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
        >   {secondsRemaining === 0 && errorMessage && (
          <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
          >
            <Alert
              message="Warning"
              description={errorMessage}
              type="warning"
              showIcon
              closable
            />
          </Space>
        )}
        {successMessage && (
          <Space
            direction="vertical"
            style={{
              width: '100%',
            }}
          >
            <Alert
              message="Success"
              description={successMessage}
              type="success"
              showIcon
              closable
            />
          </Space>
        )}
         {infoMessage && <Alert message={infoMessage} type="info" showIcon/>}
          <Title>{step === 1 ? 'Code Verification' : 'Reset Password'}</Title>
          
          {step === 1 ? (
            <>
              <Text strong>Seconds remaining until reset code expiration: <span style={{ color: 'red' }}>{secondsRemaining} </span> </Text>
              <p style={{ color: 'grey' }}>We have sent a code to your email address: <span style={{ color: 'blue' }}>{email}</span></p>
              <Form form={form} onFinish={handleCodeSubmit}>
                <Form.Item
                  name="code"
                  rules={[{ required: true, message: 'Please enter the code received by email.' }]}
                >
                  <Input placeholder="Verification Code" />
                </Form.Item>
                <Form.Item>

                  <Button type="link" onClick={handleResetPasswordRequest}>Request a new code</Button>
                  <Button type="primary" htmlType="submit" onClick={() => { setErrorMessage(''); handleCodeSubmit() }}>Submit</Button>
                </Form.Item>
              </Form>
            </>
          ) : (
            <>
            <div style={{ fontFamily: 'cursive', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold'}}>
    
    <p style={{ color: 'grey'}}>Reset password with BillPayVisto </p> 
  
    </div>
 
   
    <div style={{ float: 'left', textAlign: 'left', width: '50%', marginTop: '10px' }}>
    <Col span={20}   style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px',  marginLeft:'30px', fontFamily: 'Inter',backgroundColor:'#FFF67E' , textAlign:'justify'}}>
<span style={{marginLeft:'20px' , marginRight:'20px'}}>The password should be a <span style={{color:'red'}}> minimum of 6 characters </span>. To make it stronger, use both uppercase and lowercase letters, numbers, and symbols such as <span style={{color:'red '}}>! ? $ ù % @ | &  </span>
</span></Col>  

<div  style={{ marginTop: '40px' }}>
              <Form onFinish={handleResetPasswordSubmit} style={{
        width: '85%', marginLeft:'30px'
    }}>
              
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
                  <Button type="primary" htmlType="submit"  style={{ width:'100%'}} >Reset Password</Button>
                </Form.Item>
                
              </Form>
              </div>
          
              </div>
              <div style={{ float: 'right', textAlign: 'right', width: '50%' }}>
    <img src={SignInImage} alt="SignIn" style={{ width: '100%', marginTop:"0px",height:'100%' }} />
    </div>
            </>
          )}
    
        </Card>
        </div>

    </div>
  );
};

export default ResetPassword;
