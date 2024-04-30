import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal ,message} from 'antd';
import axios from 'axios';

const CollectionCreateForm = ({ initialValues, onFormInstanceReady }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
  }, [form, onFormInstanceReady]);

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      <Form.Item
        name="Titre_Categorie"
        label="Title"
        rules={[
          {
            required: true,
            message: 'Please input the title of the collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="Description_Categorie" label="Description" rules={[
          {
            required: true,
            message: 'Please input the title of the collection!',
          },
        ]}>
        <Input.TextArea />
      </Form.Item>
      
    </Form>
  );
};

const CollectionCreateFormModal = ({ open, onCreate, onCancel, initialValues }) => {
  const [formInstance, setFormInstance] = useState(null);

  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{ autoFocus: true }}
      onCancel={onCancel}
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          onCreate(values);
        } catch (error) {
          console.error('Failed:', error);
        }
      }}
      destroyOnClose
    >
      <CollectionCreateForm
        initialValues={initialValues}
        onFormInstanceReady={setFormInstance}
      />
    </Modal>
  );
};

const Categories = () => {
  // eslint-disable-next-line
  const [formValues, setFormValues] = useState({});
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
 

  const onCreate = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/categories', values);
      if (!response.status === 201) {
        throw new Error('Failed to create category'); // Erreur générale si le statut n'est pas correct
      }
  
      console.log('Created category:', response.data);
  
      // Ajoutez la nouvelle catégorie à l'état local
      setCategories([...categories, response.data]);
  
      // Fermez le formulaire
      setOpen(false);
   
      // Affichez un message de succès
      message.success('Category created successfully!');
    } catch (error) {
      // Si une erreur est survenue, affichez le message d'erreur correspondant
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Error creating category: ${error.response.data.message}`);
      } else {
        message.error('An error occurred while creating the category.');
      }
  
      console.error('Error creating category:', error); // Loggez l'erreur dans la console
    } 
  };
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        New Collection
      </Button>

  
      <CollectionCreateFormModal
        open={open}
        onCreate={onCreate}
        onCancel={() => setOpen(false)}
        initialValues={{ modifier: 'public' }}
      />
    </>
  );
};

export default Categories;
