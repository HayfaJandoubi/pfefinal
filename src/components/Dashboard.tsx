import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  FiWifi, FiAlertCircle, FiCheckCircle, FiUser, FiTool, FiPlusCircle
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge, Button } from 'react-bootstrap';

// Données d'exemple
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

const COULEURS = ['#4e73df', '#f6c23e']; // Bleu et jaune pour le thème

const alertesRecentes = [
  { id: 1, site: 'Site A', type: 'Panne électrique', statut: 'Critique', temps: 'Il y a 10 min' },
  { id: 2, site: 'Site B', type: 'Perte de connexion', statut: 'Avertissement', temps: 'Il y a 25 min' },
  { id: 3, site: 'Site C', type: 'Défaillance matérielle', statut: 'Critique', temps: 'Il y a 1 heure' },
  { id: 4, site: 'Site D', type: 'Maintenance', statut: 'Info', temps: 'Il y a 2 heures' },
];

const gestionnaires = [
  { id: 1, nom: 'Mohamed Ali', email: 'm.ali@example.com', sites: 12 },
  { id: 2, nom: 'Fatma Ben Salah', email: 'f.bensalah@example.com', sites: 8 },
  { id: 3, nom: 'Ahmed Khemiri', email: 'a.khemiri@example.com', sites: 15 },
];

const techniciens = [
  { id: 1, nom: 'Samir Trabelsi', email: 's.trabelsi@example.com', compétences: '5G, Fibre' },
  { id: 2, nom: 'Leila Boukadi', email: 'l.boukadi@example.com', compétences: 'Micro-ondes, Alimentation' },
  { id: 3, nom: 'Karim Hammami', email: 'k.hammami@example.com', compétences: 'Antennes, RF' },
];

// Composant StatCard avec interface TypeScript
interface StatCardProps {
  icon: React.ReactNode;
  titre: string;
  valeur: string;
  evolution: string;
  estPositif: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, titre, valeur, evolution, estPositif }) => (
  <Card className="shadow-sm h-100" style={{ borderLeft: '4px solid #4e73df' }}>
    <Card.Body className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-muted mb-1">{titre}</h6>
          <h4 className="mb-0">{valeur}</h4>
          <small className={estPositif ? "text-success" : "text-danger"}>
            {evolution}
          </small>
        </div>
        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
          {icon}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const Dashboard: React.FC = () => {
  const nomAdmin = "Admin Principal"; // À remplacer par une variable dynamique si nécessaire

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fc' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1" style={{ color: '#2c3e50' }}>Tableau de Bord Admin</h2>
          <h5 className="text-muted">Bienvenue, <span style={{ color: '#4e73df' }}>{nomAdmin}</span></h5>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <Row className="mb-4 g-3">
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiWifi size={20} color="#4e73df" />}
            titre="Sites Mobiles Totaux"
            valeur="150"
            evolution="+5%"
            estPositif={true}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiCheckCircle size={20} color="#1cc88a" />}
            titre="Sites Actifs"
            valeur="145"
            evolution="+3%"
            estPositif={true}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiAlertCircle size={20} color="#e74a3b" />}
            titre="Sites Inactifs"
            valeur="5"
            evolution="-2%"
            estPositif={false}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiAlertCircle size={20} color="#f6c23e" />}
            titre="Alertes Critiques"
            valeur="2"
            evolution="+1"
            estPositif={false}
          />
        </Col>
      </Row>

      {/* Graphiques principaux */}
      <Row className="mb-4 g-3">
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiWifi className="me-2" style={{ color: '#4e73df' }} />
                Statut des Sites Mobiles
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donneesSitesMobiles}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actifs" fill="#4e73df" name="Sites Actifs" />
                    <Bar dataKey="inactifs" fill="#f6c23e" name="Sites Inactifs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiCheckCircle className="me-2" style={{ color: '#4e73df' }} />
                Répartition des Sites
              </h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donneesStatutSites}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {donneesStatutSites.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COULEURS[index % COULEURS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ligne inférieure */}
      <Row className="g-3">
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiAlertCircle className="me-2" style={{ color: '#4e73df' }} />
                Alertes Récentes
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Heure</th>
                  </tr>
                </thead>
                <tbody>
                  {alertesRecentes.map(alerte => (
                    <tr key={alerte.id}>
                      <td>{alerte.site}</td>
                      <td>{alerte.type}</td>
                      <td>
                        <Badge 
                          bg={
                            alerte.statut === 'Critique' ? 'danger' : 
                            alerte.statut === 'Avertissement' ? 'warning' : 'info'
                          }
                        >
                          {alerte.statut}
                        </Badge>
                      </td>
                      <td>{alerte.temps}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiUser className="me-2" style={{ color: '#4e73df' }} />
                Gestionnaires
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Sites</th>
                  </tr>
                </thead>
                <tbody>
                  {gestionnaires.map(gestionnaire => (
                    <tr key={gestionnaire.id}>
                      <td>{gestionnaire.nom}</td>
                      <td>{gestionnaire.email}</td>
                      <td>{gestionnaire.sites}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-white border-bottom-0 pb-0">
              <h5 className="mb-0">
                <FiTool className="me-2" style={{ color: '#4e73df' }} />
                Techniciens
              </h5>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Compétences</th>
                  </tr>
                </thead>
                <tbody>
                  {techniciens.map(technicien => (
                    <tr key={technicien.id}>
                      <td>{technicien.nom}</td>
                      <td>{technicien.email}</td>
                      <td>{technicien.compétences}</td>
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

export default Dashboard;