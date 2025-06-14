import React, { useState } from 'react';
import { 
  FiTool, FiCheckCircle, FiCalendar, 
  FiBarChart2, FiChevronRight
} from 'react-icons/fi';
import { 
  Card, Row, Col, Container, Table, 
  Badge, Button, Dropdown 
} from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// Type definitions
type Intervention = {
  id: number;
  site: string;
  type: string;
  date: string;
  duree: string;
};

type StatsData = {
  month?: string;
  day?: string;
  year?: string;
  interventions: number;
  reussites?: number;
};

type TechnicienData = {
  nom: string;
  stats: {
    interventionsTerminees: number;
    tauxReussite: number;
    monthlyStats: StatsData[];
    weeklyStats: StatsData[];
    yearlyStats: StatsData[];
  };
  historique: Intervention[];
  hasCurrentIntervention: boolean;
};

// Sample data
const technicienData: TechnicienData = {
  nom: "Samir Trabelsi",
  stats: {
    interventionsTerminees: 47,
    tauxReussite: 94,
    monthlyStats: [
      { month: 'Jan', interventions: 12, reussites: 11 },
      { month: 'Fév', interventions: 9, reussites: 8 },
      { month: 'Mar', interventions: 14, reussites: 13 },
      { month: 'Avr', interventions: 11, reussites: 11 },
      { month: 'Mai', interventions: 13, reussites: 12 },
      { month: 'Juin', interventions: 8, reussites: 8 },
    ],
    weeklyStats: [
      { day: 'Lun', interventions: 3 },
      { day: 'Mar', interventions: 2 },
      { day: 'Mer', interventions: 4 },
      { day: 'Jeu', interventions: 1 },
      { day: 'Ven', interventions: 2 },
      { day: 'Sam', interventions: 0 },
      { day: 'Dim', interventions: 0 },
    ],
    yearlyStats: [
      { year: '2020', interventions: 98 },
      { year: '2021', interventions: 112 },
      { year: '2022', interventions: 124 },
      { year: '2023', interventions: 68 },
    ]
  },
  historique: [
    { id: 1, site: "Site X", type: "Remplacement équipement", date: "10/06/2023", duree: "1h45" },
    { id: 2, site: "Site Y", type: "Dépannage réseau", date: "08/06/2023", duree: "3h20" },
    { id: 3, site: "Site Z", type: "Configuration 5G", date: "05/06/2023", duree: "2h10" },
  ],
  hasCurrentIntervention: true
};

const DashboardTechnicien = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const navigate = useNavigate();

  const renderStatsChart = (): React.ReactElement => {
    switch(timeRange) {
      case 'week':
        return (
          <BarChart data={technicienData.stats.weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="interventions" fill="#4e73df" name="Interventions" />
          </BarChart>
        );
      case 'month':
        return (
          <BarChart data={technicienData.stats.monthlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="interventions" fill="#4e73df" name="Total" />
            <Bar dataKey="reussites" fill="#4ADE80" name="Réussites" />
          </BarChart>
        );
      case 'year':
        return (
          <BarChart data={technicienData.stats.yearlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="interventions" fill="#4e73df" name="Interventions" />
          </BarChart>
        );
      default:
        // Fallback to weekly stats
        return (
          <BarChart data={technicienData.stats.weeklyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="interventions" fill="#4e73df" name="Interventions" />
          </BarChart>
        );
    }
  };

  return (
    <Container fluid className="py-4 px-4" style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold" style={{ color: '#2c3e50' }}>Tableau de Bord</h2>
        <Button variant="outline-primary" size="sm">
          Nouveau rapport
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted mb-1">Interventions terminées</h6>
                  <h3 className="mb-0">{technicienData.stats.interventionsTerminees}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FiCheckCircle size={20} color="#4e73df" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted mb-1">Taux de réussite</h6>
                  <h3 className="mb-0">{technicienData.stats.tauxReussite}%</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FiCheckCircle size={20} color="#1cc88a" />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Current Intervention Panel */}
      {technicienData.hasCurrentIntervention && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                      <FiTool size={24} color="#4e73df" />
                    </div>
                    <div>
                      <h5 className="mb-0">Intervention en cours</h5>
                      <small className="text-muted">Site A - Panne électrique</small>
                    </div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => navigate('/intervention')}
                    className="d-flex align-items-center"
                  >
                    Détails <FiChevronRight className="ms-1" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Stats and History */}
      <Row className="g-3">
        {/* Statistics Chart */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <FiBarChart2 className="me-2" color="#4e73df" />
                  Statistiques des interventions
                </h5>
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm" id="dropdown-time-range">
                    {timeRange === 'week' && 'Cette semaine'}
                    {timeRange === 'month' && 'Ce mois-ci'}
                    {timeRange === 'year' && 'Cette année'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTimeRange('week')}>Cette semaine</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('month')}>Ce mois-ci</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('year')}>Cette année</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderStatsChart()}
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent History */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 d-flex align-items-center">
                <FiCalendar className="me-2" color="#4e73df" />
                Historique récent
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  {technicienData.historique.map((intervention) => (
                    <tr key={intervention.id}>
                      <td>{intervention.date}</td>
                      <td>{intervention.site}</td>
                      <td>{intervention.type}</td>
                      <td>{intervention.duree}</td>
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

export default DashboardTechnicien;