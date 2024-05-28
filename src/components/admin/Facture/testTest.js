import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  message,
  Button,
  Table,

  Row,
  Col,
  Popconfirm,
} from "antd";
import axios from "axios";


import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const Facture = () => {
  const [form] = Form.useForm();
  const [tvaList, setTvaList] = useState([]); // Nouvel état pour stocker les taux de TVA
  const [selectedServices, setSelectedServices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [facture, setFacture] = useState([]);
  const [updatedServices, setUpdatedServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [timbre, setTimbre] = useState([]); 
  // eslint-disable-next-line
  const [devise, setDevise] = useState([]); 

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchFacture();
    fetchTimbre();
    fetchClients();
    fetchTvaList();
    fetchServices();
    fetchDevise();
  }, []);
  
  const fetchFacture = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/facture');
      setFacture(response.data);
    } catch (error) {
      console.error('Error fetching facture:', error);
    } finally {
      setLoading(false);
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
      console.error('Error fetching TVA:', error);
    }
  };
  const fetchTimbre = async () => {
    try {
      const response = await axios.get('http://localhost:5000/timbre');
      setTimbre(response.data);
    } catch (error) {
      console.error('Error fetching Timbre:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };


  const handleColumnChange = (value, key, dataIndex) => {
    const updatedServices = selectedServices.map((service) => {
      if (service._id === key) {
        const updatedService = {
          ...service,
          [dataIndex]: dataIndex === "tva" ? value : parseFloat(value),
        };

        if (
          dataIndex === "quantite" ||
          dataIndex === "prix_unitaire" ||
          dataIndex === "remise" ||
          dataIndex === "tva"
        ) {
          updatedService.montant_ht = calculateMontantHT(updatedService);
        }
        updatedService.tva = value;
        handleServiceUpdate(service._id, updatedService);
        return updatedService;
      }
      return service;
    });

    setSelectedServices(updatedServices);
    setUpdatedServices(updatedServices);
  };

  const handleCreate = async (values) => {
    // Récupérer les valeurs du formulaire
    const {
      clientId
,

      deviseId
,
      timbreId,

    } = values;

    // Créer le payload pour la création de la facture
    const payload = {
      clientId
,
 
      deviseId,

    timbreId,

      serviceId: updatedServices.map((service) => service._id), // Utiliser updatedServices ici
    };

    try {
      // Mettre à jour les services modifiés
      await Promise.all(
        updatedServices.map((updatedService) =>
          handleServiceUpdate(updatedService._id, updatedService)
        )
      );

      // Créer la facture
      await axios.post("http://localhost:5000/api/facture/fact", payload);

      // Rafraîchir la liste des facture après la création
      const factureResponse = await axios.get(
        "http://localhost:5000/api/facture"
      );
      setFacture(factureResponse.data);

      // Réinitialiser le formulaire et les services sélectionnés
      form.resetFields();
      setSelectedServices([]);
      setUpdatedServices([]);

      // Afficher un message de succès
      message.success("Facture créée avec succès !");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error);
      message.error(
        "Une erreur s'est produite lors de la création de la facture."
      );
    }
  };

  const handleServiceUpdate = async (id, updatedService) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/services/${id}`,
        updatedService
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service :", error);
      message.error(
        "Une erreur s'est produite lors de la mise à jour du service."
      );
    }
  };

  // Dans la fonction handleAddService
  const handleAddService = (value) => {
    const serviceToAdd = services.find((service) => service._id === value);
    if (
      serviceToAdd &&
      !selectedServices.find((service) => service._id === value)
    ) {
      const updatedService = {
        ...serviceToAdd,
        montant_ht: calculateMontantHT(serviceToAdd),
      };

      // Assurez-vous que la valeur de la TVA est correctement récupérée et stockée
      updatedService.tva = serviceToAdd.tva ? serviceToAdd.tva._id : undefined;

      setSelectedServices([...selectedServices, updatedService]);
    }
  };

  const calculateMontantHT = (record) => {
    const quantite = record.quantite || 0;
    const prix_unitaire = record.prix_unitaire || 0;
    const remise = record.remise || 0;
    return (quantite * prix_unitaire * (100 - remise)) / 100;
  };

  const columns = [
    {
      title: "Référence",
      dataIndex: "reference",
      key: "reference",
      width: 130,
      render: (_, record) => record.reference,
    },

    {
      title: "Désignation",
      dataIndex: "libelle",
      key: "libelle",
      width: 200,
      render: (_, record) => (
        <Input.TextArea
          defaultValue={record.libelle}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "libelle")
          }
          autoSize={{ minRows: 1, maxRows: 5 }} // Ajuste la hauteur automatiquement
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "TVA",
      dataIndex: "tva",
      key: "tva",
      width: 120,
      render: (_, record) => (
        <Select
          onChange={(value) => handleColumnChange(value, record._id, "tva")}
          style={{ width: "100%" }}
          value={record.tva ? record.tva : undefined} // Utilisez la clé "tva" pour la valeur sélectionnée
        >
          {tvaList.map((tva) => (
            <Option key={tva._id} value={tva._id}>
              {tva.rate}%
            </Option>
          ))}
        </Select>
      ),
    },

    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      width: 100,
      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.quantite}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "quantite")
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Prix Unitaire",
      dataIndex: "prix_unitaire",
      key: "prix_unitaire",
      width: 150,
      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.prix_unitaire}
          onBlur={(e) =>
            handleColumnChange(
              parseFloat(e.target.value),
              record._id,
              "prix_unitaire"
            )
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Remise(%)",
      dataIndex: "remise",
      key: "remise",
      width: 100,
      render: (_, record) => (
        <Input
          type="number"
          defaultValue={record.remise}
          onBlur={(e) =>
            handleColumnChange(e.target.value, record._id, "remise")
          }
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "Montant HT",
      dataIndex: "montant_ht",
      key: "montant_ht",
      width: 120,
      render: (_, record) => record.montant_ht, // Utilisez la valeur du montant HT du service
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Popconfirm
          title="Êtes-vous sûr de vouloir supprimer ce service ?"
          onConfirm={() => handleDeleteService(record._id)}
          okText="Oui"
          cancelText="Non"
        >
          <Button type="link" danger style={{ background: "transparent" }}>
            <DeleteOutlined />
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleDeleteService = (id) => {
    // Mettez à jour l'état selectedServices en supprimant le service supprimé
    const updatedSelectedServices = selectedServices.filter(
      (service) => service._id !== id
    );
    setSelectedServices(updatedSelectedServices);
    message.success("Service supprimé de la table !");
  };
  const columnsFact = [
  

    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client) => `${client.name} (${client.namecompany})`,
    },
    {
      title: "Devise",
      dataIndex: "devise",
      key: "devise",
      render: (devise) => devise.symbole,
    },
 
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Ajouter Facture
      </Button>

      <Table
        dataSource={facture}
        columns={columnsFact}
        rowKey="_id"
        pagination={false}
        style={{ marginTop: 20 }}
      />
      <Modal
        title={
          <span
            style={{
              color: "#0a0a85",
              fontSize: "25px",
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Ajouter une facture
          </span>
        }
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
        style={{ top: 10 }}
        bodyStyle={{
          background:
            "linear-gradient(to bottom,rgba(255, 255, 255, 0.9),  rgba(255, 255, 255, 0.9))",
        }}
      >
        <Form
          form={form}
          layout="inline"
          onFinish={handleCreate}
          style={{ marginTop: 10, marginRight: 20 }}
        >
          <Row gutter={16}>

            <Col span={12}>
              <Form.Item
                style={{ marginTop: 10, marginLeft: -25 }}
                label="Client"
                name="clientId
"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un client !",
                  },
                ]}
              >
                <Select
                  style={{ width: "300px" }}
                  placeholder="Sélectionner un client"
                >
                  {clients.map((client) => (
                    <Option key={client._id} value={client._id}>
                      {`${client.name} (${client.namecompany})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>

            </Col>
            <Col span={12}>
              <Form.Item
                style={{ marginLeft: 60 }}
                label="Devise"
                name="deviseId
"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une devise !",
                  },
                ]}
              >
                <Select style={{ width: "100px" }} placeholder=" devise">
                  {devise.map((devise) => (
                    <Option key={devise._id} value={devise._id}>
                      {` (${devise.symbole})`}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: "100%", marginTop: 10 }}>
            <Col span={24}>
              <Form.Item
                label="Services"
                name="serviceId"
                style={{ marginLeft: -30 }}
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un service !",
                  },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Sélectionner un service"
                  onSelect={handleAddService}
                >
                  {services.map((service) => (
                    <Option key={service._id} value={service._id}>
                      {service.libelle}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Table
            className="custom-table"
            dataSource={selectedServices}
            columns={columns}
            rowKey="id"
            pagination={false}
            style={{ marginBottom: 16, width: "100%" }}
            bordered
            scroll={{ x: "100%" }}
          />
          <Row gutter={16}>
           
          
              <Form.Item
                label="Timbre"
                name="timbreId"
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir le timbre !",
                  },
                ]}
              >
                <Select placeholder="Sélectionner un timbre">
                  {timbre.map((timbre) => (
                    <Option key={timbre._id} value={timbre._id}>
                      {timbre.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
             
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
              marginLeft: 300,
            }}
          >
            <Button
              type="default"
              style={{
                backgroundColor: "red",
                color: "white",
                marginRight: 10,
                width: "120px",
                fontSize: "14px",
              }}
              onClick={() => {
                setIsModalVisible(false);
                form.resetFields(); // Réinitialiser les champs du formulaire
                setSelectedServices([]); // Réinitialiser les services sélectionnés
                setUpdatedServices([]); // Réinitialiser les services modifiés
              }}
            >
              Annuler
            </Button>

            <Form.Item style={{ marginRight: "8px", marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="create-butto"
                style={{
                  background: "green",
                  width: "130px",
                  height: "30px",
                  fontSize: "14px",
                }}
              >
                Valider
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Facture;