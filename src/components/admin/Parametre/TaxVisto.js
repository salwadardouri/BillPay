import React, { useState, useEffect } from 'react';
import { Table, Button, Tabs, Modal, Badge,Form,Checkbox, 
   Select,InputNumber,Input, Space, message, Col, Row } from 'antd';
import {EditOutlined, UserAddOutlined,StopOutlined,CheckOutlined } from '@ant-design/icons';
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
      message.error('Échec de la récupération des données');
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
      message.success(`${activeTabKey} créée avec succès`);
    } catch (error) {
      message.error(`Échec de la création ${activeTabKey}`);
    }
  };

  const updateRecord = async (values) => {
  
    const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
    try {
      await axios.put(`http://localhost:5000/${url}/${editRecord._id}`, values);
      message.success(`${activeTabKey} mise à jour avec succès`);
    } catch (error) {
      message.error(`Échec de la mise à jour ${activeTabKey}`);
    }
  };

  

  // const deleteRecord = async (record) => {
  //   const url = activeTabKey === 'Tva' ? 'tva' : 'timbre';
  //   try {
  //     await axios.delete(`http://localhost:5000/${url}/${record._id}`);
  //     message.success(`${activeTabKey} deleted successfully`);
  //     fetchData();
  //   } catch (error) {
  //     message.error(`Failed to delete ${activeTabKey}`);
  //   }
  // };

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
      message.error('Erreur lors de la recherche');
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
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status) => (
          <Badge
          status={status ? "success" : "error"}
          text={status ? "Actif" : "Inactif"}
    
          icon={status ? <CheckOutlined /> : <StopOutlined />}
        />
        ),
         sorter: (a, b) => a.status - b.status, 
  
      },
      { 
        title: 'Taux de TVA', 
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
            {/* <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => deleteRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm> */}
          </Space>
        ),
      },
    ],
    Timbre: [
      {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        width: 80,
        render: (status) => (
          <Badge
          status={status ? "success" : "error"}
          text={status ? "Actif" : "Inactif"}
    
          icon={status ? <CheckOutlined /> : <StopOutlined />}
        />
        ),
         sorter: (a, b) => a.status - b.status, 
  
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
            {/* <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => deleteRecord(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm> */}
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
Ajouter
      </Button>
      <Search
        placeholder="Recherche"
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
                            <Option value="all">Tous les statuts</Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
                        </Select>
          <Table 
           dataSource={
            tvaStatusFilter === 'all' ? tvaData : tvaData.filter(tvaData =>  tvaData.status === (tvaStatusFilter === 'activated'))
        }
          columns={columns.Tva} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
        <TabPane tab="Timbre" key="Timbre">
        <Select defaultValue="all" style={{ width: 150, marginBottom: 20 ,marginTop:"10px"}} onChange={handleTimbreStatusChange}>
                            <Option value="all">Tous les  statuts</Option>
                            <Option value="activated">Activé</Option>
                            <Option value="inactivated">Désactivé</Option>
                        </Select>
          <Table         dataSource={
            timbreStatusFilter === 'all' ? timbreData : timbreData.filter(timbreData => timbreData.status === (timbreStatusFilter === 'activated'))
        }
          columns={columns.Timbre} loading={loading} pagination={{ pageSize: 12 }} />
        </TabPane>
      </Tabs>
      <Modal
  title={editRecord ? 'Modifier' : 'Créer'}
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
                label="Statut"
                rules={[{ required: true, message: 'Veuillez cocher le statut!' }]}
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
                      Activé
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={status === false}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'red' : 'green' }}
                      value={false}
                    >
                  Désactivé
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
                { required: true, message: 'Veuillez saisir le taux de TVA.' },
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                placeholder="Taux de TVA " 
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
                label="Statut"
                rules={[{ required: true, message: 'Veuillez cocher le statut!' }]}
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
                      Activé
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      checked={status === false}
                      onChange={handleCheckboxChange}
                      style={{ color: status ? 'red' : 'green' }}
                      value={false}
                    >
                     Désactivé
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
              label="Timbre fiscal"
              rules={[
                { required: true, message: 'Veuillez saisir la valeur du timbre fiscal.' },
              ]}
            >
              <InputNumber 
                style={{ width: '100%' }}
                placeholder="Valeur de Timbre Fiscal" 
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="deviseId"
              label="Devise"
              rules={[{ required: true, message: 'Veuillez sélectionner une devise' }]}
            >  
              <Select  
                name="deviseId" 
                placeholder="Sélectionnez une devise"
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
        {editRecord ? 'Modifier' : 'Créer'}
      </Button>
    </Form.Item>
  </Form>
</Modal>


    </div>
  );
};

export default TaxVisto;
