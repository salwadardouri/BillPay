import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, Button, Tabs, Modal, Badge,Form,Checkbox,  Select,InputNumber,Input, Space, message, Col, Row } from 'antd';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState(''); 
  const [devise, setDevise] = useState([]);
  const [status, setStatus] = useState(null);
  const [tvaStatusFilter, setTvaStatusFilter] = useState('all');
  const [timbreStatusFilter, setTimbreStatusFilter] = useState('all');
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
      setTvaData(tvaResponse.data);
      setTimbreData(timbreResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setStatus(value === 'true');
  };
  useEffect(() => {
    if (editRecord) {
      setStatus(editRecord.status);
    }
  }, [editRecord]);


  const handleFormSubmit = async (values) => {
    if (editRecord) {
      await updateRecord(values);
    } else {
      await createRecord(values);
    }
    form.resetFields();
    setEditRecord(null);
    setModalVisible(false);
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
  
    const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
    try {
      await axios.put(`http://localhost:5000/${url}/${editRecord._id}`, values);
      message.success(`${activeTabKey} updated successfully`);
    } catch (error) {
      message.error(`Failed to update ${activeTabKey}`);
    }
  };

  

  const deleteRecord = async (record) => {
    const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
    try {
      await axios.delete(`http://localhost:5000/${url}/${record._id}`);
      message.success(`${activeTabKey} deleted successfully`);
      fetchData();
    } catch (error) {
      message.error(`Failed to delete ${activeTabKey}`);
    }
  };

  const handleEditRecord = (record) => {
    setEditRecord(record);
    setModalVisible(true);
    form.setFieldsValue({
      
      Valeur:record.Valeur,
      deviseId: record.devise?._id,
      Pourcent_TVA:record.Pourcent_TVA,
      status:record.status
    });
  };

  const handleModalClose = () => {
    setEditRecord(null);
    form.resetFields();
    setModalVisible(false);
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
  const handleTvaStatusChange = (value) => {
    setTvaStatusFilter(value);
};
const handleTimbreStatusChange = (value) => {
  setTimbreStatusFilter(value);
};
  const columns = {
    Tva: [
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status) => (
            <Badge dot style={{ backgroundColor: status ? 'green' : 'red' }} />
        ),
    },
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
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status) => (
            <Badge dot style={{ backgroundColor: status ? 'green' : 'red' }} />
        ),
    },
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
        onClick={() => setModalVisible(true)}
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
        <Select defaultValue="all" style={{ width: 150, marginBottom: 20 ,marginTop:"10px"}} onChange={handleTvaStatusChange}>
                            <Option value="all">All</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
          <Table 
           dataSource={
            tvaStatusFilter === 'all' ? tvaData : tvaData.filter(tvaData =>  tvaData.status === (tvaStatusFilter === 'activated'))
        }
          columns={columns.Tva} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
        <TabPane tab="Timbre" key="Timbre">
        <Select defaultValue="all" style={{ width: 150, marginBottom: 20 ,marginTop:"10px"}} onChange={handleTimbreStatusChange}>
                            <Option value="all">All of status</Option>
                            <Option value="activated">Activated</Option>
                            <Option value="inactivated">Inactivated</Option>
                        </Select>
          <Table         dataSource={
            timbreStatusFilter === 'all' ? timbreData : timbreData.filter(timbreData => timbreData.status === (timbreStatusFilter === 'activated'))
        }
          columns={columns.Timbre} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
      </Tabs>
      <Modal
  title={editRecord ? 'Edit Record' : 'Create New Record'}
  visible={modalVisible}
  onCancel={handleModalClose}
  footer={null}
>
  <Form form={form} onFinish={handleFormSubmit}>
    {activeTabKey === 'Tva' && (
      <>
        {editRecord && (
          <Row>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the status!' }]}
                initialValue={true}
              >
                <Row>
                  <Col span={12}>
                    <Checkbox
                      checked={status === true}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'green' : 'red' }}
                      value={true}
                    >
                      Activated
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={status === false}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'red' : 'green' }}
                      value={false}
                    >
                      Inactivated
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            <Form.Item
              name="Pourcent_TVA"
              label={<span>TVA (%)</span>}
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
      </>
    )}

    {activeTabKey === 'Timbre' && (
      <>
        {editRecord && (
          <Row>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select the status!' }]}
                initialValue={true}
              >
                <Row>
                  <Col span={12}>
                    <Checkbox
                      checked={status === true}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'green' : 'red' }}
                      value={true}
                    >
                      Activated
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={status === false}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'red' : 'green' }}
                      value={false}
                    >
                      Inactivated
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row>
          <Col span={24}>
            <Form.Item
              name="Valeur"
              label="Stamp Value"
              rules={[
                { required: true, message: 'Please enter the stamp value.' },
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                placeholder="Stamp value" 
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="deviseId"
              label="Devise"
              rules={[{ required: true, message: 'Please select a Devise' }]}
            >  
              <Select  
                name="deviseId" 
                placeholder="Select a Devise"
              >
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
          </Col>
        </Row>
      </>
    )}

    <Form.Item>
      <Button 
        type="primary" 
        htmlType="submit" 
        style={{ width: '100px', marginTop: '20px', backgroundColor: '#022452' }}
      >
        {editRecord ? 'Update' : 'Create'}
      </Button>
    </Form.Item>
  </Form>
</Modal>


    </div>
  );
};

export default TaxVisto;
