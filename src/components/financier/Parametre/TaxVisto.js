import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, Button, Tabs, Modal, Form,  Select,InputNumber,Input, Space, message, Col, Row } from 'antd';
import { DeleteOutlined, EditOutlined, UserAddOutlined } from '@ant-design/icons';
import axios from 'axios';
import { debounce } from 'lodash';//pour search pro 
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
const TaxVisto = () => {
  const [tvaData, setTvaData] = useState([]);
  const [timbreData, setTimbreData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('Tva');

  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState(''); 
  const [devise, setDevise] = useState([]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    fetchData();
    fetchDevise();
  }, []);


  const fetchDevise = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devise');
      setDevise(response.data);
    } catch (error) {
      console.error('Error fetching Devise:', error);
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const [tvaResponse, timbreResponse] = await Promise.all([
        axios.get('http://localhost:5000/tva'),
        axios.get('http://localhost:5000/timbre'),
      ]);
  
      const tvaDataWithTrueStatus = tvaResponse.data.filter(tva => tva.status === true);
      setTvaData(tvaDataWithTrueStatus);
  
      const timbreDataWithTrueStatus = timbreResponse.data.filter(timbre => timbre.status === true);
      setTimbreData(timbreDataWithTrueStatus);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  

  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateRecord(values);
    } else {
      await createRecord(values);
    }
    form.resetFields();
    setEditRecord(null);
    setOpen(false);
    fetchData();
  };

  const createRecord = async (values) => {
    values.status = true;
    const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
    try {
      await axios.post(`http://localhost:5000/${url}`, values);
      message.success(`${activeTabKey} created successfully`);
    } catch (error) {
      message.error(`Failed to create ${activeTabKey}`);
    }
  };

  
  const updateRecord = async (values) => {
    values.status = true;
    const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
    try {
      await axios.put(`http://localhost:5000/${url}/${editRecord._id}`, values);
      message.success(`${activeTabKey} updated successfully`);
    } catch (error) {
      message.error(`Failed to update ${activeTabKey}`);
    }
  };

  



  const deleteRecord  = async (record) => {
    try {
      const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
      const response = await fetch(`http://localhost:5000/${url}/activated/${record._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // Ajoutez l'en-tête Content-Type
        },
        body: JSON.stringify({ status: false }) // Définissez le corps de la requête avec le statut false
      });
      if (response.ok) {
        message.success(`${activeTabKey} deleted successfully`);
        fetchData();
      } else {
        throw new Error('Failed to delete data');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error(`Failed to delete ${activeTabKey}`);    }
  };
  

  const handleEditRecord = (record) => {
    setEditRecord(record);
    setOpen(true);
    form.setFieldsValue({
      
      Valeur:record.Valeur,
      deviseId: record.devise?._id,
      Pourcent_TVA:record.Pourcent_TVA,
    });
  };

  
  const handleModalClose = () => {
    setEditRecord(null);
    form.resetFields();
    setOpen(false);
  };
  const onSearch = debounce(async (query) => {
    setLoading(true);
    try {
      if (activeTabKey === 'Tva') {
        if (query.trim() === '') {
          fetchData(); // reload full data if search text is empty
        } else {
          const res = await axios.post(`http://localhost:5000/tva/search?key=${query}`);
          setTvaData(res.data);
        }
      } else {
        if (query.trim() === '') {
          fetchData();
        } else {
          const res = await axios.post(`http://localhost:5000/timbre/search?key=${query}`);
          setTimbreData(res.data);
        }
      }
    } catch (error) {
      message.error('Error during search');
    } finally {
      setLoading(false);
    }
  }, 300);

  const columns = {
    Tva: [
      { 
        title: 'Pourcent_TVA', 
        dataIndex: 'Pourcent_TVA', 
        key: 'Pourcent_TVA', 
        render: (pourcentTva) => `${pourcentTva}%`, // Ajout du symbole '%' à côté de la valeur
      },
      {
        title: 'Actions',
        width: 50,
        align: 'left',
        render: (_, record) => (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRecord(record)} />
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => deleteRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    Timbre: [
      { title: 'Valeur', dataIndex: 'Valeur', key: 'Valeur' },
      {
        title: 'Devise',
        dataIndex: ['devise', 'Symbole'],
        key: 'devise_Symbole',
    
      },
      {
        title: 'Actions',
        width: 50,
        align: 'left',
        render: (_, record) => (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditRecord(record)} />
            <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => deleteRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      },
    ],
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16, float: 'right', backgroundColor: '#022452' }}
     
      >
        New Record
      </Button>
      <Search
        placeholder="Search "
        value={searchText}
        onChange={(e) => {
          const text = e.target.value;
          setSearchText(text);
          onSearch(text);
        }}
        style={{ maxWidth: 780, marginBottom: 20 }}
      />
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} style={{marginTop:"30px"}}>
        <TabPane tab="Tva" key="Tva">
          <Table dataSource={tvaData} columns={columns.Tva} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
        <TabPane tab="Timbre" key="Timbre">
          <Table dataSource={timbreData} columns={columns.Timbre} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
      </Tabs>
      <Modal
  title={editRecord ? 'Edit Record' : 'Create New Record'}
  visible={open}
  onCancel={handleModalClose}
  footer={null}
>
  <Form form={form} onFinish={handleFormSubmit}>
    {activeTabKey === 'Tva' && (
      <Row>
  <Col>
    <Form.Item
      name="Pourcent_TVA"
      label={
        <span>
          TVA (%)
        </span>
      }
      rules={[
        { required: true, message: 'Please enter the TVA percentage.' },
  
      ]}
    >
        <InputNumber 
      
          style={{ width: '100%' }}
          placeholder="TVA percentage" 
        />

    </Form.Item>
  </Col>
</Row>

    )}
    {activeTabKey === 'Timbre' && (
      <>
        <Form.Item
          name="Valeur"
          rules={[
            { required: true, message: 'Please enter the stamp value.' },
          
          ]}
        >
   
          <InputNumber style={{ width: '100%' }} placeholder="Stamp value" />
        </Form.Item>
        <Form.Item
          name="deviseId"
          label="Devise"
          rules={[{ required: true, message: 'Please select a Devise' }]}
        >  
          <Select  name="deviseId" placeholder="Select a Devise">
            {devise.map(devise => (
              <Option key={devise._id} value={devise._id}>
                <div>
                  <span>
                    {devise.Nom_D} ({devise.Symbole})
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </>
    )}
    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ width: '100px', marginTop: '20px', backgroundColor: '#022452' }}>
        {editRecord ? 'Update' : 'Create'}
      </Button>
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
};

export default TaxVisto;
