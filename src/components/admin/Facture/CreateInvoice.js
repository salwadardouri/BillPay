import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input,DatePicker,Divider, Table, Select, Button,Tooltip,Space, InputNumber,Row,Col,message ,Modal ,Typography} from 'antd';
import Visto from '../../../images/Visto.png';

import { CloseOutlined ,DownloadOutlined,EyeOutlined,CheckCircleOutlined, ExclamationCircleOutlined, WarningOutlined} from '@ant-design/icons';

import moment from 'moment';
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const { Option } = Select;
const { Title, Paragraph } = Typography;


const CreateInvoiceForm = () => {
  const [isShowModalVisible, setIsShowModalVisible] = useState(false); // État pour le modal d'affichage
  const [isNewInvoiceModalVisible, setIsNewInvoiceModalVisible] = useState(false); 
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); 
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);
  const [facture, setFacture] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [timbre, setTimbre] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [parametre, setParametre] = useState([]); 
  const [montantRestant, setMontantRestant] = useState(editRecord ? editRecord.total_TTC : 0);

  const [paiement, setPaiement] = useState([]);
  const [tvaList, setTvaList] = useState([]);
  const [devise, setDevise] = useState([]);
  const [quantite, setQuantite] = useState(0);
  const [prix_unitaire, setPrixUnitaire] = useState(0);
  const [montant_HT, setMontant_HT] = useState(0);
  const [remise, setRemise] = useState(0);
  const [Valeur_Remise, setValeur_Remise] = useState(0);
  const [montant_HT_Apres_Remise, setMontant_HT_Apres_Remise] = useState(0);
  const [total_HT, setTotal_HT] = useState(0);
const [total_TVA, setTotal_TVA] = useState(0);
const [total_Remise, setTotal_Remise] = useState(0);
const [total_HT_Apres_Remise, setTotal_HT_Apres_Remise] = useState(0);
const [total_TTC, setTotal_TTC] = useState(0);
const [selectedTimbre, setSelectedTimbre] = useState(null);
const [loading, setLoading] = useState(false);
  const [valeur_TVA, setValeur_TVA] = useState(0);
  const [selectedTVA, setSelectedTVA] = useState(null);
  const [paymentType, setPaymentType] = useState(''); // Stocke le type de paiement sélectionné
  const [installments, setInstallments] = useState([{ id: 1 }]); // Stocke les échéances

  const [paymentStatus, setPaymentStatus] = useState('paid'); 
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    total_HT,
    total_TVA,
    total_Remise,
    total_HT_Apres_Remise,
    total_TTC,
    deviseid :'',
    timbreid : '',
    clientid :'',
    parametreid :'',
    services: []

  });
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 20,
    },
    section: {
      marginBottom: 20,
      padding: 10,
    },
    Visto: {
      marginBottom: 10,
      width: "20%",
    },
  //    Visto: {
  //   width: 50, // Largeur de l'image réduite
  //   height: 50, // Hauteur de l'image réduite
  //   marginBottom: 10,
  // },
    title: {
      fontSize: 20,
      color: "#14149f",
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 2,
      marginLeft: "auto",
      marginRight: "auto",
      textDecoration: "underline",
      paddingBottom: 4,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 11,
      color: "#1b1b1b",
      fontWeight: "normal",
      marginBottom: 8,
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColHeaderDesignation: {
      width: "40%", // Largeur plus grande pour la colonne "Designation"
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#6696bd",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#84bdea",
    },
    tableColDesignation: {
      width: "40%", // Largeur correspondante pour les cellules de "Designation"
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableColHeader: {
      width: "15%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#6696bd",
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: "#84bdea",
    },
    tableCol: {
      width: "15%",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#bfbfbf",
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCellHeader: {
      margin: 5,
      fontSize: 10,
      fontWeight: "bold",
      textAlign: "center",
    },
    tableCell: {
      margin: 5,
      fontSize: 10,
      textAlign: "center",
    },

    totalsContainer: {
      flexDirection: "row",
      marginTop: 20,
      marginBottom: 10,
      justifyContent: "space-between",
    },
    totalsLeft: {
      width: "40%",
      marginRight: 10,
      textAlign: "right",
    },
    totalsRight: {
      width: "40%",
      marginLeft: 10,
    },
    totalsText: {
      fontSize: 10,
      marginBottom: 5,
      color: "#333",
    },
    totalsValue: {
      fontSize: 12,
      marginBottom: 5,
      color: "#555",
    },
    totalsTable: {
      marginLeft: 50,
      width: "80%",

      borderStyle: "solid",
    },
    totalsTableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: "#ccc",
    },
    totalsTableCell: {
      flex: 1,

      textAlign: "center",
      borderRightWidth: 1,
      borderColor: "#ccc",
    },
    totalsTableCellHeader: {
      flex: 1,

      textAlign: "center",
      borderRightWidth: 1,
      borderColor: "#ccc",
      backgroundColor: "#84bdea", // Couleur de fond pour les en-têtes de colonnes
      fontWeight: "bold", // Gras pour les en-têtes
    },
    totalsLastCell: {
      borderRightWidth: 0,
    },

    footerContainer: {
      textAlign: "center",
      borderTop: "2px solid #ddd",
      paddingTop: 10,
      marginTop:130,
      fontSize: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 11.5,
    },
  });

  const showPrintModal = (record) => {
    setSelectedFacture(record); // Sélectionnez la facture pour l'impression
    setIsPrintModalVisible(true);
  };
  const handlePrintModalCancel = () => {
    setIsPrintModalVisible(false);
  };

  const showShowModal = (record) => {
    setIsShowModalVisible(true);
    setSelectedFacture(record);
  
  }; 
  const handleShowModalCancel = () => {
    setIsShowModalVisible(false);
  };
  useEffect(() => {
    fetchTimbre();
    fetchServices();
    fetchClients();
    fetchTvaList();
    fetchDevise();
    fetchParametre();
    fetchFacture();
    fetchPaiement();
  }, []);
  const fetchParametre = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/parametre');
      if (response.status === 200) {
        const filteredParametre = response.data.filter(param => param.status === true);
        setParametre(filteredParametre);
      } else {
        console.error('Failed to fetch Parametre data');
      }
    } catch (error) {
      console.error('Error fetching Parametre data:', error);
    } finally {
      setLoading(false);
    }
  }; 
  const fetchPaiement = async () => {
    try {
      const response = await axios.get('http://localhost:5000/paiement');
      setPaiement(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
    }
  };
  const fetchTvaList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/tva');
      if (response.status === 200) {
        const filteredTvaList = response.data.filter(tva => tva.status === true);
        setTvaList(filteredTvaList);
      } else {
        console.error('Failed to fetch TVA data');
      }
    } catch (error) {
      console.error('Error fetching TVA data:', error);
    } finally {
      setLoading(false);
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
  const fetchFacture = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/facture');
      setFacture(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facture:', error);
      setLoading(false);
    }
  };
  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/clients');
      if (response.status === 200) {
        const filteredClients = response.data.filter(client => client.status === true);
        setClients(filteredClients);
      } else {
        console.error('Failed to fetch Clients data');
      }
    } catch (error) {
      console.error('Error fetching Clients data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTimbre = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/timbre');
      if (response.status === 200) {
        const filteredTimbre = response.data.filter(timbre => timbre.status === true);
        setTimbre(filteredTimbre);
      } else {
        console.error('Failed to fetch Timbre data');
      }
    } catch (error) {
      console.error('Error fetching Timbre data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/services');
      if (response.status === 200) {
        const filteredServices = response.data.filter(service => service.status === true && service.categories);
        setAvailableServices(filteredServices);
        setServices(filteredServices);
      } else {
        console.error('Failed to fetch Services data');
      }
    } catch (error) {
      console.error('Error fetching Services data:', error);
    } finally {
      setLoading(false);
    }
  };
  const onFinish = async () => {
    console.log("Submitting invoice data:", invoiceData);
  
    try {
      // Convertir les champs numériques en nombres
      const dataToSend = {
        ...invoiceData,
        total_HT: parseFloat(total_HT),
        total_TVA: parseFloat(total_TVA),
        total_Remise: parseFloat(total_Remise),
        total_HT_Apres_Remise: parseFloat(total_HT_Apres_Remise),
        total_TTC: parseFloat(total_TTC),
      };
  
      const response = await axios.post('http://localhost:5000/facture', dataToSend);
      console.log("Facture créée:", response.data);
  
      // Récupérer l'ID du client sélectionné
      const clientId = dataToSend.clientid;
       const Num_Fact = dataToSend.Num_Fact;
      // Créer la notification pour la facture créée
      const notificationData = {
        type: 'FactureCréée',
        notif: ` We inform you that your invoice number ${Num_Fact} is now available for viewing. `,
        client: clientId, // Assurez-vous que clientId est bien défini comme un ID MongoDB
      };
  
      // Envoyer la notification
      const notificationResponse = await axios.post('http://localhost:5000/notifications', notificationData);
      console.log("Notification créée:", notificationResponse.data);
  
      message.success('Invoice created successfully');
      setIsNewInvoiceModalVisible(false);
      form.resetFields();
  
      fetchFacture();
    } catch (error) {
      message.error('Failed to create Invoice');
      console.error('Error creating invoice:', error);
    }
  };
  const submitNotification = async (clientId,Num_Fact,etatpaiement) => {
    try {
      const notificationData = {
        type: 'PaiementRéglé',
        notif: `Your invoice number: ${Num_Fact}, Payment status:  ${etatpaiement}`,
        client: clientId,
      };

      const response = await axios.post('http://localhost:5000/notifications', notificationData);
      console.log("Notification créée:", response.data);
      message.success('Notification sent successfully');
    } catch (error) {
      console.error('Failed to send notification', error);
      message.error('Failed to send notification.');
    }
  };

  const submitPayment = async (values) => {
    if (montantRestant > 0) {
      message.error('Le montant restant doit être 0 pour soumettre le paiement.');
      return;
    }
  
    if (!editRecord || !editRecord.client || !editRecord.client._id || !editRecord.Num_Fact) {
      message.error('Les informations de la facture sont manquantes');
      return;
    }
  
    const echeances = installments.map((installment, index) => {
      const numCheque = values[`numCheque_${index}`];
      const montantCheque = parseFloat(values[`montantCheque_${index}`] || 0);
      const dateCh = moment(values[`dateCh_${index}`]).toISOString();
      const dateEcheance = moment(values[`dateEcheance`]).toISOString();
  
      const montantRestant = editRecord.total_TTC - installments.slice(0, index + 1)
        .reduce((acc, _, i) => acc + parseFloat(values[`montantCheque_${i}`] || 0), 0);
  
      return {
        numCheque,
        montantCheque,
        dateCh,
        dateEcheance,
        montantRestant: montantRestant >= 0 ? montantRestant : 0,
      };
    });
  
    const paymentData = {
      etatpaiement: values.etatpaiement,
      montantPaye: values.montantPaye,
      typepaiement: paymentType,
      factures: editRecord ? editRecord._id : null,
      echeances
    };
  
    try {
      await axios.post('http://localhost:5000/paiement', paymentData);
      alert('Payment submitted successfully!');
      console.log(paymentData);
      await submitNotification(editRecord.client._id, editRecord.Num_Fact, paymentData.etatpaiement);
    } catch (error) {
      console.error('Failed to submit payment', error);
      alert('Failed to submit payment.');
    }
  };
  
const handleEdit = (record) => {
  setEditRecord(record);
  setIsUpdateModalVisible(true);
  
  form.setFieldsValue({
    total_TTC: record.total_TTC,
    Date_Fact: moment(record.Date_Fact),
 
  });
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
  };
  const handleServiceChange = (value, index, key) => {
    const services = [...invoiceData.services];
    services[index][key] = value;
    setInvoiceData({ ...invoiceData, services });
    calculateServiceTotals(index); // Mise à jour des valeurs de la ligne
    calculateTotals(services); // Mise à jour des totaux globaux
  }
   const handleRemoveService = (indexToRemove) => {
    const updatedServices = invoiceData.services.filter((_, index) => index !== indexToRemove);
    setInvoiceData({ ...invoiceData, services: updatedServices });
    calculateTotals(updatedServices); 
  };
  const handleServiceSelect = (value) => {
    const selectedService = availableServices.find(service => service._id === value);
    const newService = {
      ...selectedService,
      
      montant_HT: 0,
      remise: 0,
      quantite: 0,
      deviseId :'',
      tvaId :'',
      montant_HT_Apres_Remise,
      valeur_TVA ,
      valeur_Remise :0,
    };
    const updatedServices = [...invoiceData.services, newService]; // Créer updatedServices ici
    setInvoiceData({ ...invoiceData, services: updatedServices }); // Utiliser updatedServices pour mettre à jour l'état
    calculateTotals(updatedServices); // Utiliser updatedServices pour calculer les totaux
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
  // eslint-disable-next-line
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
// eslint-disable-next-line
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
// eslint-disable-next-line
const handleTVAChange = (value) => {
  const tva = tvaList.find(tva => tva._id === value);
  if (tva) {
    setSelectedTVA(tva.Pourcent_TVA);
    calculateValeurTVA(montant_HT_Apres_Remise, tva.Pourcent_TVA);
  }
};
// Fonction de calcul mise à jour pour chaque ligne service en utilisant l'index
const calculateServiceTotals = (index) => {
  const services = [...invoiceData.services];
  const service = services[index];
  if (service) {
    const montant_HT = service.quantite * service.prix_unitaire;
    const valeur_Remise = montant_HT * (service.remise / 100);
    const montant_HT_Apres_Remise = montant_HT - valeur_Remise;
    const tva = tvaList.find(tva => tva._id === service.tvaId);
    const valeur_TVA = tva ? montant_HT_Apres_Remise * (tva.Pourcent_TVA / 100) : 0;

    services[index] = {
      ...service,
      montant_HT,
      Valeur_Remise: valeur_Remise,
      montant_HT_Apres_Remise,
      valeur_TVA,

    };

    setInvoiceData({ ...invoiceData, services });
  }
};
const calculateValeurTVA = (montant_HT_Apres_Remise,tva) => {
  const pourcent_TVA = tva;
  const valeur_TVA = montant_HT_Apres_Remise * (pourcent_TVA / 100);
  setValeur_TVA(valeur_TVA);
  form.setFieldsValue({ valeur_TVA });
};
const calculateTotals = (services) => {
  const total_HT = services.reduce((sum, service) => sum + service.montant_HT, 0);
  const total_Remise = services.reduce((sum, service) => sum + service.Valeur_Remise, 0);
  const total_HT_Apres_Remise = services.reduce((sum, service) => sum + service.montant_HT_Apres_Remise, 0);
  const total_TVA = services.reduce((sum, service) => sum + service.valeur_TVA, 0);

  // Ajoutez la valeur du timbre si sélectionné
  const timbreValeur = selectedTimbre ? selectedTimbre.Valeur : 0;
  const total_TTC = total_HT_Apres_Remise + total_TVA + timbreValeur;

  setTotal_HT(total_HT);
  setTotal_Remise(total_Remise);
  setTotal_HT_Apres_Remise(total_HT_Apres_Remise);
  setTotal_TVA(total_TVA);
  setTotal_TTC(total_TTC);

  // Mise à jour de l'état pour total_HT, total_TVA, etc.
  setInvoiceData(prevData => ({
    ...prevData,
    total_HT,
    total_Remise,
    total_HT_Apres_Remise,
    total_TVA,
    total_TTC,
    services
  }));

  form.setFieldsValue({
    total_HT,
    total_TVA,
    total_Remise,
    total_HT_Apres_Remise,
    total_TTC
  });
};
const handleTimbreChange = (value) => {
  const selected = timbre.find(t => t._id === value);
  setSelectedTimbre(selected);
  calculateTotals(invoiceData.services);
  // Mettez à jour la valeur du champ de timbre dans le formulaire
  form.setFieldsValue({ timbre_Valeur: selected ? selected.Valeur : 0 });
};
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

useEffect(() => {
  if (editRecord) {
    form.setFieldsValue({
      total_TTC: editRecord.total_TTC,
      Date_Fact: moment(editRecord.Date_Fact),
      
    });

  }
}, [editRecord, form]);
const calculateMontantRestant = (allValues) => {
  const total_TTC = editRecord ? editRecord.total_TTC : 0;
  const montantCheques = installments.reduce((acc, _, index) => {
    const montantCheque = parseFloat(allValues[`montantCheque_${index}`] || 0);
    return acc + montantCheque;
  }, 0);
  const restant = total_TTC - montantCheques;
  setMontantRestant(restant >= 0 ? restant : 0);
};

useEffect(() => {
  form.validateFields(); // Force the validation to check if montantRestant is 0

}, [form]);

const handlePaymentTypeChange = (value) => {
  setPaymentType(value);
  if (value === 'cash') {
    form.setFieldsValue({ montantPaye: editRecord.total_TTC, etatpaiement: 'Paid' });
  }
};
const addInstallment = () => {
  setInstallments([...installments, { id: installments.length + 1 }]);
};
const handlePaymentStatusChange = (value) => {
  setPaymentStatus(value);
};  
const handleRemoveEcheance = (index) => {
  setInstallments((prevInstallments) => prevInstallments.filter((_, i) => i !== index));
};
const renderEtatPaiement = (record, paiement) => {
  const paiementAssocie = paiement.find(p => p.factures.includes(record._id));
  if (!paiementAssocie) return <span><ExclamationCircleOutlined style={{ color: 'red' }} /> Unpaid</span>;

  const etatpaiement = paiementAssocie.etatpaiement;
  let icon, text;

  switch (etatpaiement) {
    case 'Paid':
      icon = <CheckCircleOutlined style={{ color: 'green' }} />;
      text = 'Paid';
      break;
    case 'partially paid':
      icon = <WarningOutlined style={{ color: 'yellow' }} />;
      text = 'Partially Paid';
      break;
    default:
      icon = <ExclamationCircleOutlined style={{ color: 'red' }} />;
      text = 'Unpaid';
      break;
  }

  return (
    <span>
      {icon} {text}
    </span>
  );
};

const columns = [
  {
    title: 'État Paiement',
    key: 'etatPaiement',
    width:130 ,
    render: (record) => renderEtatPaiement(record, paiement),
  },
  {
    title: 'Date facture',
    dataIndex: 'Date_Fact',
    width:130 ,
    key: 'Date_Fact',
    render: (text) => (
      <Tooltip placement="topLeft" title={new Date(text).toLocaleDateString()}>
        {new Date(text).toLocaleDateString()}
      </Tooltip>
    ),
  },
  {
    title: 'Num Facture',
    dataIndex: 'Num_Fact',
    key: 'Num_Fact',
    ellipsis: true,
    render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
  },
  {
    title: 'Entreprise',
    key: 'parametre_Nom_S',
    render: (record) => (
      <div>
        <span>{record.parametre.Nom_S}</span>
        <br />
        <span style={{ color: 'gray' }}>{record.parametre.Email_S}</span>
      </div>
    ),
  },
  {
    title: 'Client',
    key: 'client_fullname',
    render: (record) => (
      <div>
        <span>{record.client.fullname}</span>
        <br />
        <span style={{ color: 'gray' }}>{record.client.email}</span>
      </div>
    ),
  },
 
  // {
  //   title: 'Total TTC ',
  //   dataIndex: 'total_TTC',
  //   key: 'total_TTC',
  //   ellipsis: true,
  //   render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>,
  // },
  {
    title: 'Actions',
    render: (_, record) => (
      <Space style={{ float: 'left' }}>
        <Button style={{size:'30px'}} type="link" icon={<EyeOutlined />} onClick={() => showShowModal(record)} />
    
        <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => showPrintModal(record)} // Passer le record à la fonction
          ></Button>
        {/* <Button
  type="link"
  onClick={() => handleEdit(record)}
  disabled={etatpaiement === 'partially paid' || etatpaiement === 'paid'}
>
  Suivre
</Button> */}
{renderTrackPaiement(record, paiement)}
           
      </Space>
    ),
  },
];
const renderTrackPaiement = (record, paiement) => {
  // Recherche du paiement associé à l'enregistrement spécifique
  const paiementAssocie = paiement.find(p => p.factures.includes(record._id));
  
  // Détermine si le bouton doit être désactivé en fonction de la présence du paiement associé
  const disableButton = !!paiementAssocie;

  // Rendu conditionnel du bouton "Suivre"
  return (
    <Button
      type="link"
      onClick={() => handleEdit(record)} // Remplacez handleEdit par la fonction appropriée pour éditer
      disabled={disableButton}
    >
      Suivre
    </Button>
  );
};
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
    title: 'Descriptions',
    dataIndex: 'libelle',
    key: 'libelle',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Input style={{ width: '100%', border: 'none' }} readOnly value={text} />
      </Tooltip>
    )
  },
  {
    title: 'PU',
    dataIndex: 'prix_unitaire',
    key: 'prix_unitaire',
    width: '100px',
    render: (value, record, index) => (
      <Tooltip placement="topLeft" title={value}>
        <InputNumber
          style={{ width: '100%', border: 'none' }}
          value={value}
          onChange={(val) => {
            handleServiceChange(val, index, 'prix_unitaire');
            calculateServiceTotals(index);
          }}
        />
      </Tooltip>
    )
  },

  {
    title: 'Unity',
    dataIndex: 'unite',
    key: 'unite',
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        <Input style={{ width: '100%', border: 'none' }} readOnly value={text} />
      </Tooltip>
    )
  },
  {
    title: 'Qté',
    dataIndex: 'quantite',
    key: 'quantite',
    width: '80px',
    render: (value, record, index) => (
      <InputNumber
        style={{ width: '100%' }}
        value={value}
        onChange={(val) => {
          handleServiceChange(val, index, 'quantite');
          calculateServiceTotals(index);
        }}
      />
    )
  },
  {
    title: 'Montant HT',
    dataIndex: 'montant_HT',
    key: 'montant_HT',
    width: '150px',
    render: (value) => (
      <InputNumber
        style={{ width: '100%' }}
        value={value}
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
        onChange={(val) => {
          handleServiceChange(val, index, 'remise');
          calculateServiceTotals(index);
        }}
      
       formatter={value => `${value}%`} // Ajouter le symbole "%" après la valeur
       parser={value => value.replace('%', '')}// Retirer le symbole "%" lors de la saisie
       />
    )
  },
  // {
  //   title: 'Valeur Remise',
  //   dataIndex: 'Valeur_Remise',
  //   key: 'Valeur_Remise',
  //   width: '180px',
  //   render: (value) => (
  //     <InputNumber
  //       style={{ width: '100%' }}
  //       value={value}
  //       readOnly
  //     />
  //   )
  // },
  // {
  //   title: 'Montant HT Net',
  //   dataIndex: 'montant_HT_Apres_Remise',
  //   key: 'montant_HT_Apres_Remise',
  //   width: '180px',
  //   render: (value) => (
  //     <InputNumber
  //       style={{ width: '100%' }}
  //       value={value}
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
        onChange={(val) => {
          handleServiceChange(val, index, 'tvaId');
          calculateServiceTotals(index);
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
  //   render: (value) => (
  //     <InputNumber
  //       style={{ width: '100%' }}
  //       value={value}
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
        style={{ color: 'red', width: '100%' }}
      />
    )
  },
];
  const columnsShow = [
    {
      title: 'Ref',
      dataIndex: 'reference',
      key: 'reference',
      width: '140px',
    },
    
    {
      title: 'Designation',
      dataIndex: 'libelle',
      key: 'libelle',
    
    },
     {
      title: 'Unite',
      dataIndex: 'unite',
      key: 'unite',
      width: '100px',
    },
    {
      title: 'Qté',
      dataIndex: 'quantite',
      key: 'quantite',
      width: '80px',
    },
    {
      title: 'PU',
      dataIndex: 'prix_unitaire',
      key: 'prix_unitaire',
      width: '120px',
    },
  
   
    {
      title: 'Montant HT',
      dataIndex: 'montant_HT',
      key: 'montant_HT',
      width: '150px',
    },
  ];
  return (
    <>
       <div style={{ marginBottom: 16, float: 'right' }}>
    <Button type="primary" onClick={() => setIsNewInvoiceModalVisible(true)}  style={{ backgroundColor: '#022452' }}>
    Add Invoice
  </Button></div>
  <Modal
      visible={isUpdateModalVisible}
      onCancel={() => setIsUpdateModalVisible(false)}
      width={900}
      footer={null}

    >
        
    <Form
      form={form}
      onFinish={submitPayment}
 

      onValuesChange={(changedValues, allValues) => {
        console.log(allValues);
        calculateMontantRestant(allValues);}}
    >
      {editRecord && (
        <>
         <div style={{  marginBottom: '16px' }}>
         <Title level={1} style={{ color: '#022452', marginBottom: '12px' }}>
        {`Track the payment of invoice N °: ${editRecord.Num_Fact}`}
      </Title>
      <Paragraph style={{ fontWeight: 'bold', color: 'grey', fontSize: '16px' }}>
        Please select the payment method for the invoice created on <span style={{ color: '#333333'}}>{moment(editRecord.Date_Fact).format('YYYY-MM-DD')}</span> of the client <span style={{ color: '#333333'}}>{editRecord.client.fullname}</span> ({editRecord.client.email}).
      </Paragraph>
      <Divider />
      </div>

      <Paragraph style={{ fontWeight: 'bold', fontSize: '15px' }}>
      The total amount inclusive of all taxes for this invoice (Total_TTC) is  :   {editRecord.total_TTC}{editRecord.devise.Symbole} .

        </Paragraph>
        <Paragraph style={{ fontWeight: 'bold', fontSize: '15px' }}>
        The remaining amount to be paid is: {montantRestant} {editRecord.devise.Symbole}.
      </Paragraph>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
    
                name="typepaiement"
       
                rules={[{ required: true, message: 'Please select a payment type!' }]}
              >
                <Select placeholder="Select a payment type" onChange={handlePaymentTypeChange}>
                  <Select.Option value="cash">Cash</Select.Option>
                  <Select.Option value="cheque">Cheque</Select.Option>
                </Select>
              </Form.Item>
            </Col>
</Row>
<Row gutter={[16, 16]}> {paymentType === 'cash' && (
              <>
                <Col span={6}>
                  <Form.Item           layout="vertical"
         labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
      name="etatpaiement" label="Payment Status" initialValue="paid">
                    <Select>
                      <Select.Option value="paid" readOnly>Paid</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item   layout="vertical"
         labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }} name="montantPaye" label="Amount Paid" initialValue={editRecord.total_TTC} >
                    <Input readOnly />
                  </Form.Item>
                </Col>
              </>
            )}

            {paymentType === 'cheque' && (
              <>
          
              <Col span={6}>
                  <Form.Item  layout="vertical"
         labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}name="etatpaiement" label="Payment Status" initialValue="paid">
                    <Select  onChange={handlePaymentStatusChange}>
                      <Select.Option value="partially paid">Partially Paid</Select.Option>
                      <Select.Option value="paid">Paid</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item label="Remaining Amount">
              <Input value={montantRestant} readOnly />
            </Form.Item>
          </Col>
        </Row>
                {paymentStatus === 'partially paid' && (
                <Col span={8}>
                      <Form.Item  layout="vertical"
         labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}name={"dateEcheance"} label="Due Date">
                        <DatePicker format="YYYY-MM-DD" />
                      </Form.Item>
                    </Col>)}
                {installments.map((installment, index) => (
                  
                  <React.Fragment key={installment.id}>
       <Row gutter={[16, 16]}>
  <Col span={6}>
    <Form.Item
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name={`numCheque_${index}`}
      label="Cheque Number"
    >
      <Input />
    </Form.Item>
  </Col>
  <Col span={6}>
    <Form.Item
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name={`montantCheque_${index}`}
      label="Cheque Amount"
    >
      <Input onChange={() => calculateMontantRestant(form.getFieldsValue())} />
      
    </Form.Item>
  </Col>
  <Col span={6}>
    <Form.Item
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      name={`dateCh_${index}`}
      label="Cheque Validity"
    >
      <DatePicker format="YYYY-MM-DD" />
    </Form.Item>
  </Col>

  <Col span={6}>
  <Form.Item
      layout="vertical"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}      
      label="Cancel"
      style={{ width: '50px', marginRight: '10px' }}
    >
       
    <Button

      type="text"
      icon={<CloseOutlined />}
      onClick={() => handleRemoveEcheance(index)}
      style={{ color: 'red' }}
    />
     </Form.Item>
  </Col>
</Row>

                  </React.Fragment>
                ))}
       {paymentStatus === 'partially paid' && (
        <Col span={24}>
          <Button type="dashed" onClick={addInstallment} style={{ width: '100%' }}>
            Add Another Cheque
          </Button>
        </Col>
      )}
              </>
            )}
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item style={{marginTop:'20px' }}>
                <Button style={{backgroundColor: '#022452'}} type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}
    </Form>
    </Modal>
  <Modal
  
    visible={isNewInvoiceModalVisible}
    onCancel={() => setIsNewInvoiceModalVisible(false)}
    width={1200}
   
    footer={null}
    
    style={{marginRight:'30px'}}
    
  >
    <Form form={form} onFinish={onFinish}>
   
    <>       <Row gutter={[16, 16]}>
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
    placeholder="Add services"
    onChange={(value) => {
      handleServiceSelect(value);
      handleServiceChangeCalcule(value); // Appel de la deuxième fonction onChange
    }}
  >
    <Option value="">Select services</Option>
    {availableServices.map((service) => (
      <Option key={service._id} value={service._id}>{service.libelle}</Option>
    ))}
  </Select>
</Form.Item>
     </Col> 
  
        
       <Col span={8} >  
       <Form.Item
  name="timbreid"
 
>
  <Select 
    placeholder="Select a stamp."   
    style={{ height: '60px' }}
    onChange={(value) => {
      handleTimbreChange(value); // Appeler la fonction pour la gestion du changement de timbre
      handleChange({ target: { name: 'timbreid', value } }); // Appeler la fonction handleChange pour gérer les changements dans le formulaire
    }}
  > 
    {timbre.map(t => (
      <Option key={t._id} value={t._id}>{t.Valeur} {t.devise ? `(${t.devise.Symbole})` : ''}</Option>
    ))}
  </Select>
</Form.Item>


      </Col> 
</Row> 
      <Table columns={factureTable} dataSource={invoiceData.services} pagination={false} rowKey={(record) => record._id}  />
      <Row gutter={[16, 16]} justify="end">
  <Col span={8}> 
  <Form.Item 
    label="Total HT" 
    name="total_HT" 
    labelAlign="left"
    style={{ marginTop: '10px', marginBottom: '10px' ,marginLeft:'110px'}}
  >
    <InputNumber 
      readOnly 
      value={invoiceData.total_HT}  
      type='number'
      onChange={handleChange} 
      style={{width:'200px'}}
    />
  </Form.Item>


<Form.Item 
  label="Total Remise" 
  name="total_Remise" 
  labelAlign="left"
  style={{ marginBottom: '10px' ,marginLeft:'85px' }}
>
  <InputNumber readOnly value={total_Remise}  type='number'
     onChange={(value) => handleChange({ target: { name: 'total_Remise', value} })} 
       style={{width:'200px'}} />
</Form.Item>

<Form.Item 
  label="Total HT Après Remise" 
  name="total_HT_Apres_Remise" 
  labelAlign="left"
  style={{ marginBottom: '10px',marginLeft:'28px' }}
>
  <InputNumber readOnly value={total_HT_Apres_Remise}  type='number'
       onChange={(value) => handleChange({ target: { name: 'total_HT_Apres_Remise', value } })} 
       style={{width:'200px'}} /> 
</Form.Item>
<Form.Item 
  label="Total TVA" 
  name="total_TVA" 
  labelAlign="left"
  style={{ marginBottom: '10px',marginLeft:'105px' }}
>
  <InputNumber 
    readOnly 
    value={total_TVA}   
    type='number'
    onChange={(value) => handleChange({ target: { name: 'total_TVA', value } })} 
      style={{width:'200px'}}
  />
</Form.Item>


<Form.Item
        label="Stamp"
        name="timbre_Valeur"
        labelAlign="left"
        style={{ marginBottom: '10px', marginLeft: '105px' }}
      >
        <InputNumber
          readOnly
          value={selectedTimbre ? selectedTimbre.Valeur : ''}
          style={{ width: '200px' }}
        />
      </Form.Item>
<Form.Item 
  label="Total TTC" 
  name="total_TTC" 
  labelAlign="left"
  style={{ marginBottom: '10px',marginLeft:'105px' }}
>
  <InputNumber readOnly value={total_TTC}    type='number'
       onChange={(value) => handleChange({ target: { name: 'total_TTC', value } })} style={{width:'200px'}}  /> 
       
</Form.Item>

  </Col>
</Row>



      <Form.Item>
      <Button
            type="primary"
            style={{ width: '100px', marginTop: '20px', backgroundColor: '#022452' }}
            htmlType="submit"
          >
           Create
          </Button>
      </Form.Item>
      
      </>
    </Form>
    </Modal>
    <Table
        style={{ marginTop: '10px' ,clear: 'both'}}
        columns={columns}
        dataSource={facture }
        loading={loading}
   rowKey="Num_Fact"

      />  
       <Modal
            visible={isPrintModalVisible}
            onCancel={handlePrintModalCancel}
            footer={
              <PDFDownloadLink
                document={
                  <Document>
                    <Page size="A4" style={styles.page}>
                      <View style={styles.section}>
                        <Image src={Visto} style={styles.Visto} />
                        <Text style={styles.title}>
                          {selectedFacture
                            ? selectedFacture.Num_Fact
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          Date:{" "}
                          {selectedFacture
                            ? formatDate(selectedFacture.Date_Fact)
                            : "-"}
                        </Text>

                        <Text style={styles.subtitle}>
                          Tax ID:{" "}
                          {selectedFacture && selectedFacture.parametre
                            ? selectedFacture.parametre.Matricule_Fiscale_S
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                        Company name :{" "}
  {selectedFacture && selectedFacture.parametre
    ? selectedFacture.parametre.Nom_S
    : "-"}
</Text>

                        <Text style={styles.subtitle}>
                          Phone:{" "}
                          {selectedFacture && selectedFacture.parametre
                            ? selectedFacture.parametre.Num_Phone_S
                            : "-"}
                        </Text>
                        <Text style={styles.subtitle}>
                          {selectedFacture && selectedFacture.parametre
                            ? `${selectedFacture.parametre.Address_S}, ${selectedFacture.parametre.Paye_S}, ${selectedFacture.parametre.Code_Postal_S}`
                            : "-"}
                        </Text>
                      </View>
                      {/* Informations du client à droite */}
                      <View style={styles.section}>
                        <View style={{ marginTop: -70, marginLeft: 375 }}>
                          {selectedFacture &&
                            selectedFacture.client &&
                            selectedFacture.client.matricule_fiscale && (
                              <Text style={styles.subtitle}>
                                Tax ID:{" "}
                                {selectedFacture.client.matricule_fiscale}
                              </Text>
                            )}
                          <Text style={styles.subtitle}>
                            Client:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.fullname
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
  Country: {" "}
  {selectedFacture && selectedFacture.client
    ? selectedFacture.client.country
    : "-"}
</Text>

                          <Text style={styles.subtitle}>
                            Email:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.email
                              : "-"}
                          </Text>
                          <Text style={styles.subtitle}>
                            Phone:{" "}
                            {selectedFacture && selectedFacture.client
                              ? selectedFacture.client.num_phone
                              : "-"}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.table}>
                        <View style={styles.tableRow}>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                             Ref
                            </Text>
                          </View>
                          <View style={styles.tableColHeaderDesignation}> {/* Utilisation du nouveau style pour "Designation" */}
      <Text style={styles.tableCellHeader}>
        Designation
      </Text>
    </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Unit</Text>
                          </View>
                        
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>Quantity</Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                             PU
                            </Text>
                          </View>
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                            Discount(%)
                            </Text>
                          </View>
                          {/* <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>TVA</Text>
                          </View> */}
                          <View style={styles.tableColHeader}>
                            <Text style={styles.tableCellHeader}>
                            Net Amount
                            </Text>
                          </View>
                        </View>
                        {selectedFacture &&
                        selectedFacture.services &&
                        Array.isArray(selectedFacture.services) &&
                        selectedFacture.services.length > 0 ? (
                          selectedFacture.services.map((service, index) => (
                            <View style={styles.tableRow} key={index}>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.reference}
                                </Text>
                              </View>
                              <View style={styles.tableColDesignation}>
                                <Text style={styles.tableCell}>
                                  {service.libelle}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.unite}
                                </Text>
                              </View>
                       
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.quantite}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.prix_unitaire}
                                </Text>
                              </View>
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.remise}%
                                </Text>
                              </View>
                                     {/* <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.tva}%
                                </Text>
                              </View> */}
                              <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>
                                  {service.montant_HT}
                                </Text>
                              </View>
                            </View>
                          ))
                        ) : (
                          <View style={styles.tableRow}>
                            <View style={styles.tableCol} colSpan={7}>
                              <Text style={styles.tableCell}>
                              No service found
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={styles.totalsContainer}>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.totalsText}>
                          Invoice totalled to" ou "Invoice amounted to{" "}
                          </Text>
                          <Text style={styles.totalsText}>
                            {selectedFacture
                              ? selectedFacture.total_TTC_Lettre
                              : "-"}
                          </Text>
                        </View>
                        <View style={styles.totalsRight}>
                          <View style={styles.totalsTable}>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total HT
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_HT !== undefined
                                    ? selectedFacture.total_HT.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Discount
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_Remise !== undefined
                                    ? selectedFacture.total_Remise.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Net total after Discount
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_HT_Apres_Remise !== undefined
                                    ? selectedFacture.total_HT_Apres_Remise.toFixed(
                                        3
                                      )
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TVA
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture && selectedFacture.total_TVA !== undefined
                                    ? selectedFacture.total_TVA.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                Fiscal Stamp
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture  && selectedFacture.timbre.Valeur !== undefined
                                    ? selectedFacture.timbre.Valeur.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.totalsTableRow}>
                              <View style={styles.totalsTableCellHeader}>
                                <Text style={styles.tableCellHeader}>
                                  Total TTC
                                </Text>
                              </View>
                              <View style={styles.totalsTableCell}>
                                <Text style={styles.tableCell}>
                                  {selectedFacture  && selectedFacture.total_TTC !== undefined
                                    ? selectedFacture.total_TTC.toFixed(3)
                                    : "-"}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>
                         Phone:{" "}
                          {selectedFacture
                            ? selectedFacture.parametre.Num_Phone_S
                            : "-"}{" "}
                          | Email:{" "}
                          {selectedFacture
                            ? selectedFacture.parametre.email
                            : "-"}{" "}
                          |Address:{" "}
                          {selectedFacture
                            ? `${selectedFacture.parametre.Address_S}, ${selectedFacture.parametre.Paye_S}, ${selectedFacture.parametre.Code_Postal_S}`
                            : "-"}
                        </Text>
                      </View>
                    </Page>
                  </Document>
                }
                fileName="facture.pdf"
              >
                {({ loading }) =>
                  loading ? "Chargement..." : "Download PDF"
                }
              </PDFDownloadLink>
            }
            width={800}
          >
            <div
              style={{
                textAlign: "center",
                margin: "20px auto",
                maxWidth: "600px",
              }}
            >
              {selectedFacture && (
                <>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    Invoice number : {selectedFacture.Num_Fact}
                  </p>
                  {/* Ajoutez d'autres détails de la facture ici si nécessaire */}
                  <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                  Click the button below to download your invoice in PDF format:
                  </p>
                  {/* Ajoutez votre bouton de téléchargement ici */}
                </>
              )}
            </div>
          </Modal>
 <Modal
  width={1000}
  visible={isShowModalVisible}
  footer={
    <div style={{ textAlign: "left", padding: "10px 0" }}>
      <p style={{ fontWeight: 'bold' }}>Close this invoice at the amount of: {selectedFacture && selectedFacture.total_TTC_Lettre} {selectedFacture && selectedFacture.devise && selectedFacture.devise.Nom_D}</p>

      {/* Bouton de téléchargement */}
      

    </div>
  }
  onCancel={() => handleShowModalCancel(false)}
>


  {/* Header with image */}
  <div style={{ marginBottom: "20px", textAlign: "left" }}>
    <img src={Visto} alt="logo" style={{ width: "150px" }} />
  </div>

  {/* Invoice details */}
  {selectedFacture && (
    <>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <Title level={3} style={{ fontWeight: 'bold' }}>Invoice N° : {selectedFacture.Num_Fact}</Title>
        <p><span style={{ fontWeight: 'bold' }}>Date:</span> {formatDate(selectedFacture.Date_Fact)}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '10px', marginTop: '-90px' }}>
          <p>{selectedFacture.parametre.Nom_S}</p>
          <p>{selectedFacture.parametre.Address_S}</p>
          <p>{selectedFacture.parametre.Paye_S}</p>
          <p>{selectedFacture.parametre.Num_Phone_S}</p>
          <p>{selectedFacture.parametre.Matricule_Fiscale_S}</p>
        </div>

        <div style={{ flex: 1, textAlign: 'right' }}>
          <p><span style={{ fontWeight: 'bold' }}>Client : </span>{selectedFacture.client.fullname}</p>
          <p><span style={{ fontWeight: 'bold' }}>TIN :</span> {selectedFacture.client.matricule_fiscale || 'N/A'}</p>
          <p><span style={{ fontWeight: 'bold' }}>Address :</span> {selectedFacture.client.address}</p>
          <p><span style={{ fontWeight: 'bold' }}>Num Phone :</span> {selectedFacture.client.num_phone}</p>
        </div>
      </div>

      <Table columns={columnsShow} dataSource={selectedFacture.services} pagination={false} />

      <div style={{ textAlign: "right", marginTop: "0px" }}>
        <p><span style={{ fontWeight: 'bold' }}>Total HT: </span>{selectedFacture.total_HT}</p>
        
        <p><span style={{ fontWeight: 'bold' }}>Total Remise :</span> {selectedFacture.total_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total Net HT :</span> {selectedFacture.total_HT_Apres_Remise}</p>
        <p><span style={{ fontWeight: 'bold' }}>Total TVA :</span> {selectedFacture.total_TVA}</p>
        <p><span style={{ fontWeight: 'bold' }}>Stamp :</span> {selectedFacture.timbre.Valeur}</p>
      
        <p><span style={{ fontWeight: 'bold' }}>Total TTC :</span> {selectedFacture.total_TTC}</p>
      </div>
    </>
  )}
</Modal>

 
    </>
  );
};

export default CreateInvoiceForm;
