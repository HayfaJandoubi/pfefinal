import { useState, useEffect } from "react";
import { Badge, Button, Card, Container, Row, Col, Alert, ListGroup, Modal } from "react-bootstrap";
import { FiBell, FiClock, FiAlertCircle, FiCheckCircle, FiCalendar, FiTool, FiUser } from "react-icons/fi";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = {
  primary: "#3f51b5",
  secondary: "#6c757d",
  success: "#4caf50",
  info: "#00acc1",
  warning: "#ff9800",
  danger: "#f44336",
  light: "#f8f9fa",
  dark: "#212529",
  background: "#f5f7fa",
  card: "#ffffff"
};

interface Intervention {
  id: number;
  nomSite: string;
  adresse: string;
  typePanne: string;
  dateDeclaration: string;
  dateIntervention: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  priorite: "Basse" | "Moyenne" | "Haute" | "Critique";
  description: string;
  materielRequis: string;
  isNew?: boolean;
}

const TechDashboard = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [showNewInterventionModal, setShowNewInterventionModal] = useState(false);
  const [newIntervention, setNewIntervention] = useState<Intervention | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API call
  useEffect(() => {
    const fetchInterventions = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockData: Intervention[] = [
          {
            id: 1,
            nomSite: "Site Sahloul",
            adresse: "Sahloul, Sousse",
            typePanne: "Panne réseau",
            dateDeclaration: "2023-05-15T09:30:00",
            dateIntervention: "2023-05-16T14:00:00",
            etat: "En cours",
            priorite: "Haute",
            description: "Perte totale du signal réseau dans la zone nord",
            materielRequis: "Analyseur de spectre, câbles RJ45",
            isNew: true
          },
          {
            id: 2,
            nomSite: "Site Menzah",
            adresse: "Menzah 6, Tunis",
            typePanne: "Problème électrique",
            dateDeclaration: "2023-05-14T11:15:00",
            dateIntervention: "2023-05-15T10:00:00",
            etat: "En cours",
            priorite: "Moyenne",
            description: "Alimentation électrique intermittente",
            materielRequis: "Multimètre, tournevis isolés"
          },
          {
            id: 3,
            nomSite: "Site Lac",
            adresse: "Lac 2, Tunis",
            typePanne: "Panne matérielle",
            dateDeclaration: "2023-05-10T16:45:00",
            dateIntervention: "2023-05-11T09:00:00",
            etat: "Non résolue",
            priorite: "Critique",
            description: "Routeur principal défectueux",
            materielRequis: "Routeur de remplacement, console"
          }
        ];
        
        setInterventions(mockData);
        setIsLoading(false);
        
        // Check for new interventions
        const newInterv = mockData.find(i => i.isNew);
        if (newInterv) {
          setNewIntervention(newInterv);
          setShowNewInterventionModal(true);
          showToastNotification(newInterv);
        }
      }, 1000);
    };

    fetchInterventions();

    // Simulate real-time updates (in a real app, use WebSockets)
    const interval = setInterval(fetchInterventions, 30000);
    return () => clearInterval(interval);
  }, []);

  const showToastNotification = (intervention: Intervention) => {
    toast.info(
      <div>
        <h6>Nouvelle intervention assignée!</h6>
        <p><strong>Site:</strong> {intervention.nomSite}</p>
        <p><strong>Priorité:</strong> <Badge bg={getPriorityBadgeColor(intervention.priorite)}>{intervention.priorite}</Badge></p>
      </div>,
      {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      }
    );
  };

  const handleStartIntervention = (id: number) => {
    setInterventions(prev => 
      prev.map(i => 
        i.id === id ? { ...i, etat: "En cours", isNew: false } : i
      )
    );
    toast.success("Intervention marquée comme 'En cours'");
    setShowNewInterventionModal(false);
  };

  const getPriorityBadgeColor = (priority: Intervention["priorite"]) => {
    switch(priority) {
      case "Basse": return "info";
      case "Moyenne": return "primary";
      case "Haute": return "warning";
      case "Critique": return "danger";
      default: return "secondary";
    }
  };

  const getEtatBadge = (etat: Intervention["etat"]) => {
    switch(etat) {
      case "Non résolue": return <Badge bg="danger">{etat}</Badge>;
      case "En cours": return <Badge bg="warning">{etat}</Badge>;
      case "Résolue": return <Badge bg="success">{etat}</Badge>;
      default: return <Badge bg="secondary">{etat}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      <ToastContainer />
      
      {/* New Intervention Modal */}
      <Modal show={showNewInterventionModal} onHide={() => setShowNewInterventionModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FiBell className="me-2" />
            Nouvelle Intervention Assignée!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newIntervention && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">{newIntervention.nomSite}</h5>
                <Badge bg={getPriorityBadgeColor(newIntervention.priorite)}>
                  {newIntervention.priorite}
                </Badge>
              </div>
              
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item>
                  <FiCalendar className="me-2" />
                  <strong>Date d'intervention:</strong> {formatDate(newIntervention.dateIntervention)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiTool className="me-2" />
                  <strong>Type de panne:</strong> {newIntervention.typePanne}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FiAlertCircle className="me-2" />
                  <strong>Description:</strong> {newIntervention.description}
                </ListGroup.Item>
              </ListGroup>
              
              <Alert variant="light" className="border">
                <h6 className="fw-bold">Matériel requis:</h6>
                <p>{newIntervention.materielRequis}</p>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewInterventionModal(false)}>
            Voir plus tard
          </Button>
          <Button 
            variant="primary" 
            onClick={() => newIntervention && handleStartIntervention(newIntervention.id)}
          >
            <FiClock className="me-2" />
            Commencer l'intervention
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>
                <FiUser className="me-2" />
                Tableau de Bord Technicien
              </h2>
              <p className="mb-0 text-muted">
                Interventions assignées et en cours
              </p>
            </div>
            <div>
              <Badge bg="primary" pill className="fs-6 px-3 py-2">
                {interventions.filter(i => i.etat === "En cours").length} en cours
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.danger}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Non résolues</h6>
                  <h3 className="mb-0">
                    {interventions.filter(i => i.etat === "Non résolue").length}
                  </h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-circle p-3">
                  <FiAlertCircle color={theme.danger} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.warning}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">En cours</h6>
                  <h3 className="mb-0">
                    {interventions.filter(i => i.etat === "En cours").length}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <FiClock color={theme.warning} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.info}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Aujourd'hui</h6>
                  <h3 className="mb-0">
                    {interventions.filter(i => 
                      new Date(i.dateIntervention).toDateString() === new Date().toDateString()
                    ).length}
                  </h3>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <FiCalendar color={theme.info} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderTop: `4px solid ${theme.primary}` }}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="text-uppercase small text-muted">Total</h6>
                  <h3 className="mb-0">{interventions.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FiTool color={theme.primary} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Interventions List */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Mes Interventions</h5>
                <div>
                  <Button variant="outline-primary" size="sm" className="me-2">
                    Aujourd'hui
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Toutes
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : interventions.length === 0 ? (
                <Alert variant="info" className="text-center">
                  Aucune intervention assignée pour le moment
                </Alert>
              ) : (
                <ListGroup variant="flush">
                  {interventions.map(intervention => (
                    <ListGroup.Item 
                      key={intervention.id} 
                      className={`py-3 ${intervention.isNew ? 'bg-light' : ''}`}
                    >
                      <Row className="align-items-center">
                        <Col md={4}>
                          <div className="d-flex align-items-center">
                            {intervention.isNew && (
                              <span className="badge bg-danger me-2">Nouveau</span>
                            )}
                            <div>
                              <h6 className="mb-1">{intervention.nomSite}</h6>
                              <small className="text-muted">{intervention.adresse}</small>
                            </div>
                          </div>
                        </Col>
                        <Col md={2}>
                          <Badge bg={getPriorityBadgeColor(intervention.priorite)}>
                            {intervention.priorite}
                          </Badge>
                        </Col>
                        <Col md={2}>
                          {getEtatBadge(intervention.etat)}
                        </Col>
                        <Col md={2}>
                          <small className="text-muted">
                            {formatDate(intervention.dateIntervention)}
                          </small>
                        </Col>
                        <Col md={2} className="text-end">
                          <Button 
                            variant={intervention.etat === "Non résolue" ? "primary" : "outline-primary"} 
                            size="sm"
                          >
                            {intervention.etat === "Non résolue" ? "Commencer" : "Détails"}
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom styles */}
      <style>
        {`
          .card {
            border-radius: 12px;
          }
          .list-group-item {
            transition: all 0.2s;
          }
          .list-group-item:hover {
            background-color: rgba(63, 81, 181, 0.05) !important;
          }
          .modal-header {
            border-radius: 12px 12px 0 0 !important;
          }
        `}
      </style>
    </Container>
  );
};

export default TechDashboard;