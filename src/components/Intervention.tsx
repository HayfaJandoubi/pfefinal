import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Badge, Alert, ProgressBar, Form, Modal } from "react-bootstrap";
import { FiArrowLeft, FiClock, FiAlertCircle, FiCheck, FiMapPin, FiTool, FiCalendar, FiUser, FiInfo, FiEdit, FiFileText, FiSend } from "react-icons/fi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from 'sweetalert2';

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
  card: "#ffffff",
  border: "#e0e0e0"
};

interface Intervention {
  id: number;
  nomSite: string;
  adresse: string;
  typePanne: string;
  dateDeclaration: string;
  dateIntervention: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  priorite: "Basse" | "Moyenne" | "Haute";
  descriptionPanne: string;
  progression: number;
  notesTechnicien?: string;
  rapport?: string;
}

const InterventionTechnicien = () => {
  const navigate = useNavigate();
  const [currentIntervention, setCurrentIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [technicianNotes, setTechnicianNotes] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportContent, setReportContent] = useState("");

  useEffect(() => {
    const fetchIntervention = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockIntervention: Intervention = {
            id: 1,
            nomSite: "Site Sahloul",
            adresse: "Sahloul, Sousse",
            typePanne: "Problème réseau",
            dateDeclaration: "2023-05-15T09:30",
            dateIntervention: "2023-05-16T14:00",
            etat: "En cours",
            priorite: "Haute",
            descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site. Nécessite vérification des switchs et câbles réseau.",
            progression: 65,
            notesTechnicien: "J'ai remplacé le switch principal, problème persiste sur le secteur nord"
          };
          setCurrentIntervention(mockIntervention);
          setTechnicianNotes(mockIntervention.notesTechnicien || "");
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching intervention:", error);
        setLoading(false);
      }
    };

    fetchIntervention();
  }, []);

  const handleUpdateStatus = (newStatus: "Non résolue" | "En cours" | "Résolue") => {
    if (!currentIntervention) return;

    const updatedIntervention = {
      ...currentIntervention,
      etat: newStatus,
      progression: newStatus === "Résolue" ? 100 : newStatus === "En cours" ? 50 : 30
    };

    setCurrentIntervention(updatedIntervention);

    Swal.fire({
      icon: 'success',
      title: `Statut mis à jour: ${newStatus}`,
      text: newStatus === "Résolue" 
        ? 'Vous pouvez maintenant rédiger le rapport' 
        : 'Le gestionnaire sera notifié du changement',
      confirmButtonColor: theme.primary,
      timer: 3000
    });

    if (newStatus === "Résolue") {
      setShowReportModal(true);
    }
  };

  const handleGenerateReport = () => {
    if (!currentIntervention) return;

    const doc = new jsPDF();
    
    // Report header
    doc.setFontSize(18);
    doc.setTextColor(theme.primary);
    doc.text("Rapport d'Intervention Technique", 105, 20, { align: 'center' });
    
    // Intervention details
    doc.setFontSize(12);
    doc.setTextColor(theme.dark);
    doc.text(`Intervention #${currentIntervention.id} - ${currentIntervention.nomSite}`, 105, 30, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(theme.secondary);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 105, 36, { align: 'center' });
    
    // Horizontal line
    doc.setDrawColor(theme.primary);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Basic information table
    autoTable(doc, {
      startY: 45,
      head: [['Informations Générales', '']],
      body: [
        ['Site', currentIntervention.nomSite],
        ['Adresse', currentIntervention.adresse],
        ['Type de panne', currentIntervention.typePanne],
        ['Date déclaration', formatDate(currentIntervention.dateDeclaration)],
        ['Date intervention', formatDate(currentIntervention.dateIntervention)],
        ['État', currentIntervention.etat],
        ['Priorité', currentIntervention.priorite]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Technical details
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [['Détails Techniques', '']],
      body: [
        ['Description de la panne', currentIntervention.descriptionPanne],
        ['Actions réalisées', currentIntervention.notesTechnicien || ''],
        ['Rapport technique', reportContent]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: theme.primary,
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        valign: 'top'
      }
    });
    
    // Save and notify
    doc.save(`rapport_intervention_${currentIntervention.id}.pdf`);
    
    // Update intervention with report
    const updatedIntervention = {
      ...currentIntervention,
      rapport: `Rapport soumis le ${new Date().toLocaleString()}`,
      notesTechnicien: reportContent
    };
    
    setCurrentIntervention(updatedIntervention);
    setShowReportModal(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Rapport envoyé',
      text: 'Le gestionnaire a reçu votre rapport technique',
      confirmButtonColor: theme.primary,
      timer: 3000
    });
  };

  const handleSaveNotes = () => {
    if (currentIntervention) {
      setCurrentIntervention({
        ...currentIntervention,
        notesTechnicien: technicianNotes
      });
      setIsEditingNotes(false);
      Swal.fire({
        icon: 'success',
        title: 'Notes enregistrées',
        confirmButtonColor: theme.primary,
        timer: 1500
      });
    }
  };

  const handleRequestSupport = () => {
    Swal.fire({
      title: 'Demande de support',
      text: 'Voulez-vous demander un support technique supplémentaire?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: theme.primary,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Confirmer'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Demande envoyée',
          text: 'Votre demande de support a été envoyée au gestionnaire',
          confirmButtonColor: theme.primary,
          timer: 3000
        });
      }
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "Haute": return <Badge bg="danger">{priority}</Badge>;
      case "Moyenne": return <Badge bg="warning">{priority}</Badge>;
      case "Basse": return <Badge bg="secondary">{priority}</Badge>;
      default: return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      {/* Header */}
      <Row className="mb-4 align-items-center">
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
                Intervention en cours
              </h2>
              <p className="mb-0 text-muted">
                Technicien: Mohamed Ali • {currentIntervention?.etat === "Résolue" ? 
                  <Badge bg="success">Disponible</Badge> : 
                  <Badge bg="warning">Occupé</Badge>}
              </p>
            </div>
            {currentIntervention && (
              <div>
                <Badge bg={currentIntervention.etat === "Résolue" ? "success" : "primary"} className="fs-6 px-3 py-2">
                  {currentIntervention.etat}
                </Badge>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement de votre intervention...</p>
        </div>
      ) : currentIntervention ? (
        <>
          {/* Main Content */}
          <Row>
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0 fw-bold">
                    <FiTool className="me-2" /> Détails de l'intervention #{currentIntervention.id}
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-4">
                    {/* Location Section */}
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-4">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                          <FiMapPin color={theme.primary} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-2">Localisation</h6>
                          <p className="mb-1 fw-medium">{currentIntervention.nomSite}</p>
                          <p className="text-muted small">{currentIntervention.adresse}</p>
                        </div>
                      </div>

                      {/* Dates Section */}
                      <div className="d-flex align-items-start">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                          <FiCalendar color={theme.primary} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-2">Dates</h6>
                          <div className="mb-2">
                            <p className="mb-0 text-muted small">Déclarée le:</p>
                            <p className="mb-0 fw-medium">{formatDate(currentIntervention.dateDeclaration)}</p>
                          </div>
                          <div>
                            <p className="mb-0 text-muted small">Intervention prévue:</p>
                            <p className="mb-0 fw-medium">{formatDate(currentIntervention.dateIntervention)}</p>
                          </div>
                        </div>
                      </div>
                    </Col>

                    {/* Technical Details Section */}
                    <Col md={6}>
                      <div className="d-flex align-items-start mb-4">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                          <FiInfo color={theme.primary} />
                        </div>
                        <div>
                          <h6 className="fw-bold mb-2">Détails techniques</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Type:</span>
                            <span className="fw-medium">{currentIntervention.typePanne}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted small">Priorité:</span>
                            <span>{getPriorityBadge(currentIntervention.priorite)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Section */}
                      <div className="d-flex align-items-start">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                          <FiClock color={theme.primary} />
                        </div>
                        <div className="w-100">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="fw-bold mb-0">Progression</h6>
                            <span className="fw-bold">{currentIntervention.progression}%</span>
                          </div>
                          <ProgressBar 
                            now={currentIntervention.progression} 
                            variant={
                              currentIntervention.etat === "Non résolue" ? "danger" : 
                              currentIntervention.etat === "En cours" ? "warning" : "success"
                            } 
                            className="mb-3"
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Description Section */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3">Description de la panne</h6>
                    <p className="text-muted" style={{ lineHeight: '1.7' }}>
                      {currentIntervention.descriptionPanne}
                    </p>
                  </div>

                  {/* Technician Notes Section */}
                  <div className="mt-4 pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Mes notes</h6>
                      {isEditingNotes ? (
                        <div>
                          <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => setIsEditingNotes(false)}>
                            Annuler
                          </Button>
                          <Button variant="primary" size="sm" onClick={handleSaveNotes}>
                            Enregistrer
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline-primary" size="sm" onClick={() => setIsEditingNotes(true)}>
                          <FiEdit className="me-1" /> Modifier
                        </Button>
                      )}
                    </div>
                    {isEditingNotes ? (
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={technicianNotes}
                        onChange={(e) => setTechnicianNotes(e.target.value)}
                      />
                    ) : (
                      <p className="text-muted" style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                        {technicianNotes || "Aucune note pour le moment"}
                      </p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Action Panel */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0 fw-bold">
                    <FiCheck className="me-2" /> Actions
                  </h5>
                </Card.Header>
                <Card.Body>
                  {/* Status Management */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Changer le statut</h6>
                    <div className="d-grid gap-2">
                      <Button
                        variant={currentIntervention.etat === "Non résolue" ? "danger" : "outline-danger"}
                        onClick={() => handleUpdateStatus("Non résolue")}
                        disabled={currentIntervention.etat === "Non résolue"}
                      >
                        <FiAlertCircle className="me-2" />
                        Non résolue
                      </Button>
                      <Button
                        variant={currentIntervention.etat === "En cours" ? "warning" : "outline-warning"}
                        onClick={() => handleUpdateStatus("En cours")}
                        disabled={currentIntervention.etat === "En cours"}
                      >
                        <FiClock className="me-2" />
                        En cours
                      </Button>
                      <Button
                        variant={currentIntervention.etat === "Résolue" ? "success" : "outline-success"}
                        onClick={() => handleUpdateStatus("Résolue")}
                        disabled={currentIntervention.etat === "Résolue"}
                      >
                        <FiCheck className="me-2" />
                        Résolue
                      </Button>
                    </div>
                  </div>

                  {/* Report Section */}
                  <div className="mb-4">
                    <h6 className="fw-bold mb-3">Rapport technique</h6>
                    {currentIntervention.etat === "Résolue" ? (
                      currentIntervention.rapport ? (
                        <Alert variant="success">
                          <FiFileText className="me-2" />
                          Rapport déjà soumis
                        </Alert>
                      ) : (
                        <Button
                          variant="primary"
                          className="w-100"
                          onClick={() => setShowReportModal(true)}
                        >
                          <FiFileText className="me-2" />
                          Rédiger le rapport
                        </Button>
                      )
                    ) : (
                      <Alert variant="secondary">
                        Disponible seulement lorsque l'intervention est marquée comme résolue
                      </Alert>
                    )}
                  </div>

                  {/* Additional Actions */}
                  <div>
                    <h6 className="fw-bold mb-3">Autres actions</h6>
                    <Button
                      variant="outline-primary"
                      className="w-100 mb-2"
                      onClick={handleRequestSupport}
                    >
                      <FiAlertCircle className="me-2" />
                      Demander support
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Report Modal */}
          <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>
                <FiFileText className="me-2" />
                Rédiger le rapport technique
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Rapport simplifié</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  placeholder="Décrivez simplement ce que vous avez fait pour résoudre le problème..."
                />
                <Form.Text className="text-muted">
                  Exemple: "J'ai remplacé le câble réseau défectueux et testé la connexion - tout fonctionne maintenant"
                </Form.Text>
              </Form.Group>
              <Alert variant="info">
                Ce rapport sera envoyé au gestionnaire et ne pourra plus être modifié après soumission.
              </Alert>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowReportModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleGenerateReport}>
                <FiSend className="me-2" />
                Envoyer le rapport
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Card className="border-0 shadow-sm text-center py-5">
          <Card.Body>
            <div className="bg-primary bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4">
              <FiCheck color={theme.primary} size={32} />
            </div>
            <h4 className="fw-bold mb-3">Aucune intervention en cours</h4>
            <p className="text-muted mb-4">
              Vous n'avez actuellement aucune intervention assignée.
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Voir le tableau de bord
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default InterventionTechnicien;