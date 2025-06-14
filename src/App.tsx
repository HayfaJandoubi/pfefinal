import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Layout from './components/Layout';
import GestionnaireList from './components/GestionnaireList';
import TechnicianList from './components/TechnicianList';
import SiteMobile from './components/SiteMobile';
import Dashboard from "./components/Dashboard";
import GestionnaireForm from './components/GestionnaireForm';
import SiteEnAttente from './components/SiteEnAttente';
import Login from './components/Login';
import DashboardGest from "./components/DashboardGest";
import DashboardTech from "./components/DashboardTech";
import AjoutSite from './components/AjoutSite';
import SiteGest from './components/SiteGest'; 
import SitePanne from './components/SitePanne';   
import DetailsIntervention from './components/DetailsIntervention';
import RapportIntervention from './components/RapportIntervention';
import MajEtat from './components/MajEtat';
import AssignerTech from './components/AssignerTech'; 
import TechDashboard from "./components/TechDashboard";
import Intervention from './components/Intervention';
import TechnicianGest from "./components/TechnicianGest";
import React from "react";

// A wrapper to conditionally show layout
const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  const handleLogin = () => {
    // Your login logic here
    // This would typically navigate to another page after successful login
  };

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Layout>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/gestionnaires" element={<GestionnaireList />} />
            <Route path="/techniciens" element={<TechnicianList />} />
            <Route path="/sitemobile" element={<SiteMobile />} />
            <Route path="/gestionnaireform" element={<GestionnaireForm />} />
            <Route path="/sitesenattente" element={<SiteEnAttente />} />
            <Route path="/dashboardgest" element={<DashboardGest />} />
            <Route path="/dashboardtech" element={<DashboardTech />} />
            <Route path="/ajoutsite" element={<AjoutSite />} />
            <Route path="/sitegest" element={<SiteGest />} />
            <Route path="/sitepanne" element={<SitePanne />} /> 
            <Route path="/details-intervention" element={<DetailsIntervention />} />
            <Route path="/rapport-intervention" element={<RapportIntervention />} />
            <Route path="/majetat" element={<MajEtat />} />
            <Route path="/assigner-technicien" element={<AssignerTech />} />  
            <Route path="/techdashboard" element={<TechDashboard />} />
            <Route path="/intervention" element={<Intervention />} /> 
            <Route path="/techniciangest" element={<TechnicianGest />} />
          </Routes>
        </Layout>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;