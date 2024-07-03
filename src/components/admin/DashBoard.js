// src/components/admin/DashBoard.js

import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';


// Fonction pour récupérer les statistiques
const fetchStatistics = async () => {
  const { data } = await axios.get('http://localhost:5000'); // Assurez-vous que cette URL est correcte
  return data;
};

const DashBoard = () => {
  const { data, error, isLoading } = useQuery('statistics', fetchStatistics);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Destructure les données récupérées
  const {
    activeClients,
    activeFinanciers,
    totalServices,
    paidInvoices,
    unpaidInvoices,
    partiallyPaidInvoices,
    totalRevenue
  } = data;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Clients Actifs</h2>
          <p>{activeClients}</p>
        </div>
        <div className="stat-card">
          <h2>Financiers Actifs</h2>
          <p>{activeFinanciers}</p>
        </div>
        <div className="stat-card">
          <h2>Services</h2>
          <p>{totalServices}</p>
        </div>
        <div className="stat-card">
          <h2>Factures Payées</h2>
          <p>{paidInvoices}</p>
        </div>
        <div className="stat-card">
          <h2>Factures Non Payées</h2>
          <p>{unpaidInvoices}</p>
        </div>
        <div className="stat-card">
          <h2>Factures Partiellement Payées</h2>
          <p>{partiallyPaidInvoices}</p>
        </div>
        <div className="stat-card">
          <h2>Chiffre d'Affaires</h2>
          <p>{totalRevenue.toLocaleString()} €</p>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
