import React from 'react';
import { 
  FiWifi, FiAlertCircle, FiTool, FiUser, FiCheckCircle,
  FiPlusCircle, FiCalendar, FiClock, FiActivity, FiBarChart2
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button } from 'react-bootstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const managerData = {
  name: "Mohamed Ali",
  email: "m.ali@example.com",
  totalSites: 12,
  downSites: 2,
  ongoingInterventions: [
    { id: 1, site: "Site A", technician: "Samir Trabelsi", startTime: "2023-06-15 09:30", status: "In Progress" },
    { id: 2, site: "Site C", technician: "Leila Boukadi", startTime: "2023-06-15 11:15", status: "Diagnosing" },
  ],
  assignedTechnicians: [
    { id: 1, name: "Samir Trabelsi", email: "s.trabelsi@example.com", currentTask: "Site A - Power issue" },
    { id: 2, name: "Leila Boukadi", email: "l.boukadi@example.com", currentTask: "Site C - Antenna repair" },
    { id: 3, name: "Karim Hammami", email: "k.hammami@example.com", currentTask: "Available" },
  ],
  recentActivities: [
    { id: 1, action: "Maintenance planifiée", site: "Site B", date: "2023-06-14 14:00", status: "completed" },
    { id: 2, action: "Problème signalé", site: "Site D", date: "2023-06-14 16:30", status: "pending" },
    { id: 3, action: "Intervention terminée", site: "Site E", date: "2023-06-15 08:45", status: "completed" },
  ],
  siteStatusData: {
    operational: 10,
    maintenance: 2,
    critical: 1
  },
  performanceData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    uptime: [98.5, 97.8, 99.2, 98.9, 99.5, 99.8],
    interventions: [5, 8, 4, 6, 3, 2]
  }
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => (
  <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #4e73df' }}>
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className="mb-0">{value}</h4>
          <small className={isPositive ? "text-success" : "text-danger"}>
            {change}
          </small>
        </div>
        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const DashboardGest: React.FC = () => {
  const siteStatusChart = {
    labels: ['Opérationnels', 'En maintenance', 'Critiques'],
    datasets: [{
      data: [
        managerData.siteStatusData.operational,
        managerData.siteStatusData.maintenance,
        managerData.siteStatusData.critical
      ],
      backgroundColor: ['#4e73df', '#1cc88a', '#e74a3b'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#be2617'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }]
  };

  const performanceChart = {
    labels: managerData.performanceData.labels,
    datasets: [
      {
        label: "Taux de disponibilité (%)",
        backgroundColor: "rgba(78, 115, 223, 0.5)",
        borderColor: "rgba(78, 115, 223, 1)",
        data: managerData.performanceData.uptime,
        tension: 0.4,
      },
      {
        label: "Interventions",
        backgroundColor: "rgba(231, 74, 59, 0.5)",
        borderColor: "rgba(231, 74, 59, 1)",
        data: managerData.performanceData.interventions,
        tension: 0.4,
      }
    ]
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1" style={{ color: '#2c3e50' }}>Tableau de Bord Gestionnaire</h2>
          <h5 className="text-muted">Bienvenue, <span style={{ color: '#4e73df' }}>{managerData.name}</span></h5>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiWifi size={20} color="#4e73df" />} 
            title="Sites sous gestion" 
            value={managerData.totalSites.toString()} 
            change="+2 ce mois" 
            isPositive={true} 
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#1cc88a" />} 
            title="Sites opérationnels" 
            value={(managerData.totalSites - managerData.downSites).toString()} 
            change="+1 cette semaine" 
            isPositive={true} 
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiAlertCircle size={20} color="#e74a3b" />} 
            title="Sites en panne" 
            value={managerData.downSites.toString()} 
            change="-1 cette semaine" 
            isPositive={false} 
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiClock size={20} color="#f6c23e" />} 
            title="Interventions en cours" 
            value={managerData.ongoingInterventions.length.toString()} 
            change="+2 cette semaine" 
            isPositive={false} 
          />
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiBarChart2 className="me-2" style={{ color: '#4e73df' }} />
                Statut des sites
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Pie data={siteStatusChart} options={{ 
                  maintainAspectRatio: false, 
                  plugins: { 
                    legend: { 
                      position: 'bottom' 
                    } 
                  } 
                }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiActivity className="me-2" style={{ color: '#4e73df' }} />
                Performance mensuelle
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <Line data={performanceChart} options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiCalendar className="me-2" style={{ color: '#4e73df' }} />
                Activités récentes
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Action</th>
                    <th>Site</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.recentActivities.map(activity => (
                    <tr key={activity.id}>
                      <td>{activity.action}</td>
                      <td>{activity.site}</td>
                      <td>{activity.date}</td>
                      <td>
                        <Badge bg={activity.status === "completed" ? "success" : "warning"}>
                          {activity.status === "completed" ? "Terminé" : "En attente"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ongoing Interventions and Technicians */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiTool className="me-2" style={{ color: '#4e73df' }} />
                Interventions en cours
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Site</th>
                    <th>Technicien</th>
                    <th>Début</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.ongoingInterventions.map(intervention => (
                    <tr key={intervention.id}>
                      <td>{intervention.site}</td>
                      <td>{intervention.technician}</td>
                      <td>{intervention.startTime}</td>
                      <td>
                        <Badge bg={
                          intervention.status === "In Progress" ? "primary" :
                          intervention.status === "Diagnosing" ? "warning" : "secondary"
                        }>
                          {intervention.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiUser className="me-2" style={{ color: '#4e73df' }} />
                Techniciens assignés
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Tâche actuelle</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.assignedTechnicians.map(tech => (
                    <tr key={tech.id}>
                      <td>{tech.name}</td>
                      <td>{tech.email}</td>
                      <td>
                        <Badge bg={tech.currentTask === "Available" ? "success" : "info"}>
                          {tech.currentTask}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardGest;