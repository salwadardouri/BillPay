import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Table, Select, Button,Tooltip, InputNumber,Row,Col ,Modal} from 'antd';

import { CloseOutlined } from '@ant-design/icons';
const { Option } = Select;

const CreateInvoiceForm = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const [form] = Form.useForm();
 
  const [services, setServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [timbre, setTimbre] = useState([]);
  const [parametre, setParametre] = useState([]); 
  const [tvaList, setTvaList] = useState([]);
  const [devise, setDevise] = useState([]);
  const [quantite, setQuantite] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [montant_HT, setMontant_HT] = useState(0);
  const [remise, setRemise] = useState(0);
  const [Valeur_Remise, setValeur_Remise] = useState(0);
  const [montant_HT_Apres_Remise, setMontant_HT_Apres_Remise] = useState(0);
 // eslint-disable-next-line
  const [valeur_TVA, setValeur_TVA] = useState(0);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    total_HT: '',
    total_TVA: '',
    total_Remise: '',
    total_HT_Apres_Remise: '',
    total_TTC: '',
    deviseid: '',
    timbreid: '',
    clientid: '',
    parametreid: '',
    services: []
  });

  const factureTable = [
    {
      title: 'Ref',
      dataIndex: 'reference',
      key: 'reference',
      width: '140px',
      ellipsis: true,  
      render: text => (
        <Tooltip placement="topLeft" title={text}>
          <Input style={{ width: '100%' , border: 'none',textAlign: 'justify'}} readOnly value={text} />
        </Tooltip>
      )
    },
 {
      title: 'Libelle',
      dataIndex: 'libelle',
      key: 'libelle',
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <Input style={{ width: '100%', border: 'none' }} readOnly value={text} />
        </Tooltip>
      )
    },
    {
      title: 'Prix Unitaire',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      width: '120px',
      render: (value) => (
        <Tooltip placement="topLeft" title={value}>
          <InputNumber style={{ width: '100%', border: 'none' }} readOnly value={value} />
        </Tooltip>
      )
    },
    
    {
      title: 'Unite',
      dataIndex: 'unite',
      key: 'unite',
      width: '120px',
      render: (value, record, index) => (
        <Select
        placeholder="Select the unite"
          value={value}
          onChange={(e) => handleServiceChange(e, index, 'unite')}
          rules={[{ required: true, message: 'Please select the unite!' }]}
          style={{ width: '100%' }}
        >
         <Option value="heure">Heure</Option>
      <Option value="jour">Jour</Option>
      <Option value="semaine">Semaine</Option>
      <Option value="mois">Mois</Option>
      <Option value="année">Année</Option>
        </Select>
      )
    },
    {
      title: 'Qté',
      dataIndex: 'quantite',
      key: 'quantite',
      width: '110px',
      render: (value, record, index) => (
        <InputNumber
          style={{ width: '100%' }}
          value={value}
          onChange={(e) => {
            handleServiceChange(e, index, 'quantite');
            handleQuantiteChange(e); 
                    }}
        />
      )
    },

    {
      title: 'Montant HT',
      dataIndex: 'montant_HT',
      key: 'montant_HT',
      width: '180px',
      render: (value, record, index) => (
        <InputNumber
          style={{ width: '100%' }}
          value={montant_HT} 
          onChange={(e) => handleServiceChange(e, index, 'montant_HT')}

          readOnly
        />
      )
    },
    

    {
      title: 'Remise (%)',
      dataIndex: 'remise',
      key: 'remise',
      width: '120px',
      render: (value, record, index) => (
        <InputNumber
          style={{ width: '100%' }}
          value={value}
    
          onChange={(e) => {
            handleServiceChange(e, index, 'remise');
            handleRemiseChange(e); // Appel de la deuxième fonction onChange
          }}
        />
      )
    },
    // {
    //   title: 'Valeur Remise',
    //   dataIndex: 'Valeur_Remise',
    //   key: 'Valeur_Remise',
    //   width: '180px',
    //   render: (value, record, index) => (
    //     <InputNumber
    //       style={{ width: '100%' }}
    //       value={Valeur_Remise} 
    //       onChange={(e) => handleServiceChange(e, index, 'Valeur_Remise')}
    //       readOnly
    //     />
    //   )
    // },
    // {
    //   title: 'Montant HT Net',
    //   dataIndex: 'montant_HT_Apres_Remise',
    //   key: 'montant_HT_Apres_Remise',
    //   width: '180px',
    //   render: (value, record, index) => (
    //     <InputNumber
    //       style={{ width: '100%' }}
    //       value={montant_HT_Apres_Remise} 
    //       onChange={(e) => handleServiceChange(e, index, 'montant_HT_Apres_Remise')}
    //       readOnly
    //     />
    //   )
    // },
    

    {
      title: 'TVA (%)',
      dataIndex: 'tvaId',
      key: 'tvaId',
      width: '110px',
      render: (value, record, index) => (
        <Select
          placeholder="Select a TVA"
          value={value}
          onChange={(e) => {
            handleServiceChange(e, index, 'tvaId');
            handleTVAChange(e); // Appel de la deuxième fonction onChange
          }}
          style={{ width: '90px' }}
        >
          {tvaList.map((tva) => (
            <Option key={tva._id} value={tva._id}>
              {tva.Pourcent_TVA} %
            </Option>
          ))}
        </Select>
      )
    },
    // {
    //   title: 'Valeur TVA',
    //   dataIndex: 'valeur_TVA',
    //   key: 'valeur_TVA',
    //   width: '180px',
    //   render: (value, record, index) => (
    //     <InputNumber
    //       style={{ width: '100%' }}
    //       value={valeur_TVA}
    //       onChange={(e) => handleServiceChange(e, index, 'valeur_TVA')}
    //       readOnly
    //     />
    //   )
    // },

    {
  
      key: 'action',
      width: '40px',
      ellipsis: true,
   
      render: (_, record, index) => (
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => handleRemoveService(index)}
          style={{color:'red',width:'100%'}}
        />
      )
     
    },
    
    
  ];

  useEffect(() => {
    fetchTimbre();
    fetchServices();
    fetchClients();
    fetchTvaList();
    fetchDevise();
    fetchParametre();
  }, []);

  const fetchParametre = async () => {
    try {
      const response = await axios.get('http://localhost:5000/parametre');
      setParametre(response.data);
    } catch (error) {
      console.error('Error fetching Parametre:', error);
    }
  };

  const fetchTvaList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tva');
      setTvaList(response.data);
    } catch (error) {
      console.error('Error fetching TVA:', error);
    }
  };

  const fetchDevise = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devise');
      setDevise(response.data);
    } catch (error) {
      console.error('Error fetching devise:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchTimbre = async () => {
    try {
      const response = await axios.get('http://localhost:5000/timbre');
      setTimbre(response.data);
    } catch (error) {
      console.error('Error fetching timbre:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/services');
      setAvailableServices(response.data);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleServiceChange = (value, index, key) => {
    const services = [...invoiceData.services];
    services[index][key] = value;
    setInvoiceData({ ...invoiceData, services });
  };
  const handleRemoveService = (indexToRemove) => {
    const updatedServices = invoiceData.services.filter((_, index) => index !== indexToRemove);
    setInvoiceData({ ...invoiceData, services: updatedServices });
  };
  
  const handleServiceSelect = (value) => {
    const selectedService = availableServices.find(service => service._id === value);
    const newService = {
      ...selectedService,
      unite: '',
      montant_HT: '',
      remise: '',
   Valeur_Remise:'',
   valeur_TVA:'',
      montant_HT_Apres_Remise:'',
      quantite: '',
      deviseId:'',
      tvaId:'',
    };
    setInvoiceData({ ...invoiceData, services: [...invoiceData.services, newService] });
  };

  const handleSubmit = async () => {
    console.log("Submitting invoice data:", invoiceData);
    // Convertir les champs numériques en nombres
    const dataToSend = {
      ...invoiceData,
      total_HT: parseFloat(invoiceData.total_HT),
      total_TVA: parseFloat(invoiceData.total_TVA),
      total_Remise: parseFloat(invoiceData.total_Remise),
      total_HT_Apres_Remise: parseFloat(invoiceData.total_HT_Apres_Remise),
      total_TTC: parseFloat(invoiceData.total_TTC)
    };

    try {
      const response = await axios.post('http://localhost:5000/facture', dataToSend);
      console.log("Response:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else {
        console.error('There was an error creating the invoice!', error);
      }
    }
  };


const handleServiceChangeCalcule = (serviceId) => {
  const selectedService = services.find(service => service._id === serviceId);
  if (selectedService) {
      setPrixUnitaire(selectedService.prix_unitaire);
      calculateMontantHT(quantite, selectedService.prix_unitaire); // Utiliser le prix unitaire du service sélectionné
      calculateValeur_Remise(quantite * selectedService.prix_unitaire, remise);
      calculateMontantHTApresRemise(montant_HT, Valeur_Remise);

      calculateValeurTVA(montant_HT_Apres_Remise, selectedTVA);
  }
};  
  
  
  const handleQuantiteChange = (value) => {
    setQuantite(value);
    calculateMontantHT(value, prix_unitaire); // Utiliser la valeur de la quantité mise à jour
};
  // eslint-disable-next-line
const handlePrixUnitaireChange = (value) => {
    setPrixUnitaire(value);
    calculateMontantHT(quantite, value); // Utiliser la valeur du prix unitaire mise à jour
};

const calculateMontantHT = (quantite, prix_unitaire) => {
    const montant_HT = quantite * prix_unitaire; 
    setMontant_HT(montant_HT);
    calculateValeur_Remise(montant_HT, remise);
    form.setFieldsValue({ montant_HT: montant_HT });
};

const handleRemiseChange = (value) => {
  setRemise(value);
  calculateValeur_Remise(montant_HT, value); 
  calculateMontantHTApresRemise(montant_HT, Valeur_Remise);
};



const calculateValeur_Remise = (montant_HT, remise) => {
  const valeur_Remise = montant_HT * (remise / 100); 
  setValeur_Remise(valeur_Remise);
  calculateMontantHTApresRemise(montant_HT, valeur_Remise);
  form.setFieldsValue({ valeur_Remise: valeur_Remise });
};

const calculateMontantHTApresRemise = (montant_HT, valeur_Remise, selectedTVA) => {
  const montant_HT_Apres_Remise = montant_HT - valeur_Remise;
  setMontant_HT_Apres_Remise(montant_HT_Apres_Remise);
  calculateValeurTVA(montant_HT_Apres_Remise, selectedTVA);
  
  form.setFieldsValue({ montant_HT_Apres_Remise: montant_HT_Apres_Remise });
};

const handleTVAChange = (value) => {
  const tva = tvaList.find(tva => tva._id === value);
  if (tva) {
    setSelectedTVA(tva.Pourcent_TVA);
    calculateValeurTVA(montant_HT_Apres_Remise, tva.Pourcent_TVA);
  }
};




const calculateValeurTVA = (montant_HT_Apres_Remise,tva) => {
  const pourcent_TVA = tva;
  const valeur_TVA = montant_HT_Apres_Remise * (pourcent_TVA / 100);
  setValeur_TVA(valeur_TVA);
  form.setFieldsValue({ valeur_TVA });
};

  return (
    <>
    <Button type="primary" onClick={showModal}>
    Ouvrir le formulaire de facturation
  </Button>
  <Modal
    title="Créer une nouvelle facture"
    visible={visible}
    onCancel={handleCancel}
    footer={null}
    width={1500}
    style={{marginRight:'30px'}}
    
  >
    <Form form={form} onFinish={handleSubmit}>
       <Row gutter={[16, 16]}>
     <Col span={8} >   
      <Form.Item
        name="clientid"
    
        rules={[{ required: true, message: 'Please select a client!' }]}
      >
        <Select 
          placeholder="Select a client" 
          style={{ height: '60px' }}
          onChange={(value) => handleChange({ target: { name: 'clientid', value } })}
        >
          {clients.map(client => (
            <Option key={client._id} value={client._id}>
              <div style={{ padding: '10px 0' }}>
                <span>{client.fullname}</span>
                <br />
                <span style={{ fontSize: '0.9em', color: 'gray' }}>{client.email}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      </Col>
      <Col span={8} >  
      <Form.Item
        name="parametreid"
        rules={[{ required: true, message: 'Please select a parametre!' }]}
      >
        <Select 
          placeholder="Select a parametre" 
          style={{ height: '60px' }}
          onChange={(value) => handleChange({ target: { name: 'parametreid', value } })}
        >
          {parametre.map(parametre => (
            <Option key={parametre._id} value={parametre._id}>
              <div style={{ padding: '10px 0' }}>
                <span>{parametre.Nom_S}</span>
                <br />
                <span style={{ fontSize: '0.9em', color: 'gray' }}>{parametre.Email_S}</span>
              </div>
            </Option>
          ))}
        </Select>
      </Form.Item>
      </Col>
      <Col span={8} > 
      <Form.Item
              name="deviseid"
            
      
            >
              <Select placeholder="Select a Devise"  
                onChange={(value) => handleChange({ target: { name: 'deviseid', value } })}
                 style={{ height: '60px' }}
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
            </Form.Item></Col> </Row>
            <Row gutter={[16, 16]}>
     <Col span={16} >     <Form.Item>
  <Select
    style={{ height: '60px' }}
    placeholder="Add service"
    onChange={(value) => {
      handleServiceSelect(value);
      handleServiceChangeCalcule(value); // Appel de la deuxième fonction onChange
    }}
  >
    <Option value="">Select a service</Option>
    {availableServices.map((service) => (
      <Option key={service._id} value={service._id}>{service.libelle}</Option>
    ))}
  </Select>
</Form.Item>

     </Col> 
    
    
       <Col span={8} >  
     
    


            <Form.Item
        name="timbreid"
      
        rules={[{ required: true, message: 'Please select a timbre!' }]}
      >
        <Select 
          placeholder="Select a Timbre"   style={{ height: '60px' }}
          onChange={(value) => handleChange({ target: { name: 'timbreid', value } })}
        >
          {timbre.map(timbre => (
            <Option key={timbre._id} value={timbre._id}>{timbre.Valeur} {timbre.devise ? `(${timbre.devise.Symbole})` : ''}</Option>
          ))}
        </Select>
      </Form.Item>









      </Col></Row>
      <Table columns={factureTable} dataSource={invoiceData.services} pagination={false} rowKey={(record) => record._id} />
      <Row gutter={[16, 16]} justify="end">
  <Col span={8}> 
    <Form.Item 
      label="Total HT" 
      name="total_HT" 
      labelAlign="left"
      style={{marginTop:'10px',marginBottom:'10px'}}
    >
      <InputNumber readOnly type="number"  onChange={(e) => handleChange({ target: { name: 'total_HT', value: e.target.value } })}/>
    </Form.Item>
    <Form.Item 
      label="Total TVA" 
      name="total_TVA" 
      labelAlign="left"
      style={{marginBottom:'10px'}}
    >
      <InputNumber readOnly type="number"  onChange={(e) => handleChange({ target: { name: 'total_TVA', value: e.target.value } })}/>
    </Form.Item>
    <Form.Item 
      label="Total Remise" 
      name="total_Remise" 
      labelAlign="left"
      style={{marginBottom:'10px'}}
    >
      <InputNumber readOnly type="number"  onChange={(e) => handleChange({ target: { name: 'total_Remise', value: e.target.value } })}/>
    </Form.Item>
    <Form.Item 
      label="Total HT Après Remise" 
      name="total_HT_Apres_Remise" 
      labelAlign="left"
      style={{marginBottom:'10px'}}
    >
      <InputNumber readOnly type="number"  onChange={(e) => handleChange({ target: { name: 'total_HT_Apres_Remise', value: e.target.value } })}/>
    </Form.Item>
    <Form.Item 
      label="Total TTC" 
      name="total_TTC" 
      labelAlign="left"
      style={{marginBottom:'10px'}}
    >
      <InputNumber readOnly type="number"  onChange={(e) => handleChange({ target: { name: 'total_TTC', value: e.target.value } })}/>
    </Form.Item>
  </Col>
</Row>


      <Form.Item>
        <Button type="primary" htmlType="submit">Créer la facture</Button>
      </Form.Item>
    </Form>
    </Modal>
    </>
  );
};

export default CreateInvoiceForm;
