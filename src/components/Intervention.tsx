import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Badge, Alert, ProgressBar } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { FiArrowLeft, FiClock, FiAlertCircle, FiCheck, FiMapPin, FiTool, FiCalendar, FiUser, FiInfo, FiEdit } from "react-icons/fi";
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
  border: "#e0e0e0",
  selection: "rgba(63, 81, 181, 0.08)"
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
}

const InterventionTechnicien = () => {
  const navigate = useNavigate();
  const [currentIntervention, setCurrentIntervention] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [technicianNotes, setTechnicianNotes] = useState("");

  // Mock data - replace with API call
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

  const handleUpdateProgress = async () => {
    const { value: progress } = await Swal.fire({
      title: 'Mettre à jour la progression',
      input: 'range',
      inputLabel: 'Progression actuelle',
      inputAttributes: {
        min: '0',
        max: '100',
        step: '5'
      },
      inputValue: currentIntervention?.progression || 0,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: theme.primary,
      showCancelButton: true,
      customClass: {
        input: 'swal2-range-input'
      }
    });

    if (progress && currentIntervention) {
      const newProgress = parseInt(progress);
      const isCompleted = newProgress === 100;
      
      setCurrentIntervention({
        ...currentIntervention,
        progression: newProgress,
        etat: isCompleted ? "Résolue" : "En cours"
      });

      Swal.fire({
        icon: 'success',
        title: isCompleted ? 'Intervention terminée' : 'Progression mise à jour',
        text: isCompleted 
          ? 'Cette intervention est marquée comme résolue' 
          : `La progression est maintenant à ${newProgress}%`,
        confirmButtonColor: theme.primary,
        timer: 3000
      });
    }
  };

  const handleCompleteIntervention = async () => {
    if (!currentIntervention) return;

    const result = await Swal.fire({
      title: 'Confirmer la résolution',
      text: "Voulez-vous marquer cette intervention comme résolue?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: theme.primary,
      cancelButtonColor: theme.secondary,
      confirmButtonText: 'Oui, marquer comme résolu',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      setCurrentIntervention({
        ...currentIntervention,
        progression: 100,
        etat: "Résolue"
      });

      Swal.fire({
        icon: 'success',
        title: 'Intervention résolue',
        text: 'Le gestionnaire sera notifié de la résolution',
        confirmButtonColor: theme.primary,
        timer: 3000
      });
    }
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

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "Haute": return <Badge bg="danger" className="py-2 px-3">{priority}</Badge>;
      case "Moyenne": return <Badge bg="warning" className="py-2 px-3">{priority}</Badge>;
      case "Basse": return <Badge bg="secondary" className="py-2 px-3">{priority}</Badge>;
      default: return <Badge bg="secondary" className="py-2 px-3">{priority}</Badge>;
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
            className="d-flex align-items-center mb-3 px-3 py-2"
            style={{ 
              borderWidth: '2px', 
              fontWeight: 500,
              borderRadius: '8px'
            }}
          >
            <FiArrowLeft className="me-2" /> Retour
          </Button>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2 fw-bold" style={{ color: theme.dark }}>
                Intervention en cours
              </h2>
              <p className="mb-0 text-muted" style={{ fontSize: '1.1rem' }}>
                Technicien: Mohamed Ali • Statut: <Badge bg="warning" className="py-1">Occupé</Badge>
              </p>
            </div>
            <div>
              <Badge bg="warning" className="fs-6 px-3 py-2 d-flex align-items-center">
                <FiAlertCircle className="me-2" /> 1 intervention active
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement de votre intervention...</p>
        </div>
      ) : currentIntervention ? (
        <Row>
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4" style={{ 
              border: `1px solid ${theme.border}`,
              borderRadius: '12px'
            }}>
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-inline-flex me-3">
                    <FiTool color={theme.primary} />
                  </span>
                  Détails de l'intervention #{currentIntervention.id}
                </h5>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  {/* Location Section */}
                  <Col md={6}>
                    <div className="d-flex align-items-start mb-4">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                        <FiMapPin color={theme.primary} size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold mb-2">Localisation</h6>
                        <p className="mb-1 fw-medium">{currentIntervention.nomSite}</p>
                        <p className="text-muted small">{currentIntervention.adresse}</p>
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => Swal.fire({
                            title: 'Localisation',
                            text: 'Ouvrir dans Google Maps?',
                            icon: 'question',
                            confirmButtonColor: theme.primary,
                            showCancelButton: true
                          })}
                        >
                          Voir sur la carte
                        </Button>
                      </div>
                    </div>

                    {/* Dates Section */}
                    <div className="d-flex align-items-start">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                        <FiCalendar color={theme.primary} size={20} />
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
                        <FiInfo color={theme.primary} size={20} />
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
                        <div className="d-flex justify-content-between">
                          <span className="text-muted small">État:</span>
                          <Badge bg={currentIntervention.etat === "Résolue" ? "success" : "primary"} className="py-2 px-3">
                            {currentIntervention.etat}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="d-flex align-items-start">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                        <FiEdit color={theme.primary} size={20} />
                      </div>
                      <div className="w-100">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold mb-0">Progression</h6>
                          <span className="fw-bold">{currentIntervention.progression}%</span>
                        </div>
                        <ProgressBar 
                          now={currentIntervention.progression} 
                          variant={currentIntervention.progression === 100 ? "success" : "primary"}
                          className="mb-3"
                          style={{ height: '10px', borderRadius: '5px' }}
                        />
                        <Button
                          variant={currentIntervention.progression === 100 ? "success" : "primary"}
                          onClick={handleUpdateProgress}
                          className="w-100 py-2"
                          style={{ borderRadius: '8px' }}
                        >
                          {currentIntervention.progression === 100 ? (
                            <>
                              <FiCheck className="me-2" />
                              Intervention terminée
                            </>
                          ) : (
                            <>
                              <FiEdit className="me-2" />
                              Mettre à jour
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Description Section */}
                <div className="mt-4 pt-3 border-top">
                  <h6 className="fw-bold d-flex align-items-center mb-3">
                    <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                      <FiInfo color={theme.primary} size={20} />
                    </span>
                    Description de la panne
                  </h6>
                  <p className="ps-5 text-muted" style={{ lineHeight: '1.7' }}>
                    {currentIntervention.descriptionPanne}
                  </p>
                </div>

                {/* Technician Notes Section */}
                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold d-flex align-items-center mb-0">
                      <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-flex me-3">
                        <FiEdit color={theme.primary} size={20} />
                      </span>
                      Mes notes
                    </h6>
                    {isEditingNotes ? (
                      <div>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          className="me-2"
                          onClick={() => setIsEditingNotes(false)}
                        >
                          Annuler
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={handleSaveNotes}
                        >
                          Enregistrer
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => setIsEditingNotes(true)}
                      >
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
                      className="ps-5"
                      style={{ 
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px',
                        resize: 'none'
                      }}
                    />
                  ) : (
                    <p className="ps-5 text-muted" style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {technicianNotes || "Aucune note pour le moment"}
                    </p>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Completion Section */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm sticky-top" style={{ 
              top: '20px',
              border: `1px solid ${theme.border}`,
              borderRadius: '12px'
            }}>
              <Card.Header className="bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center">
                  <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-inline-flex me-3">
                    <FiCheck color={theme.primary} />
                  </span>
                  Finalisation
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6 className="fw-bold mb-3">État d'avancement</h6>
                  <div className="d-flex align-items-center mb-2">
                    <ProgressBar 
                      now={currentIntervention.progression} 
                      variant={currentIntervention.progression === 100 ? "success" : "primary"}
                      className="flex-grow-1 me-3"
                      style={{ height: '8px', borderRadius: '4px' }}
                    />
                    <span className="fw-bold">{currentIntervention.progression}%</span>
                  </div>
                  <small className="text-muted">
                    {currentIntervention.progression === 100 
                      ? "Intervention terminée" 
                      : "En cours de résolution"}
                  </small>
                </div>

                <div className="mb-4">
                  <h6 className="fw-bold mb-3">Actions</h6>
                  <Button
                    variant={currentIntervention.etat === "Résolue" ? "success" : "primary"}
                    onClick={handleCompleteIntervention}
                    className="w-100 py-2 mb-2"
                    disabled={currentIntervention.etat === "Résolue"}
                    style={{ borderRadius: '8px' }}
                  >
                    {currentIntervention.etat === "Résolue" ? (
                      <>
                        <FiCheck className="me-2" />
                        Résolution confirmée
                      </>
                    ) : (
                      <>
                        <FiCheck className="me-2" />
                        Marquer comme résolu
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="w-100 py-2"
                    style={{ borderRadius: '8px' }}
                    onClick={() => Swal.fire({
                      title: 'Demande de support',
                      text: 'Voulez-vous demander un support technique supplémentaire?',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonColor: theme.primary,
                      confirmButtonText: 'Oui, demander support'
                    })}
                  >
                    <FiAlertCircle className="me-2" />
                    Demander support
                  </Button>
                </div>

                <div>
                  <h6 className="fw-bold mb-3">Statut technicien</h6>
                  <Alert variant="warning" className="d-flex align-items-center">
                    <FiAlertCircle className="me-2 flex-shrink-0" />
                    <small>
                      Votre statut est actuellement <strong>Occupé</strong>. Vous ne pouvez pas recevoir de nouvelles interventions tant que celle-ci n'est pas résolue.
                    </small>
                  </Alert>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <Card className="border-0 shadow-sm text-center py-5" style={{ 
          border: `1px solid ${theme.border}`,
          borderRadius: '12px'
        }}>
          <Card.Body>
            <div className="bg-primary bg-opacity-10 d-inline-flex p-4 rounded-circle mb-4">
              <FiCheck color={theme.primary} size={32} />
            </div>
            <h4 className="fw-bold mb-3">Aucune intervention en cours</h4>
            <p className="text-muted mb-4">
              Vous n'avez actuellement aucune intervention assignée. Votre statut est disponible pour de nouvelles missions.
            </p>
            <Button 
              variant="primary" 
              className="px-4 py-2"
              onClick={() => navigate('/')}
              style={{ borderRadius: '8px' }}
            >
              Voir le tableau de bord
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default InterventionTechnicien;