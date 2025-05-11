import React from 'react';
import { 
  FiTool, FiClock, FiCheckCircle, FiAlertCircle, FiUser, 
  FiCalendar, FiMapPin, FiInfo, FiPlusCircle 
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const technicienData = {
  nom: "Samir Trabelsi",
  email: "s.trabelsi@example.com",
  specialite: "Réseaux 5G et Fibre",
  interventions: [
    { id: 1, site: "Site A", type: "Panne électrique", date: "2023-06-15", statut: "En cours", progression: 65 },
    { id: 2, site: "Site B", type: "Problème antenne", date: "2023-06-16", statut: "En attente", progression: 0 },
    { id: 3, site: "Site C", type: "Maintenance préventive", date: "2023-06-17", statut: "Planifiée", progression: 0 },
  ],
  historique: [
    { id: 1, site: "Site X", type: "Remplacement équipement", date: "2023-06-10", statut: "Résolu" },
    { id: 2, site: "Site Y", type: "Dépannage réseau", date: "2023-06-08", statut: "Résolu" },
    { id: 3, site: "Site Z", type: "Configuration 5G", date: "2023-06-05", statut: "Résolu" },
  ],
  stats: {
    interventionsTerminees: 12,
    interventionsEnCours: 3,
    tauxReussite: 92,
    tempsMoyen: "2h45"
  }
};

const dataStatutInterventions = [
  { name: 'Terminées', value: 12 },
  { name: 'En cours', value: 3 },
  { name: 'Échouées', value: 1 }
];

const COLORS = ['#4ADE80', '#4e73df', '#F87171'];

interface StatCardProps {
  icon: React.ReactNode;
  titre: string;
  valeur: string;
  evolution?: string;
  estPositif?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, titre, valeur, evolution, estPositif = true }) => (
  <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #4e73df' }}>
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{titre}</h6>
          <h4 className="mb-0">{valeur}</h4>
          {evolution && (
            <small className={estPositif ? "text-success" : "text-danger"}>
              {evolution}
            </small>
          )}
        </div>
        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const DashboardTechnicien: React.FC = () => {
  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1" style={{ color: '#2c3e50' }}>Tableau de Bord Technicien</h2>
          <h5 className="text-muted">Bienvenue, <span style={{ color: '#4e73df' }}>{technicienData.nom}</span></h5>
        </div>
        <Button variant="outline-primary" size="sm">
          <FiPlusCircle className="me-1" /> Nouveau rapport
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <Row className="mb-4 g-3">
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#4ADE80" />}
            titre="Interventions terminées"
            valeur={technicienData.stats.interventionsTerminees.toString()}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiClock size={20} color="#4e73df" />}
            titre="Interventions en cours"
            valeur={technicienData.stats.interventionsEnCours.toString()}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#1cc88a" />}
            titre="Taux de réussite"
            valeur={`${technicienData.stats.tauxReussite}%`}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiClock size={20} color="#f6c23e" />}
            titre="Temps moyen"
            valeur={technicienData.stats.tempsMoyen}
          />
        </Col>
      </Row>

      {/* Interventions et historique */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiTool className="me-2" style={{ color: '#4e73df' }} />
                Interventions assignées
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Progression</th>
                  </tr>
                </thead>
                <tbody>
                  {technicienData.interventions.map(intervention => (
                    <tr key={intervention.id}>
                      <td>{intervention.site}</td>
                      <td>{intervention.type}</td>
                      <td>{intervention.date}</td>
                      <td>
                        <Badge bg={
                          intervention.statut === "En cours" ? "primary" :
                          intervention.statut === "Résolu" ? "success" :
                          intervention.statut === "En attente" ? "warning" : "secondary"
                        }>
                          {intervention.statut}
                        </Badge>
                      </td>
                      <td>
                        <ProgressBar 
                          now={intervention.progression} 
                          label={`${intervention.progression}%`} 
                          variant={
                            intervention.statut === "En cours" ? "primary" :
                            intervention.statut === "Résolu" ? "success" :
                            intervention.statut === "En attente" ? "warning" : "secondary"
                          } 
                        />
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
                <FiCalendar className="me-2" style={{ color: '#4e73df' }} />
                Historique des interventions
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {technicienData.historique.map(intervention => (
                    <tr key={intervention.id}>
                      <td>{intervention.site}</td>
                      <td>{intervention.type}</td>
                      <td>{intervention.date}</td>
                      <td>
                        <Badge bg={intervention.statut === "Résolu" ? "success" : "secondary"}>
                          {intervention.statut}
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

      {/* Graphique et détails */}
      <Row className="g-3">
        <Col lg={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiInfo className="me-2" style={{ color: '#4e73df' }} />
                Répartition des interventions
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataStatutInterventions}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dataStatutInterventions.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiMapPin className="me-2" style={{ color: '#4e73df' }} />
                Prochaines interventions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column h-100">
                <div className="mb-3">
                  <h6 className="text-primary">Aujourd'hui</h6>
                  <Card className="border-primary mb-2">
                    <Card.Body className="py-2">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>Site A</strong> - Panne électrique
                        </div>
                        <Badge bg="primary">En cours (65%)</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                
                <div className="mb-3">
                  <h6 className="text-primary">Demain</h6>
                  <Card className="border-warning mb-2">
                    <Card.Body className="py-2">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>Site B</strong> - Problème antenne
                        </div>
                        <Badge bg="warning">Planifié</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
                
                <div>
                  <h6 className="text-primary">17 Juin 2023</h6>
                  <Card className="border-secondary">
                    <Card.Body className="py-2">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>Site C</strong> - Maintenance préventive
                        </div>
                        <Badge bg="secondary">À venir</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardTechnicien;