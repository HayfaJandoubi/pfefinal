import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Badge, ListGroup, ProgressBar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FiArrowLeft, FiClock, FiUser, FiAlertCircle, FiCheckCircle, FiCalendar, FiTool, FiFileText, FiBell } from "react-icons/fi";

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

interface InterventionDetails {
  id: number;
  nomSite: string;
  adresse: string;
  coordonnees: string;
  typePanne: string;
  dateDeclaration: string;
  dateIntervention: string;
  technicien: string;
  gestionnaire: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  descriptionPanne: string;
  actionsRealisees: string;
  materielUtilise: string;
  dureeIntervention: string;
  notesComplementaires?: string;
  rapport?: string;
}

const DetailsInterventionGestionnaire = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const intervention: InterventionDetails = state?.intervention || {
    id: 1,
    nomSite: "Site Sahloul",
    adresse: "Sahloul, Sousse",
    coordonnees: "35.8256, 10.6084",
    typePanne: "Problème réseau",
    dateDeclaration: "2023-05-15 09:30",
    dateIntervention: "2023-05-16 14:00",
    technicien: "Mohamed Ali",
    gestionnaire: "Nidhal Ghariani",
    etat: "Non résolue",
    descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site",
    actionsRealisees: "",
    materielUtilise: "",
    dureeIntervention: "",
    notesComplementaires: ""
  };

  const getEtatBadge = () => {
    switch(intervention.etat) {
      case "Non résolue":
        return <Badge bg="danger" className="fs-6 px-3 py-2"><FiAlertCircle className="me-1" /> Non résolue</Badge>;
      case "En cours":
        return <Badge bg="warning" className="fs-6 px-3 py-2"><FiClock className="me-1" /> En cours</Badge>;
      case "Résolue":
        return <Badge bg="success" className="fs-6 px-3 py-2"><FiCheckCircle className="me-1" /> Résolue</Badge>;
      default:
        return <Badge bg="secondary" className="fs-6 px-3 py-2">Inconnu</Badge>;
    }
  };

  const getProgress = () => {
    switch(intervention.etat) {
      case "Non résolue":
        return 30;
      case "En cours":
        return 65;
      case "Résolue":
        return 100;
      default:
        return 0;
    }
  };

  const handleSendReminder = () => {
    alert(`Rappel envoyé au technicien ${intervention.technicien}`);
    // In a real app, you would send this to the backend
  };

  const handleViewReport = () => {
    if (intervention.rapport) {
      navigate("/voir-rapport", { state: { intervention } });
    }
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <Button 
            variant="outline-primary" 
            onClick={() => navigate(-1)}
            className="d-flex align-items-center mb-3"
          >
            <FiArrowLeft className="me-2" /> Retour
          </Button>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold" style={{ color: theme.dark }}>
                Détails de l'intervention
              </h2>
              <p className="mb-0 text-muted">
                Intervention #{intervention.id} - {intervention.nomSite}
              </p>
            </div>
            <div>
              {getEtatBadge()}
            </div>
          </div>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold">Progression de l'intervention</span>
                <span>{getProgress()}%</span>
              </div>
              <ProgressBar 
                now={getProgress()} 
                variant={
                  intervention.etat === "Non résolue" ? "danger" : 
                  intervention.etat === "En cours" ? "warning" : "success"
                } 
                animated={intervention.etat === "En cours"}
                className="mb-3"
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>Déclarée</span>
                <span>En cours</span>
                <span>Résolue</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Details */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">
                <FiFileText className="me-2" /> Informations de base
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Site:</span>
                  <span>{intervention.nomSite}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Adresse:</span>
                  <span>{intervention.adresse}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Coordonnées:</span>
                  <span>{intervention.coordonnees}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Type de panne:</span>
                  <span>{intervention.typePanne}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">
                <FiCalendar className="me-2" /> Dates et responsables
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Date déclaration:</span>
                  <span>{intervention.dateDeclaration}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Date intervention:</span>
                  <span>{intervention.dateIntervention}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Durée intervention:</span>
                  <span>{intervention.dureeIntervention || "Non spécifiée"}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Technicien:</span>
                  <span className="d-flex align-items-center">
                    <FiUser className="me-2" />
                    {intervention.technicien}
                    {intervention.etat === "Non résolue" && (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Envoyer un rappel au technicien</Tooltip>}
                      >
                        <Button 
                          variant="link" 
                          className="p-0 ms-2"
                          onClick={handleSendReminder}
                        >
                          <FiBell className="text-warning" />
                        </Button>
                      </OverlayTrigger>
                    )}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Gestionnaire:</span>
                  <span className="d-flex align-items-center">
                    <FiUser className="me-2" />
                    {intervention.gestionnaire}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Technical Details */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">
                <FiTool className="me-2" /> Détails techniques
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold mb-3">Description de la panne:</h6>
                  <p className="text-muted">{intervention.descriptionPanne}</p>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold mb-3">Actions réalisées:</h6>
                  <p className="text-muted">{intervention.actionsRealisees || "Aucune action enregistrée"}</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <h6 className="fw-bold mb-3">Matériel utilisé:</h6>
                  <p className="text-muted">{intervention.materielUtilise || "Aucun matériel spécifié"}</p>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold mb-3">Notes complémentaires:</h6>
                  <p className="text-muted">
                    {intervention.notesComplementaires || "Aucune note supplémentaire"}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Rapport Section */}
      {intervention.etat === "Résolue" && intervention.rapport && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0 fw-bold">
                  <FiFileText className="me-2" /> Rapport du technicien
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted">{intervention.rapport}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-end gap-3">
          {intervention.etat === "Non résolue" && (
            <Button 
              variant="danger" 
              className="d-flex align-items-center"
              onClick={() => navigate("/assigner-technicien", { state: { intervention } })}
            >
              <FiAlertCircle className="me-2" />
              Réaffecter un technicien
            </Button>
          )}
          <Button 
            variant={intervention.etat === "Résolue" ? "primary" : "outline-secondary"} 
            className="d-flex align-items-center" 
            onClick={handleViewReport}
            disabled={intervention.etat !== "Résolue"}
          >
            <FiFileText className="me-2" />
            {intervention.etat === "Résolue" ? "Voir le rapport" : "Aucun rapport disponible"}
          </Button>
        </Col>
      </Row>

      {/* Custom styles */}
      <style>
        {`
          .list-group-item {
            padding: 1rem 1.25rem;
            border-color: rgba(0,0,0,0.05);
          }
          .card {
            border-radius: 12px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1) !important;
          }
        `}
      </style>
    </Container>
  );
};

export default DetailsInterventionGestionnaire;