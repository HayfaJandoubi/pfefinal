import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, MdPeople, MdEngineering, MdLocationOn, MdLogout 
} from 'react-icons/md';
import { Nav } from 'react-bootstrap';
import logo from '../assets/logoTT.png';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('authToken'); // Remove token if stored
    sessionStorage.removeItem('authToken'); // Or from sessionStorage
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div 
      className="bg-primary text-white d-flex flex-column h-100 p-3"
      style={{ position: 'fixed', width: '280px', top: 0, left: 0, bottom: 0 }}
    >
      {/* Logo and Company Name */}
      <div className="d-flex align-items-center mb-4">
      <img src={logo}
          alt="Tunisie Telecom" 
          className="me-3"
          style={{ width: "90px" }}
        />
        <span className="fs-4 fw-bold">Tunisie Telecom</span>
      </div>
      
      {/* Navigation Links */}
      <Nav className="flex-column mb-auto">
        <Nav.Item>
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center py-2">
            <MdDashboard className="me-3" size={20} />
            Dashboard
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/gestionnaires" className="nav-link text-white d-flex align-items-center py-2">
            <MdPeople className="me-3" size={20} />
            Gestionnaires
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/techniciens" className="nav-link text-white d-flex align-items-center py-2">
            <MdEngineering className="me-3" size={20} />
            Techniciens
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/sitemobile" className="nav-link text-white d-flex align-items-center py-2">
            <MdLocationOn className="me-3" size={20} />
            Sites Mobiles
          </Link>
        </Nav.Item>
      </Nav>
      
      {/* Logout Button */}
      <div className="mt-auto">
        <button 
          onClick={handleLogout} 
          className="btn btn-outline-light d-flex align-items-center w-100 py-2"
        >
          <MdLogout className="me-3" size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;