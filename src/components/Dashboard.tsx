import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  FiWifi, FiAlertCircle, FiCheckCircle, FiUser, FiTool, 
  FiCalendar, FiClock, FiActivity, FiBarChart2, FiMapPin
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button, Pagination, ButtonGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom theme colors
const theme = {
  primary: '#4e73df',
  success: '#1cc88a',
  danger: '#e74a3b',
  warning: '#f6c23e',
  info: '#36b9cc',
  dark: '#5a5c69',
  light: '#f8f9fc',
  secondary: '#858796'
};

// Sample data for different time periods
const activityData = {
  daily: [
    { name: 'Lun', actifs: 142, inactifs: 3 },
    { name: 'Mar', actifs: 145, inactifs: 2 },
    { name: 'Mer', actifs: 143, inactifs: 4 },
    { name: 'Jeu', actifs: 147, inactifs: 1 },
    { name: 'Ven', actifs: 146, inactifs: 2 },
    { name: 'Sam', actifs: 144, inactifs: 3 },
    { name: 'Dim', actifs: 141, inactifs: 6 },
  ],
  weekly: [
    { name: 'Sem 1', actifs: 140, inactifs: 5 },
    { name: 'Sem 2', actifs: 143, inactifs: 4 },
    { name: 'Sem 3', actifs: 145, inactifs: 2 },
    { name: 'Sem 4', actifs: 147, inactifs: 1 },
  ],
  monthly: [
    { name: 'Jan', actifs: 120, inactifs: 5 },
    { name: 'Fév', actifs: 125, inactifs: 3 },
    { name: 'Mar', actifs: 130, inactifs: 8 },
    { name: 'Avr', actifs: 135, inactifs: 2 },
    { name: 'Mai', actifs: 140, inactifs: 6 },
    { name: 'Jun', actifs: 145, inactifs: 4 },
    { name: 'Jul', actifs: 150, inactifs: 1 },
  ],
  yearly: [
    { name: '2020', actifs: 100, inactifs: 15 },
    { name: '2021', actifs: 120, inactifs: 10 },
    { name: '2022', actifs: 135, inactifs: 8 },
    { name: '2023', actifs: 145, inactifs: 5 },
  ]
};

const donneesStatutSites = [
  { name: 'Actifs', value: 145 },
  { name: 'Inactifs', value: 5 },
];

const gestionnaires = [
  { id: 1, nom: 'Mohamed Ali', email: 'm.ali@example.com', sites: 12, governorate: 'Sousse' },
  { id: 2, nom: 'Fatma Ben Salah', email: 'f.bensalah@example.com', sites: 8, governorate: 'Tunis' },
  { id: 3, nom: 'Ahmed Khemiri', email: 'a.khemiri@example.com', sites: 15, governorate: 'Sfax' },
  { id: 4, nom: 'Samira Dridi', email: 's.dridi@example.com', sites: 10, governorate: 'Bizerte' },
  { id: 5, nom: 'Hassen Mrad', email: 'h.mrad@example.com', sites: 7, governorate: 'Gabès' },
  { id: 6, nom: 'Nadia Ferjani', email: 'n.ferjani@example.com', sites: 9, governorate: 'Nabeul' },
];

const techniciens = [
  { id: 1, nom: 'Samir Trabelsi', email: 's.trabelsi@example.com', compétences: '5G, Fibre', governorate: 'Sousse' },
  { id: 2, nom: 'Leila Boukadi', email: 'l.boukadi@example.com', compétences: 'Micro-ondes, Alimentation', governorate: 'Tunis' },
  { id: 3, nom: 'Karim Hammami', email: 'k.hammami@example.com', compétences: 'Antennes, RF', governorate: 'Sfax' },
  { id: 4, nom: 'Youssef Ben Amor', email: 'y.benamor@example.com', compétences: 'Réseaux IP, Routage', governorate: 'Bizerte' },
  { id: 5, nom: 'Amira Chaabane', email: 'a.chaabane@example.com', compétences: 'Virtualisation, Cloud', governorate: 'Gabès' },
  { id: 6, nom: 'Walid Karray', email: 'w.karray@example.com', compétences: 'Sécurité, Firewall', governorate: 'Nabeul' },
];

// Sample mobile sites with coordinates in Tunisia
const mobileSites: {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: string;
  type: string;
  governorate: string;
}[] = [
  { id: 1, name: 'Site Tunis', lat: 36.8065, lng: 10.1815, status: 'active', type: '4G', governorate: 'Tunis' },
  { id: 2, name: 'Site Sfax', lat: 34.7406, lng: 10.7603, status: 'active', type: '5G', governorate: 'Sfax' },
  { id: 3, name: 'Site Sousse', lat: 35.8254, lng: 10.6360, status: 'inactive', type: '3G', governorate: 'Sousse' },
  { id: 4, name: 'Site Bizerte', lat: 37.2744, lng: 9.8739, status: 'active', type: '4G', governorate: 'Bizerte' },
  { id: 5, name: 'Site Gabès', lat: 33.8815, lng: 10.0983, status: 'maintenance', type: '3G', governorate: 'Gabès' },
];

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive, color = theme.primary }) => (
  <Card className="shadow-sm h-100 border-0">
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-2 text-uppercase small">{title}</h6>
          <h3 className="mb-0" style={{ color }}>{value}</h3>
          <small className={`${isPositive ? "text-success" : "text-danger"} fw-bold`}>
            {change} {isPositive ? (
              <i className="fas fa-arrow-up"></i>
            ) : (
              <i className="fas fa-arrow-down"></i>
            )}
          </small>
        </div>
        <div className={`rounded-circle d-flex align-items-center justify-content-center`} 
             style={{ 
               width: 48, 
               height: 48, 
               backgroundColor: `${color}20`,
               color: color
             }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Dashboard: React.FC = () => {
  const nomAdmin = "Admin Principal";
  const [activeGovernorate, setActiveGovernorate] = React.useState<string | null>(null);
  
  // Pagination state for managers
  const [managersPage, setManagersPage] = React.useState(1);
  const managersPerPage = 4;
  
  // Pagination state for technicians
  const [techniciansPage, setTechniciansPage] = React.useState(1);
  const techniciansPerPage = 4;

  // Activity chart period state
  const [activityPeriod, setActivityPeriod] = React.useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Tunisia bounds as LatLngBoundsExpression
  const tunisiaBounds: L.LatLngBoundsExpression = [
    [30.2306, 7.5219] as L.LatLngTuple, 
    [37.7612, 11.8801] as L.LatLngTuple
  ];

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return theme.success;
      case 'inactive': return theme.danger;
      case 'maintenance': return theme.warning;
      default: return theme.secondary;
    }
  };

  const createCustomIcon = (status: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${getMarkerColor(status)}; 
             width: 24px; 
             height: 24px; 
             border-radius: 50%; 
             border: 2px solid white;
             display: flex;
             align-items: center;
             justify-content: center;
             color: white;
             font-weight: bold;
             box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
               <i class="fas fa-${status === 'active' ? 'check' : status === 'maintenance' ? 'tools' : 'exclamation'}"></i>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const filteredSites = activeGovernorate 
    ? mobileSites.filter(site => site.governorate === activeGovernorate)
    : mobileSites;

  const governorates = Array.from(new Set(mobileSites.map(site => site.governorate)));

  // Get current managers for pagination
  const indexOfLastManager = managersPage * managersPerPage;
  const indexOfFirstManager = indexOfLastManager - managersPerPage;
  const currentManagers = gestionnaires.slice(indexOfFirstManager, indexOfLastManager);
  const totalManagerPages = Math.ceil(gestionnaires.length / managersPerPage);

  // Get current technicians for pagination
  const indexOfLastTechnician = techniciansPage * techniciansPerPage;
  const indexOfFirstTechnician = indexOfLastTechnician - techniciansPerPage;
  const currentTechnicians = techniciens.slice(indexOfFirstTechnician, indexOfLastTechnician);
  const totalTechnicianPages = Math.ceil(techniciens.length / techniciansPerPage);

  return (
    <Container fluid className="px-4 py-3" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
        <div>
          <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>Tableau de Bord Administrateur</h2>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiWifi size={20} />} 
            title="Sites Mobiles Totaux" 
            value="150" 
            change="+5% ce mois" 
            isPositive={true} 
            color={theme.primary}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiCheckCircle size={20} />} 
            title="Sites Actifs" 
            value="145" 
            change="+3% cette semaine" 
            isPositive={true} 
            color={theme.success}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiAlertCircle size={20} />} 
            title="Sites Inactifs" 
            value="5" 
            change="-2% cette semaine" 
            isPositive={false} 
            color={theme.danger}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiClock size={20} />} 
            title="Alertes Actives" 
            value="8" 
            change="+2 aujourd'hui" 
            isPositive={false} 
            color={theme.warning}
          />
        </Col>
      </Row>
      
      {/* Map and Charts Row */}
      <Row className="mb-4 g-3">
        {/* Map Column */}
        <Col xl={8} lg={7}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <FiMapPin className="me-2" style={{ color: theme.primary }} />
                  Carte des Sites en Tunisie
                </h5>
                <div className="d-flex align-items-center">
                  <span className="me-2 small">Filtrer par gouvernorat:</span>
                  <select 
                    className="form-select form-select-sm" 
                    style={{ width: '150px' }}
                    value={activeGovernorate || ''}
                    onChange={(e) => setActiveGovernorate(e.target.value || null)}
                  >
                    <option value="">Tous</option>
                    {governorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ height: '400px' }}>
              <MapContainer 
                center={[34.0, 9.0]} 
                zoom={6} 
                style={{ height: '100%', width: '100%', borderRadius: '0 0 8px 8px' }}
                minZoom={6}
                maxBounds={tunisiaBounds}
                maxBoundsViscosity={1.0}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredSites.map((site) => (
                  <Marker 
                    key={site.id}
                    position={[site.lat, site.lng]}
                    icon={createCustomIcon(site.status)}
                  >
                    <Popup className="custom-popup">
                      <div className="p-2">
                        <h6 className="fw-bold mb-2">{site.name}</h6>
                        <div className="d-flex align-items-center mb-1">
                          <small className="text-muted me-2">Statut:</small>
                          <Badge bg={
                            site.status === "active" ? "success" : 
                            site.status === "inactive" ? "danger" : "warning"
                          } className="text-capitalize">
                            {site.status === "active" ? "Actif" : 
                             site.status === "inactive" ? "Inactif" : "Maintenance"}
                          </Badge>
                        </div>
                        <p className="mb-1 small"><strong>Type:</strong> {site.type}</p>
                        <p className="mb-1 small"><strong>Gouvernorat:</strong> {site.governorate}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card.Body>
            <Card.Footer className="bg-white border-top-0 pt-2 pb-3">
              <div className="d-flex justify-content-start">
                <div className="d-flex align-items-center me-4">
                  <div className="rounded-circle me-2" style={{ width: 12, height: 12, backgroundColor: theme.success }}></div>
                  <small className="text-muted">Site Actif</small>
                </div>
                <div className="d-flex align-items-center me-4">
                  <div className="rounded-circle me-2" style={{ width: 12, height: 12, backgroundColor: theme.danger }}></div>
                  <small className="text-muted">Site Inactif</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="rounded-circle me-2" style={{ width: 12, height: 12, backgroundColor: theme.warning }}></div>
                  <small className="text-muted">En Maintenance</small>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
        
        {/* Charts Column */}
        <Col xl={4} lg={5}>
          <Row className="g-3 h-100">
            {/* Status Chart */}
            <Col md={6} lg={12}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
                  <h5 className="mb-0 fw-bold">
                    <FiBarChart2 className="me-2" style={{ color: theme.primary }} />
                    Statut des Sites
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donneesStatutSites}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill={theme.success} />
                          <Cell fill={theme.danger} />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} sites`, 'Nombre']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Monthly Activity Chart */}
            <Col md={6} lg={12}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                      <FiActivity className="me-2" style={{ color: theme.primary }} />
                      Activité des Sites
                    </h5>
                    <ButtonGroup size="sm">
                      <Button 
                        variant={activityPeriod === 'daily' ? 'primary' : 'outline-primary'}
                        onClick={() => setActivityPeriod('daily')}
                      >
                        Jour
                      </Button>
                      <Button 
                        variant={activityPeriod === 'weekly' ? 'primary' : 'outline-primary'}
                        onClick={() => setActivityPeriod('weekly')}
                      >
                        Semaine
                      </Button>
                      <Button 
                        variant={activityPeriod === 'monthly' ? 'primary' : 'outline-primary'}
                        onClick={() => setActivityPeriod('monthly')}
                      >
                        Mois
                      </Button>
                      <Button 
                        variant={activityPeriod === 'yearly' ? 'primary' : 'outline-primary'}
                        onClick={() => setActivityPeriod('yearly')}
                      >
                        Année
                      </Button>
                    </ButtonGroup>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData[activityPeriod]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="actifs" fill={theme.primary} name="Sites Actifs" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="inactifs" fill={theme.danger} name="Sites Inactifs" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row className="g-3">
        {/* Managers */}
        <Col xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <h5 className="mb-0 fw-bold">
                <FiUser className="me-2" style={{ color: theme.primary }} />
                Gestionnaires
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Nom</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Sites</th>
                      <th className="border-0">Gouvernorat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentManagers.map(gestionnaire => (
                      <tr key={gestionnaire.id}>
                        <td className="align-middle fw-bold">{gestionnaire.nom}</td>
                        <td className="align-middle small">{gestionnaire.email}</td>
                        <td className="align-middle">
                          <Badge bg="primary" pill>
                            {gestionnaire.sites}
                          </Badge>
                        </td>
                        <td className="align-middle">
                          <Badge bg="light" text="dark">
                            {gestionnaire.governorate}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Card.Footer className="bg-white border-top-0 py-2">
                <div className="d-flex justify-content-end">
                  <Pagination className="mb-0">
                    <Pagination.Prev 
                      disabled={managersPage === 1} 
                      onClick={() => setManagersPage(managersPage - 1)} 
                    />
                    {Array.from({ length: totalManagerPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === managersPage}
                        onClick={() => setManagersPage(i + 1)}
                        style={{
                          backgroundColor: i + 1 === managersPage ? 'rgba(78, 115, 223, 0.2)' : 'transparent',
                          color: i + 1 === managersPage ? theme.primary : '#6c757d',
                          borderColor: 'transparent'
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={managersPage === totalManagerPages} 
                      onClick={() => setManagersPage(managersPage + 1)} 
                    />
                  </Pagination>
                </div>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Technicians */}
        <Col xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <h5 className="mb-0 fw-bold">
                <FiTool className="me-2" style={{ color: theme.primary }} />
                Techniciens
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Nom</th>
                      <th className="border-0">Email</th>
                      <th className="border-0">Compétences</th>
                      <th className="border-0">Gouvernorat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTechnicians.map(technicien => (
                      <tr key={technicien.id}>
                        <td className="align-middle fw-bold">{technicien.nom}</td>
                        <td className="align-middle small">{technicien.email}</td>
                        <td className="align-middle small">{technicien.compétences}</td>
                        <td className="align-middle">
                          <Badge bg="light" text="dark">
                            {technicien.governorate}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Card.Footer className="bg-white border-top-0 py-2">
                <div className="d-flex justify-content-end">
                  <Pagination className="mb-0">
                    <Pagination.Prev 
                      disabled={techniciansPage === 1} 
                      onClick={() => setTechniciansPage(techniciansPage - 1)} 
                    />
                    {Array.from({ length: totalTechnicianPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === techniciansPage}
                        onClick={() => setTechniciansPage(i + 1)}
                        style={{
                          backgroundColor: i + 1 === techniciansPage ? 'rgba(78, 115, 223, 0.2)' : 'transparent',
                          color: i + 1 === techniciansPage ? theme.primary : '#6c757d',
                          borderColor: 'transparent'
                        }}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={techniciansPage === totalTechnicianPages} 
                      onClick={() => setTechniciansPage(techniciansPage + 1)} 
                    />
                  </Pagination>
                </div>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

      {/* Custom styles */}
      <style>
        {`
          .card {
            border-radius: 8px;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            border-radius: 6px;
          }
          .table th {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.5px;
          }
          .list-group-item {
            transition: all 0.2s;
          }
          .list-group-item:hover {
            background-color: #f8f9fa;
          }
          .recharts-legend-item-text {
            font-size: 0.8rem !important;
          }
          .page-item.active .page-link {
            background-color: rgba(78, 115, 223, 0.2) !important;
            border-color: transparent !important;
            color: ${theme.primary} !important;
            font-weight: 600;
          }
          .page-link {
            color: #6c757d;
            border-color: transparent;
          }
          .page-link:hover {
            background-color: rgba(78, 115, 223, 0.1);
            color: ${theme.primary};
          }
        `}
      </style>
    </Container>
  );
};

export default Dashboard;