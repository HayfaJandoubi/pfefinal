import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Badge, ListGroup, ProgressBar } from "react-bootstrap";
import { FiArrowLeft, FiClock, FiUser, FiAlertCircle, FiCheckCircle, FiCalendar, FiTool, FiFileText } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  etat: "Non résolue" | "En cours" | "Résolue";
  descriptionPanne: string;
  actionsRealisees: string;
  materielUtilise: string;
  dureeIntervention: string;
  notesComplementaires?: string;
}

const DetailsIntervention = () => {
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
    etat: "En cours",
    descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site",
    actionsRealisees: "Vérification des équipements, diagnostic du problème",
    materielUtilise: "Analyseur de spectre, multimètre",
    dureeIntervention: "2 heures",
    notesComplementaires: "Nécessite un remplacement de la carte réseau"
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

  const handleUpdateStatus = () => {
    navigate("/majetat", { state: { intervention } });
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    // Add logo and header
    doc.setFontSize(18);
    doc.setTextColor(theme.primary);
    doc.text("Rapport d'Intervention Technique", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(theme.dark);
    doc.text(`Intervention #${intervention.id} - ${intervention.nomSite}`, 105, 30, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(theme.secondary);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 105, 36, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(theme.primary);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Basic information table
    autoTable(doc, {
      startY: 45,
      head: [['Informations Générales', '']],
      body: [
        ['Site', intervention.nomSite],
        ['Adresse', intervention.adresse],
        ['Coordonnées', intervention.coordonnees],
        ['Type de panne', intervention.typePanne],
        ['Date déclaration', intervention.dateDeclaration],
        ['Date intervention', intervention.dateIntervention],
        ['Technicien', intervention.technicien],
        ['État', intervention.etat],
        ['Durée intervention', intervention.dureeIntervention]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      }
    });
    
    // Technical details
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Détails Techniques', '']],
      body: [
        ['Description de la panne', intervention.descriptionPanne],
        ['Actions réalisées', intervention.actionsRealisees],
        ['Matériel utilisé', intervention.materielUtilise],
        ['Notes complémentaires', intervention.notesComplementaires || 'Aucune']
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      styles: {
        minCellHeight: 20,
        valign: 'top'
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(theme.secondary);
      doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
      doc.text("© Société Telecom - Tous droits réservés", 105, 290, { align: 'center' });
    }
    
    doc.save(`rapport_intervention_${intervention.id}.pdf`);
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
                <FiCalendar className="me-2" /> Dates et responsable
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
                  <span>{intervention.dureeIntervention}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Technicien:</span>
                  <span className="d-flex align-items-center">
                    <FiUser className="me-2" />
                    {intervention.technicien}
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
                  <p className="text-muted">{intervention.actionsRealisees}</p>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={6}>
                  <h6 className="fw-bold mb-3">Matériel utilisé:</h6>
                  <p className="text-muted">{intervention.materielUtilise}</p>
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

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col className="d-flex justify-content-end gap-3">
          {intervention.etat === "Non résolue" && (
            <Button variant="danger" className="d-flex align-items-center">
              <FiAlertCircle className="me-2" />
              Réaffecter un technicien
            </Button>
          )}
          {intervention.etat === "En cours" && (
            <Button 
              variant="warning" 
              className="d-flex align-items-center"
              onClick={handleUpdateStatus}
            >
              <FiClock className="me-2" />
              Mettre à jour l'état
            </Button>
          )}
          <Button 
            variant="primary" 
            className="d-flex align-items-center" 
            onClick={handleGenerateReport}
          >
            <FiFileText className="me-2" />
            Générer un rapport
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

export default DetailsIntervention;