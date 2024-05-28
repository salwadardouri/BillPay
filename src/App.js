import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Accueil from './accueil/Accueil';
import ResetPassword from './auth/ResetPassword';
import ForgotPassword from './auth/ForgotPassword';
import SendcodeAuth from './auth/SendcodeAuth';
import AccueilClient from './components/client/AccueilClient';
import DevisAjout from './components/client/Devis/DevisAjout';
import DashFinancier from './components/financier/DashFinancier';
import DashAdmin from './components/admin/DashAdmin';
import User from './components/admin/user/User';
import CreatePassword from './components/admin/user/createPassword';
import CreatePassFin from './components/admin/user/createPassFin';
import Categories from './components/admin/Parametre/Categories';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Accueil />} /> {/* Mettez à jour le chemin selon vos besoins */}
          <Route path="/SignIn" element={<SignIn />} /> 
          <Route path="/SignUp" element={<SignUp />} /> 
          <Route path="/Categories" element={<Categories/>} /> 
          <Route path="/ResetPassword" element={<ResetPassword/>} />
          <Route path="/ForgotPassword" element={<ForgotPassword/>} />
          <Route path="/SendcodeAuth" element={<SendcodeAuth/>} />
          <Route path="/Client" element={<AccueilClient/>} /> 
          <Route path="/Client/Devis" element={<DevisAjout/>} /> 
          <Route path="/DashAdmin" element={<DashAdmin/>} />
          <Route path="/DashFinancier" element={<DashFinancier/>} />
          <Route path="/Users" element={<User/>} />
          <Route path="/create-passwordfin/:token" element={<CreatePassword/>} />
          <Route path="/create-passwordfin/:token" element={<CreatePassFin/>} />
        

        </Routes>
      </div>
    </Router>
  );
}

export default App;
