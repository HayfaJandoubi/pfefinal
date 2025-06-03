import React from 'react';
import { 
  FiTool, FiCheckCircle, FiUser, 
  FiCalendar, FiMapPin, FiInfo, FiPlusCircle 
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const technicienData = {
  nom: "Samir Trabelsi",
  email: "s.trabelsi@example.com",
  specialite: "Réseaux 5G et Fibre",
  currentIntervention: {
    id: 1, 
    site: "Site A", 
    type: "Panne électrique", 
    date: "2023-06-15", 
    statut: "En cours", 
    progression: 65,
    details: "Résoudre la panne électrique principale sur le site A"
  },
  upcomingInterventions: [
    { id: 2, site: "Site B", type: "Problème antenne", date: "2023-06-16" },
    { id: 3, site: "Site C", type: "Maintenance préventive", date: "2023-06-17" },
  ],
  historique: [
    { id: 1, site: "Site X", type: "Remplacement équipement", date: "2023-06-10", statut: "Résolu" },
    { id: 2, site: "Site Y", type: "Dépannage réseau", date: "2023-06-08", statut: "Résolu" },
    { id: 3, site: "Site Z", type: "Configuration 5G", date: "2023-06-05", statut: "Résolu" },
  ],
  stats: {
    interventionsTerminees: 12,
    tauxReussite: 92,
  }
};

const dataStatutInterventions = [
  { name: 'Terminées', value: 12 },
  { name: 'Échouées', value: 1 }
];

const COLORS = ['#4ADE80', '#F87171'];

interface StatCardProps {
  icon: React.ReactNode;
  titre: string;
  valeur: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, titre, valeur }) => (
  <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #4e73df' }}>
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{titre}</h6>
          <h4 className="mb-0">{valeur}</h4>
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
        <Col md={6}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#4ADE80" />}
            titre="Interventions terminées"
            valeur={technicienData.stats.interventionsTerminees.toString()}
          />
        </Col>
        <Col md={6}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#1cc88a" />}
            titre="Taux de réussite"
            valeur={`${technicienData.stats.tauxReussite}%`}
          />
        </Col>
      </Row>

      {/* Intervention actuelle */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiTool className="me-2" style={{ color: '#4e73df' }} />
                Intervention en cours
              </h5>
            </Card.Header>
            <Card.Body>
              {technicienData.currentIntervention ? (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <div>
                      <h4>{technicienData.currentIntervention.site}</h4>
                      <p className="text-muted mb-1">{technicienData.currentIntervention.type}</p>
                      <p className="text-muted">{technicienData.currentIntervention.details}</p>
                    </div>
                    <Badge bg="primary" className="align-self-start">
                      {technicienData.currentIntervention.statut}
                    </Badge>
                  </div>
                  <div className="mb-2">
                    <strong>Progression:</strong>
                    <ProgressBar 
                      now={technicienData.currentIntervention.progression} 
                      label={`${technicienData.currentIntervention.progression}%`} 
                      variant="primary"
                      className="mt-2"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" className="me-2">
                      Mettre à jour
                    </Button>
                    <Button variant="outline-danger">
                      Signaler problème
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune intervention en cours</p>
                  <Button variant="outline-primary">
                    Voir les interventions disponibles
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Interventions et historique */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiCalendar className="me-2" style={{ color: '#4e73df' }} />
                Interventions à venir
              </h5>
            </Card.Header>
            <Card.Body>
              {technicienData.upcomingInterventions.length > 0 ? (
                <Table hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Date</th>
                      <th>Site</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicienData.upcomingInterventions.map(intervention => (
                      <tr key={intervention.id}>
                        <td>{intervention.date}</td>
                        <td>{intervention.site}</td>
                        <td>{intervention.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune intervention programmée</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiCalendar className="me-2" style={{ color: '#4e73df' }} />
                Historique récent
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Date</th>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {technicienData.historique.map(intervention => (
                    <tr key={intervention.id}>
                      <td>{intervention.date}</td>
                      <td>{intervention.site}</td>
                      <td>{intervention.type}</td>
                      <td>
                        <Badge bg="success">
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

      {/* Graphique et prochaines interventions */}
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
                Détails de l'intervention en cours
              </h5>
            </Card.Header>
            <Card.Body>
              {technicienData.currentIntervention ? (
                <div>
                  <h6 className="text-primary mb-3">Détails techniques</h6>
                  <div className="mb-3">
                    <strong>Site:</strong> {technicienData.currentIntervention.site}
                  </div>
                  <div className="mb-3">
                    <strong>Type d'intervention:</strong> {technicienData.currentIntervention.type}
                  </div>
                  <div className="mb-3">
                    <strong>Description:</strong> {technicienData.currentIntervention.details}
                  </div>
                  <div className="mb-3">
                    <strong>Date:</strong> {technicienData.currentIntervention.date}
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary">
                      Voir les détails complets
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">Aucune intervention en cours</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardTechnicien;