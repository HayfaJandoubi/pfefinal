import React from 'react';
import { 
  FiWifi, FiAlertCircle, FiTool, FiUser, FiCheckCircle,
  FiCalendar, FiClock, FiActivity, FiBarChart2, FiMapPin
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

Chart.register(...registerables);

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

const managerSites = [
  { 
    id: 1, 
    name: "Site Sousse Centre", 
    lat: 35.8254, 
    lng: 10.6360, 
    status: "operational", 
    type: "4G",
    lastCheck: "2023-06-15 08:00",
    address: "Rue Habib Bourguiba, Sousse"
  },
  { 
    id: 2, 
    name: "Site Sousse Nord", 
    lat: 35.8421, 
    lng: 10.5923, 
    status: "maintenance", 
    type: "5G",
    lastCheck: "2023-06-14 14:30",
    address: "Avenue Taïeb Mhiri, Sousse"
  },
  { 
    id: 3, 
    name: "Site Sousse Sud", 
    lat: 35.8012, 
    lng: 10.6415, 
    status: "critical", 
    type: "3G",
    lastCheck: "2023-06-15 10:15",
    address: "Route de Tunis, Sousse"
  },
  { 
    id: 4, 
    name: "Site Sousse Port", 
    lat: 35.8215, 
    lng: 10.6218, 
    status: "operational", 
    type: "4G",
    lastCheck: "2023-06-15 09:45",
    address: "Zone Portuaire, Sousse"
  },
];

const managerData = {
  name: "Mohamed Ali",
  email: "m.ali@example.com",
  governorate: "Sousse",
  totalSites: managerSites.length,
  downSites: managerSites.filter(site => site.status !== "operational").length,
  ongoingInterventions: [
    { id: 1, site: "Site Sousse Nord", technician: "Samir Trabelsi", startTime: "2023-06-15 09:30", status: "In Progress" },
    { id: 2, site: "Site Sousse Sud", technician: "Leila Boukadi", startTime: "2023-06-15 11:15", status: "Diagnosing" },
  ],
  assignedTechnicians: [
    { id: 1, name: "Samir Trabelsi", email: "s.trabelsi@example.com", currentTask: "Site Sousse Nord - Power issue" },
    { id: 2, name: "Leila Boukadi", email: "l.boukadi@example.com", currentTask: "Site Sousse Sud - Antenna repair" },
    { id: 3, name: "Karim Hammami", email: "k.hammami@example.com", currentTask: "Available" },
  ],
  recentActivities: [
    { id: 1, action: "Maintenance planifiée", site: "Site Sousse Nord", date: "2023-06-14 14:00", status: "completed" },
    { id: 2, action: "Problème signalé", site: "Site Sousse Sud", date: "2023-06-14 16:30", status: "pending" },
    { id: 3, action: "Intervention terminée", site: "Site Sousse Port", date: "2023-06-15 08:45", status: "completed" },
  ],
  siteStatusData: {
    operational: managerSites.filter(site => site.status === "operational").length,
    maintenance: managerSites.filter(site => site.status === "maintenance").length,
    critical: managerSites.filter(site => site.status === "critical").length
  },
  performanceData: {
    uptime: 99.2,
    lastMonth: 98.7
  }
};

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

const DashboardGest: React.FC = () => {
  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'operational': return theme.success;
      case 'maintenance': return theme.warning;
      case 'critical': return theme.danger;
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
               <i class="fas fa-${status === 'operational' ? 'check' : status === 'maintenance' ? 'tools' : 'exclamation'}"></i>
             </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  const siteStatusChart = {
    labels: ['Opérationnels', 'En maintenance', 'Critiques'],
    datasets: [{
      data: [
        managerData.siteStatusData.operational,
        managerData.siteStatusData.maintenance,
        managerData.siteStatusData.critical
      ],
      backgroundColor: [theme.success, theme.warning, theme.danger],
      hoverBackgroundColor: ['#17a673', '#dda20a', '#be2617'],
      borderWidth: 1,
    }]
  };

  return (
    <Container fluid className="px-4 py-3" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pt-3">
        <div>
          <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>Tableau de Bord</h2>
          <h5 className="text-muted">
            Gestionnaire: <span style={{ color: theme.primary }}>{managerData.name}</span> • 
            Gouvernorat: <span style={{ color: theme.primary }}>{managerData.governorate}</span>
          </h5>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiWifi size={20} />} 
            title="Sites sous gestion" 
            value={managerData.totalSites.toString()} 
            change="+2 ce mois" 
            isPositive={true} 
            color={theme.primary}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiCheckCircle size={20} />} 
            title="Sites opérationnels" 
            value={(managerData.totalSites - managerData.downSites).toString()} 
            change="+1 cette semaine" 
            isPositive={true} 
            color={theme.success}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiAlertCircle size={20} />} 
            title="Sites en panne" 
            value={managerData.downSites.toString()} 
            change="-1 cette semaine" 
            isPositive={false} 
            color={theme.danger}
          />
        </Col>
        <Col xl={3} md={6}>
          <StatCard 
            icon={<FiClock size={20} />} 
            title="Disponibilité" 
            value={`${managerData.performanceData.uptime}%`} 
            change={`${managerData.performanceData.uptime - managerData.performanceData.lastMonth}% vs mois dernier`} 
            isPositive={managerData.performanceData.uptime > managerData.performanceData.lastMonth} 
            color={theme.info}
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row className="g-3 mb-4">
        {/* Map Column */}
        <Col xl={8} lg={7}>
          <Card className="shadow-sm h-100 border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <FiMapPin className="me-2" style={{ color: theme.primary }} />
                  Carte des Sites - {managerData.governorate}
                </h5>
                <div className="d-flex">
                  <Badge bg="light" text="dark" className="me-2">
                    <span className="d-inline-block rounded-circle me-1" style={{ 
                      width: 10, 
                      height: 10, 
                      backgroundColor: theme.success 
                    }}></span>
                    Opérationnels
                  </Badge>
                  <Badge bg="light" text="dark" className="me-2">
                    <span className="d-inline-block rounded-circle me-1" style={{ 
                      width: 10, 
                      height: 10, 
                      backgroundColor: theme.warning 
                    }}></span>
                    Maintenance
                  </Badge>
                  <Badge bg="light" text="dark">
                    <span className="d-inline-block rounded-circle me-1" style={{ 
                      width: 10, 
                      height: 10, 
                      backgroundColor: theme.danger 
                    }}></span>
                    Critiques
                  </Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ height: '400px' }}>
              <MapContainer 
                center={[35.8254, 10.6360]} 
                zoom={12} 
                style={{ height: '100%', width: '100%', borderRadius: '0 0 8px 8px' }}
                minZoom={10}
                maxZoom={16}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {managerSites.map((site) => (
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
                            site.status === "operational" ? "success" : 
                            site.status === "maintenance" ? "warning" : "danger"
                          } className="text-capitalize">
                            {site.status === "operational" ? "Opérationnel" : 
                             site.status === "maintenance" ? "Maintenance" : "Critique"}
                          </Badge>
                        </div>
                        <p className="mb-1 small"><strong>Type:</strong> {site.type}</p>
                        <p className="mb-1 small"><strong>Adresse:</strong> {site.address}</p>
                        <p className="mb-2 small"><strong>Dernier contrôle:</strong> {site.lastCheck}</p>
                        
                        {managerData.ongoingInterventions
                          .filter(i => i.site === site.name)
                          .map(intervention => (
                            <div key={intervention.id} className="mt-2 p-2 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                              <p className="mb-1 small fw-bold text-primary">Intervention en cours</p>
                              <p className="mb-1 small">Technicien: {intervention.technician}</p>
                              <p className="mb-0 small">Début: {intervention.startTime}</p>
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

        {/* Status and Technicians Column */}
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
                  <div style={{ height: '200px' }}>
                    <Pie data={siteStatusChart} options={{ 
                      maintainAspectRatio: false, 
                      plugins: { 
                        legend: { 
                          position: 'bottom',
                          labels: {
                            usePointStyle: true,
                            padding: 20
                          }
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.label}: ${context.raw} sites`;
                            }
                          }
                        }
                      },
                      cutout: '70%'
                    }} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Technicians Card */}
            <Col md={6} lg={12}>
              <Card className="shadow-sm h-100 border-0">
                <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
                  <h5 className="mb-0 fw-bold">
                    <FiUser className="me-2" style={{ color: theme.primary }} />
                    Techniciens Assignés
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="list-group list-group-flush">
                    {managerData.assignedTechnicians.map(tech => (
                      <div key={tech.id} className="list-group-item border-0 py-3 px-4">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{ 
                                 width: 40, 
                                 height: 40, 
                                 backgroundColor: `${theme.primary}20`,
                                 color: theme.primary
                               }}>
                            <FiUser size={18} />
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">{tech.name}</h6>
                            <small className="text-muted">{tech.email}</small>
                          </div>
                          <Badge bg={tech.currentTask === "Available" ? "success" : "primary"} className="text-capitalize">
                            {tech.currentTask === "Available" ? "Disponible" : "Occupé"}
                          </Badge>
                        </div>
                        {tech.currentTask !== "Available" && (
                          <div className="mt-2 small text-muted">
                            <i className="fas fa-tasks me-1"></i> {tech.currentTask}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row className="g-3">
        {/* Recent Activities */}
        <Col xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <h5 className="mb-0 fw-bold">
                <FiCalendar className="me-2" style={{ color: theme.primary }} />
                Activités Récentes
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Action</th>
                      <th className="border-0">Site</th>
                      <th className="border-0">Date</th>
                      <th className="border-0">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managerData.recentActivities.map(activity => (
                      <tr key={activity.id}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className={`rounded-circle d-flex align-items-center justify-content-center me-3`} 
                                 style={{ 
                                   width: 36, 
                                   height: 36, 
                                   backgroundColor: activity.status === "completed" ? `${theme.success}20` : `${theme.warning}20`,
                                   color: activity.status === "completed" ? theme.success : theme.warning
                                 }}>
                              {activity.status === "completed" ? (
                                <FiCheckCircle size={16} />
                              ) : (
                                <FiClock size={16} />
                              )}
                            </div>
                            <span>{activity.action}</span>
                          </div>
                        </td>
                        <td className="align-middle">{activity.site}</td>
                        <td className="align-middle">{activity.date}</td>
                        <td className="align-middle">
                          <Badge bg={activity.status === "completed" ? "success" : "warning"} className="text-capitalize">
                            {activity.status === "completed" ? "Terminé" : "En attente"}
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

        {/* Ongoing Interventions */}
        <Col xl={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white border-bottom-0 pb-2 pt-3">
              <h5 className="mb-0 fw-bold">
                <FiTool className="me-2" style={{ color: theme.primary }} />
                Interventions en Cours
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Site</th>
                      <th className="border-0">Technicien</th>
                      <th className="border-0">Début</th>
                      <th className="border-0">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managerData.ongoingInterventions.map(intervention => (
                      <tr key={intervention.id}>
                        <td className="align-middle fw-bold">{intervention.site}</td>
                        <td className="align-middle">{intervention.technician}</td>
                        <td className="align-middle">{intervention.startTime}</td>
                        <td className="align-middle">
                          <Badge bg={
                            intervention.status === "In Progress" ? "primary" :
                            intervention.status === "Diagnosing" ? "warning" : "secondary"
                          } className="text-capitalize">
                            {intervention.status === "In Progress" ? "En cours" :
                             intervention.status === "Diagnosing" ? "Diagnostic" : "Autre"}
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
        `}
      </style>
    </Container>
  );
};

export default DashboardGest;