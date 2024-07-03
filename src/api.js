// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const fetchActiveClients = async () => {
  const response = await axios.get(`${API_URL}/clients/active`);
  return response.data;
};

export const fetchActiveFinanciers = async () => {
  const response = await axios.get(`${API_URL}/financiers/active`);
  return response.data;
};

export const fetchTotalServices = async () => {
  const response = await axios.get(`${API_URL}/services/total`);
  return response.data;
};

export const fetchInvoicesByPaymentStatus = async () => {
  const response = await axios.get(`${API_URL}/invoices/payment-status`);
  return response.data;
};

export const fetchRevenue = async () => {
  const response = await axios.get(`${API_URL}/revenue`);
  return response.data;
};
