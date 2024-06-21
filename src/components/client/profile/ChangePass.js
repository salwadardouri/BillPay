import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import Header from '../HeaderClient';

interface User {
  id: string;
  email: string;
}

const ModifierPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      // Fetch user profile using the token
      const userProfile = await getUserProfile(token);
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Call API to modify password
      const response = await axios.post(
        'http://localhost:5000/auth/ModifierPassword',
        {
          email: userProfile.email,
          Password: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      message.success(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error('An error occurred while changing password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await axios.get('http://localhost:5000/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  return (
    <div>
          <Header />
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh',marginTop:'-50px' }}>
    <Card title="Change Password" 
    style={{width:'500px', marginRight:'50px', marginLeft:'50px'}}>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ oldPassword: '', newPassword: '' }}
      >
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[{ required: true, message: 'Please enter your old password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: 'Please enter your new password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{backgroundColor: '#022452'}}>
            Modify Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
    </div>
    </div>
  );
};

export default ModifierPassword;
