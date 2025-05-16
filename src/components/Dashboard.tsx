import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  FiWifi, FiAlertCircle, FiCheckCircle, FiUser, FiTool, 
  FiCalendar, FiClock, FiActivity, FiBarChart2, FiMapPin
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
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

// Sample data with coordinates for Tunisia
const donneesSitesMobiles = [
  { name: 'Jan', actifs: 120, inactifs: 5 },
  { name: 'Fév', actifs: 125, inactifs: 3 },
  { name: 'Mar', actifs: 130, inactifs: 8 },
  { name: 'Avr', actifs: 135, inactifs: 2 },
  { name: 'Mai', actifs: 140, inactifs: 6 },
  { name: 'Jun', actifs: 145, inactifs: 4 },
  { name: 'Jul', actifs: 150, inactifs: 1 },
];

const donneesStatutSites = [
  { name: 'Actifs', value: 145 },
  { name: 'Inactifs', value: 5 },
];

const alertesRecentes = [
  { id: 1, site: 'Site Tunis', type: 'Panne électrique', statut: 'Critique', temps: 'Il y a 10 min' },
  { id: 2, site: 'Site Sfax', type: 'Perte de connexion', statut: 'Avertissement', temps: 'Il y a 25 min' },
  { id: 3, site: 'Site Sousse', type: 'Défaillance matérielle', statut: 'Critique', temps: 'Il y a 1 heure' },
  { id: 4, site: 'Site Bizerte', type: 'Maintenance', statut: 'Info', temps: 'Il y a 2 heures' },
];

const gestionnaires = [
  { id: 1, nom: 'Mohamed Ali', email: 'm.ali@example.com', sites: 12, governorate: 'Sousse' },
  { id: 2, nom: 'Fatma Ben Salah', email: 'f.bensalah@example.com', sites: 8, governorate: 'Tunis' },
  { id: 3, nom: 'Ahmed Khemiri', email: 'a.khemiri@example.com', sites: 15, governorate: 'Sfax' },
];

const techniciens = [
  { id: 1, nom: 'Samir Trabelsi', email: 's.trabelsi@example.com', compétences: '5G, Fibre', governorate: 'Sousse' },
  { id: 2, nom: 'Leila Boukadi', email: 'l.boukadi@example.com', compétences: 'Micro-ondes, Alimentation', governorate: 'Tunis' },
  { id: 3, nom: 'Karim Hammami', email: 'k.hammami@example.com', compétences: 'Antennes, RF', governorate: 'Sfax' },
];

// Sample mobile sites with coordinates in Tunisia
const mobileSites = [
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

  const tunisiaBounds = [
    [30.2306, 7.5219], 
    [37.7612, 11.8801]  
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

  const governorates = [...new Set(mobileSites.map(site => site.governorate))];

  return (
    <Container fluid className="px-4 py-3" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
        <div>
          <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>Tableau de Bord Administrateur</h2>
          <h5 className="text-muted">
            Connecté en tant que: <span style={{ color: theme.primary }}>{nomAdmin}</span>
          </h5>
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
                        {alertesRecentes
                          .filter(alert => alert.site.includes(site.name.split(' ')[1]))
                          .map(alert => (
                            <div key={alert.id} className="mt-2 p-2 rounded" style={{ 
                              backgroundColor: alert.statut === 'Critique' ? '#f8d7da' : 
                                             alert.statut === 'Avertissement' ? '#fff3cd' : '#e2e3e5'
                            }}>
                              <p className="mb-1 small fw-bold">Alerte active</p>
                              <p className="mb-1 small">Type: {alert.type}</p>
                              <p className="mb-0 small">Temps: {alert.temps}</p>
                            </div>
                          ))}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card.Body>
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
                  <h5 className="mb-0 fw-bold">
                    <FiActivity className="me-2" style={{ color: theme.primary }} />
                    Activité Mensuelle
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div style={{ height: '180px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={donneesSitesMobiles}>
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
        {/* Recent Alerts */}
        <Col xl={4}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <h5 className="mb-0 fw-bold">
                <FiAlertCircle className="me-2" style={{ color: theme.primary }} />
                Alertes Récentes
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                {alertesRecentes.map(alerte => (
                  <div key={alerte.id} className="list-group-item border-0 py-3 px-4">
                    <div className="d-flex align-items-start">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center me-3`} 
                           style={{ 
                             width: 40, 
                             height: 40, 
                             backgroundColor: alerte.statut === 'Critique' ? `${theme.danger}20` : 
                                            alerte.statut === 'Avertissement' ? `${theme.warning}20` : `${theme.info}20`,
                             color: alerte.statut === 'Critique' ? theme.danger : 
                                    alerte.statut === 'Avertissement' ? theme.warning : theme.info
                           }}>
                        <FiAlertCircle size={18} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0 fw-bold">{alerte.site}</h6>
                          <Badge bg={
                            alerte.statut === 'Critique' ? 'danger' : 
                            alerte.statut === 'Avertissement' ? 'warning' : 'info'
                          }>
                            {alerte.statut}
                          </Badge>
                        </div>
                        <p className="mb-1 small text-muted">{alerte.type}</p>
                        <p className="mb-0 small">
                          <FiClock className="me-1" size={12} />
                          {alerte.temps}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Managers */}
        <Col xl={4}>
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
                    {gestionnaires.map(gestionnaire => (
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
            </Card.Body>
          </Card>
        </Col>

        {/* Technicians */}
        <Col xl={4}>
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
                    {techniciens.map(technicien => (
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
        `}
      </style>
    </Container>
  );
};

export default Dashboard;