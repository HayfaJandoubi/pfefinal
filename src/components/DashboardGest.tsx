import React from 'react';
import { 
  FiWifi, FiAlertCircle, FiTool, FiUser, FiClock, 
  FiCheckCircle, FiPlusCircle,
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button } from 'react-bootstrap';

// Sample data for a specific manager
const managerData = {
  name: "Mohamed Ali",
  email: "m.ali@example.com",
  totalSites: 12,
  downSites: 2,
  pendingSites: [
    { id: 1, name: "Nouveau Site Tunis Nord", dateSubmitted: "2023-06-10", status: "En attente" },
    { id: 2, name: "Extension Site Sousse", dateSubmitted: "2023-06-12", status: "En attente" },
    { id: 3, name: "Site Gabès 2", dateSubmitted: "2023-06-14", status: "En révision" },
  ],
  ongoingInterventions: [
    { id: 1, site: "Site A", technician: "Samir Trabelsi", startTime: "2023-06-15 09:30", status: "In Progress" },
    { id: 2, site: "Site C", technician: "Leila Boukadi", startTime: "2023-06-15 11:15", status: "Diagnosing" },
  ],
  assignedTechnicians: [
    { id: 1, name: "Samir Trabelsi", email: "s.trabelsi@example.com", currentTask: "Site A - Power issue" },
    { id: 2, name: "Leila Boukadi", email: "l.boukadi@example.com", currentTask: "Site C - Antenna repair" },
    { id: 3, name: "Karim Hammami", email: "k.hammami@example.com", currentTask: "Available" },
  ]
};

const DashboardGest: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard Gestionnaire</h1>
      <h4 className="mb-4 text-muted">Bienvenue, {managerData.name}</h4>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiWifi className="text-primary" size={24} />}
            title="Sites sous gestion"
            value={managerData.totalSites.toString()}
            change="+2 ce mois"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiCheckCircle className="text-success" size={24} />}
            title="Sites opérationnels"
            value={(managerData.totalSites - managerData.downSites).toString()}
            change="+1 cette semaine"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiAlertCircle className="text-danger" size={24} />}
            title="Sites en panne"
            value={managerData.downSites.toString()}
            change="-1 cette semaine"
            isPositive={false}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiClock className="text-warning" size={24} />}
            title="Sites en attente"
            value={managerData.pendingSites.length.toString()}
            change="+2 cette semaine"
            isPositive={false}
          />
        </Col>
      </Row>

      {/* Pending Sites Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span><FiClock className="me-2" /> Sites mobiles en attente d'ajout</span>
                <Button variant="primary" size="sm">
                  <FiPlusCircle className="me-1" /> Proposer un nouveau site
                </Button>
              </Card.Title>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Nom du site</th>
                    <th>Date de soumission</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managerData.pendingSites.map(site => (
                    <tr key={site.id}>
                      <td>{site.name}</td>
                      <td>{site.dateSubmitted}</td>
                      <td>
                        <Badge bg={
                          site.status === "En attente" ? "warning" :
                          site.status === "En révision" ? "info" : "secondary"
                        }>
                          {site.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-secondary" size="sm" className="me-2">
                          Détails
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          Retirer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Interventions and Technicians */}
      <Row>
        <Col lg={6} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <FiTool className="me-2" /> Interventions en cours
              </Card.Title>
              <Table striped hover size="sm">
                <thead>
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
          <Card>
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <FiUser className="me-2" /> Techniciens sous gestion
              </Card.Title>
              <Table striped hover size="sm">
                <thead>
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

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Actions rapides</Card.Title>
              <div className="d-flex flex-wrap gap-2">
                <Button variant="primary">
                  <FiTool className="me-2" /> Créer une intervention
                </Button>
                <Button variant="success">
                  <FiUser className="me-2" /> Assigner un technicien
                </Button>
                <Button variant="warning">
                  <FiAlertCircle className="me-2" /> Signaler un problème
                </Button>
                <Button variant="info">
                  <FiPlusCircle className="me-2" /> Proposer un nouveau site
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className="p-2 rounded bg-light">
            {icon}
          </div>
        </div>
        <p className={`mb-0 mt-3 ${isPositive ? 'text-success' : 'text-danger'}`}>
          <small>{change}</small>
        </p>
      </Card.Body>
    </Card>
  );
};

export default DashboardGest;