import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdEngineering,
  MdLocationOn,
  MdLogout,
  MdGroupWork,
  MdInventory,
  MdChevronRight,
  MdExpandMore
} from 'react-icons/md';
import { Nav } from 'react-bootstrap';
import logo from '../assets/logoTT.png';

type SidebarItem = {
  path?: string;
  label: string;
  icon: React.ReactNode;
  subItems?: SidebarItem[];
};

type Role = 'admin' | 'gestionnaire' | 'technicien';

interface SidebarProps {
  role: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/login');
  };

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkMap: Record<Role, SidebarItem[]> = {
    admin: [
      { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard size={24} /> },
      { path: '/gestionnaireform', label: 'Ajouter Utilisateur', icon: <MdEngineering size={24} /> },
      { path: '/gestionnaires', label: 'Gestionnaires', icon: <MdPeople size={24} /> },
      { path: '/techniciens', label: 'Techniciens', icon: <MdEngineering size={24} /> },
      { path: '/sitemobile', label: 'Sites Mobiles', icon: <MdLocationOn size={24} /> },
    ],
    gestionnaire: [
      { path: '/dashboardgest', label: 'Dashboard', icon: <MdDashboard size={24} /> },
      { path: '/techniciangest', label: 'Équipe', icon: <MdEngineering size={24} /> },
      {
        label: 'Sites Mobiles',
        icon: <MdGroupWork size={24} />,
        subItems: [
          { path: '/sitegest', label: 'Liste des sites', icon: <MdLocationOn size={20} /> },
          { path: '/sitepanne', label: 'Sites en panne', icon: <MdLocationOn size={20} /> },
        ]
      }
    ],
    technicien: [
      { path: '/dashboardtech', label: 'Dashboard', icon: <MdDashboard size={24} /> },
      { path: '/intervention', label: 'Interventions', icon: <MdEngineering size={24} /> },
      { path: '/inventory', label: 'Inventaire', icon: <MdInventory size={24} /> },
    ],
  };

  const renderNavItems = (items: SidebarItem[]) => {
    return items.map((item, index) => (
      <React.Fragment key={index}>
        {item.path ? (
          <Nav.Item>
            <Nav.Link 
              as={Link} 
              to={item.path} 
              className={`d-flex align-items-center py-3 px-3 mb-1 text-white ${isActive(item.path) ? 'active-item' : 'hover-item'}`}
            >
              <span className="me-3">{item.icon}</span>
              <span>{item.label}</span>
            </Nav.Link>
          </Nav.Item>
        ) : (
          <>
            <div 
              className={`d-flex align-items-center py-3 px-3 mb-1 text-white ${expandedItems[item.label] ? 'active-item' : 'hover-item'}`}
              onClick={() => toggleExpand(item.label)}
              style={{ cursor: 'pointer' }}
            >
              <span className="me-3">{item.icon}</span>
              <span>{item.label}</span>
              <span className="ms-auto">
                {expandedItems[item.label] ? <MdExpandMore size={20} /> : <MdChevronRight size={20} />}
              </span>
            </div>
            {expandedItems[item.label] && item.subItems?.map((sub, subIndex) => (
              <Nav.Item key={subIndex}>
                <Nav.Link 
                  as={Link} 
                  to={sub.path!} 
                  className={`d-flex align-items-center py-2 ps-5 mb-1 text-white ${isActive(sub.path!) ? 'active-item' : 'hover-item'}`}
                >
                  <span className="me-3">{sub.icon}</span>
                  <span>{sub.label}</span>
                </Nav.Link>
              </Nav.Item>
            ))}
          </>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div
      className="bg-primary d-flex flex-column h-100 p-0"
      style={{
        width: '280px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="d-flex align-items-center p-4 mb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <img
          src={logo}
          alt="Tunisie Telecom"
          className="me-3"
          style={{ width: '65px' }}  
        />
        <span className="fs-5 fw-bold text-white">Tunisie Telecom</span>
      </div>

      <div className="flex-grow-1 px-3" style={{ overflowY: 'auto' }}>
        <Nav className="flex-column">
          {renderNavItems(linkMap[role])}
        </Nav>
      </div>

      <div className="p-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light d-flex align-items-center justify-content-center w-100 py-2 rounded-pill"
        >
          <MdLogout className="me-2" size={20} />
          <span>Déconnexion</span>
        </button>
      </div>

      <style>{`
        .hover-item {
          transition: all 0.2s ease;
          background-color: transparent;
          border-radius: 8px;
        }
        .hover-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .active-item {
          background-color: rgba(255, 255, 255, 0.2) !important;
          font-weight: 500;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;