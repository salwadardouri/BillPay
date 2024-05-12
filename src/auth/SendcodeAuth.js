import React, { useState } from 'react';
import { Card, Button, Typography, Form, Input, Space, Alert, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './media.css';

const { Title } = Typography;

const SendcodeAuth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');

    const [errorMessage, setErrorMessage] = useState('');
    const [form] = Form.useForm(); // Définir l'objet form
 // eslint-disable-next-line
    const [secondsRemaining, setSecondsRemaining] = useState(0);

    const handleCodeSubmit = async (values) => {
        try {
            // Soumettre le code pour vérification
            const response = await fetch('http://localhost:5000/auth/compare-code-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: values.code }),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Code verification successful', responseData);
                message.success('Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.');
                setTimeout(() => {
                    navigate('/Client');
                }, 3000);
                setErrorMessage('');
            } else {
                console.error('Error verifying code', responseData);
                message.error('Votre code est incorrect. Veuillez réessayer.'); // Message d'erreur en cas de code incorrect
                setErrorMessage(responseData.message);
            }
       
        } catch (error) {
            console.error('An error occurred', error);
            // Gérer l'erreur
        }
    };

    return (
        <div className="media" style={{ backgroundColor: '#EEEEEE', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
                >
                    {secondsRemaining === 0 && errorMessage && (
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

                    <Title>Code Verification</Title>
                    <>
                        <p style={{ color: 'grey' }}>We have sent a code to your email address: <span style={{ color: 'blue' }}>{email}</span></p>
                        <Form form={form} onFinish={handleCodeSubmit}>
                            <Form.Item
                                name="code"
                                rules={[{ required: true, message: 'Please enter the code received by email.' }]}
                            >
                                <Input placeholder="Verification Code" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" style={{ backgroundColor: '#022452' }} htmlType="submit">Submit</Button>
                            </Form.Item>
                        </Form>
                    </>
                </Card>
            </div>
        </div>
    );
};

export default SendcodeAuth;
