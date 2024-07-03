// src/App.js
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Accueil from './accueil/Accueil';
import ResetPassword from './auth/ResetPassword';
import ForgotPassword from './auth/ForgotPassword';
import SendcodeAuth from './auth/SendcodeAuth';
import InvoiceList from './components/client/Facture/InvoiceList';
import DevisAjout from './components/client/Devis/DevisAjout';
import ProfileClient from './components/client/profile/profileClient';
import ChangePass from './components/client/profile/ChangePass';
import DashFinancier from './components/financier/DashFinancier';
import DashAdmin from './components/admin/DashAdmin';
import User from './components/admin/user/User';
import CreatePassword from './components/admin/user/createPassword';
import CreatePassFin from './components/admin/user/createPassFin';
import Categories from './components/admin/Parametre/Categories';
import DashBoard from './components/admin/DashBoard';
import ProtectedRoute from './ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/SendcodeAuth" element={<SendcodeAuth />} />
          
          <Route 
            path="/Client" 
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <InvoiceList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Client/Devis" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <DevisAjout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/DashAdmin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/DashFinancier" 
            element={
              <ProtectedRoute allowedRoles={['FINANCIER']}>
                <DashFinancier />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Users" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <User />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Client/Profil" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ProfileClient />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Client/ChangePassword" 
            element={
              <ProtectedRoute allowedRoles={['CLIENT']}>
                <ChangePass />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-passwordfin/:token" 
            element={
              <ProtectedRoute allowedRoles={['FINANCIER']}>
                <CreatePassword />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-passwordfin/:token" 
            element={
              <ProtectedRoute allowedRoles={['FINANCIER']}>
                <CreatePassFin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/DashBoard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashBoard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Categories" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Categories />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
