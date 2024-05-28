import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AjoutDevis = () => {
  const [form] = Form.useForm();
 // eslint-disable-next-line
  const [clientId, setClientId] = useState(null);   
  const [devise, setDevise] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/me', {
                method: 'GET',
                credentials: 'include', // Important pour envoyer les cookies avec la requête
            });

            if (response.status === 401) {
                // Redirection ou gestion de l'authentification
                return "Unauthorized";
 
            }

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUserId(data.id);
        }  finally {
          return"  teste"      }
    };

    fetchUserId();
}, []);



console.log(userId);
  useEffect(() => {
    fetchDevise();
    fetchCategories();

  }, []);


  const fetchDevise = async () => {
    try {
      const response = await axios.get('http://localhost:5000/devise');
      setDevise(response.data);
    } catch (error) {
      console.error('Error fetching Devise:', error);
      message.error('Erreur lors de la récupération des devises.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching Categories:', error);
      message.error('Erreur lors de la récupération des catégories.');
    }
  };

  const onFinish = async (values) => {
    try {
      // Envoi des données du formulaire à l'API
      await axios.post('http://localhost:5000/devis', {
        clientId, // Utilisation de l'ID du client récupéré précédemment
        libelle: values.libelle,
        categoriesId: values.categoriesId,
        quantite: values.quantite,
        unite: values.unite,
        commentaire: values.commentaire,
        deviseId: values.deviseId,
      });
      message.success('Devis ajouté avec succès!');
    } catch (error) {
      console.error('Error adding Devis:', error);
      message.error('Erreur lors de l\'ajout du devis.');
    }
  };

  return (
    <div>   
   <div>User ID: {userId}</div>
  
  <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ quantite: 1, unite: 'mois' }}
    >
      <Form.Item
        label="Libellé"
        name="libelle"
        rules={[{ required: true, message: 'Veuillez entrer le libellé' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="categoriesId"
        label="Catégories"
        rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
      >
        <Select placeholder="Sélectionner une catégorie">
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>
              {category.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Quantité"
        name="quantite"
        rules={[{ required: true, message: 'Veuillez entrer la quantité' }]}
      >
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        name="unite"
        label="Unité"
        rules={[{ required: true, message: 'Veuillez sélectionner l\'unité' }]}
      >
        <Select placeholder="Sélectionner l'unité">
          <Option value="heure">Heure</Option>
          <Option value="jour">Jour</Option>
          <Option value="semaine">Semaine</Option>
          <Option value="mois">Mois</Option>
          <Option value="année">Année</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Commentaire"
        name="commentaire"
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="deviseId"
        label="Devise"
        rules={[{ required: true, message: 'Veuillez sélectionner une devise' }]}
      >
        <Select placeholder="Sélectionner une devise">
          {devise.map((dev) => (
            <Option key={dev._id} value={dev._id}>
              {`${dev.name} (${dev.symbol})`}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Le champ clientId est masqué car sa valeur est déjà définie dans le state */}
      <Form.Item
        label="Client ID"
        name="clientId"
        hidden
      >
        <Input value={clientId} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Soumettre
        </Button>
      </Form.Item>
    </Form>
    </div>

  );
};


export default AjoutDevis;
