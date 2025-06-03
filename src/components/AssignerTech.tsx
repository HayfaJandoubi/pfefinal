import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form, Alert, Badge, ListGroup } from "react-bootstrap";
import { FiArrowLeft, FiUser, FiSave, FiClock, FiAlertCircle, FiCheck, FiX, FiMapPin, FiTool, FiCalendar, FiInfo } from "react-icons/fi";
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
  selection: "rgba(63, 81, 181, 0.1)"
};

interface InterventionDetails {
  id: number;
  nomSite: string;
  adresse: string;
  coordonnees: string;
  typePanne: string;
  dateDeclaration: string;
  techniciens?: string[];
  etat: "Non résolue" | "En cours" | "Résolue";
  descriptionPanne: string;
}

interface Technicien {
  id: string;
  nom: string;
  specialite: string;
  disponibilite: "Disponible" | "Occupé" | "En congé";
  interventionsEnCours: number;
}

const AssignerTech = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const intervention: InterventionDetails = state?.intervention || {
    id: 1,
    nomSite: "Site Sahloul",
    adresse: "Sahloul, Sousse",
    coordonnees: "35.8256, 10.6084",
    typePanne: "Problème réseau",
    dateDeclaration: "2023-05-15T09:30",
    etat: "Non résolue",
    descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site"
  };

  // Mock data for technicians - properly typed
  const availableTechniciens: Technicien[] = [
    { id: "tech1", nom: "Mohamed Ali", specialite: "Réseaux", disponibilite: "Disponible", interventionsEnCours: 1 },
    { id: "tech2", nom: "Ahmed Ben Salah", specialite: "Électricité", disponibilite: "Disponible", interventionsEnCours: 0 },
    { id: "tech4", nom: "Karim Jebali", specialite: "Matériel", disponibilite: "Disponible", interventionsEnCours: 1 }
  ];

  const [techniciens] = useState<Technicien[]>(availableTechniciens);
  const [selectedTechs, setSelectedTechs] = useState<string[]>(intervention.techniciens || []);
  const [dateIntervention, setDateIntervention] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState<string>("Tous");

  // Filter technicians based on specialty
  const filteredTechniciens = techniciens.filter(tech => {
    return filterSpecialite === "Tous" || tech.specialite === filterSpecialite;
  });

  // Get available specialties for filter
  const specialties = Array.from(new Set(techniciens.map(t => t.specialite)));

  const handleTechSelection = (techId: string) => {
    setSelectedTechs(prev => {
      if (prev.includes(techId)) {
        return prev.filter(id => id !== techId);
      } else {
        return [...prev, techId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (selectedTechs.length === 0) {
      setIsSubmitting(false);
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez sélectionner au moins un technicien',
        confirmButtonColor: theme.primary
      });
      return;
    }

    // Simulate API call
    setTimeout(async () => {
      const updatedIntervention = {
        ...intervention,
        techniciens: selectedTechs,
        dateIntervention: dateIntervention || new Date().toISOString(),
        etat: "En cours" as const
      };

      console.log("Techniciens assignés:", {
        interventionId: intervention.id,
        technicienIds: selectedTechs,
        dateIntervention,
        commentaire
      });

      setIsSubmitting(false);
      
      await Swal.fire({
        icon: 'success',
        title: 'Assignation confirmée',
        html: 'Les techniciens assignés seront notifiés par email',
        confirmButtonColor: theme.primary,
        confirmButtonText: 'Continuer',
        timer: 3000,
        timerProgressBar: true
      });

      navigate("/details-intervention", { state: { intervention: updatedIntervention } });
    }, 1500);
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
            style={{ borderWidth: '2px', fontWeight: 500 }}
          >
            <FiArrowLeft className="me-2" /> Retour
          </Button>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-2 fw-bold" style={{ color: theme.dark }}>
                Assignation des techniciens
              </h2>
              <p className="mb-0 text-muted" style={{ fontSize: '1.1rem' }}>
                Intervention #{intervention.id} • {intervention.nomSite}
              </p>
            </div>
            <div>
              <Badge bg="danger" className="fs-6 px-3 py-2 d-flex align-items-center">
                <FiAlertCircle className="me-2" /> Non résolue
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Intervention Summary */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ border: `1px solid ${theme.border}` }}>
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-inline-flex me-3">
                  <FiInfo color={theme.primary} />
                </span>
                Détails de l'intervention
              </h5>
            </Card.Header>
            <Card.Body className="pt-1">
              <Row className="g-3">
                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <FiMapPin className="me-3" size={20} color={theme.primary} />
                    <div>
                      <h6 className="mb-0 fw-bold">Site</h6>
                      <p className="mb-0">{intervention.nomSite}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiMapPin className="me-3" size={20} color={theme.primary} />
                    <div>
                      <h6 className="mb-0 fw-bold">Adresse</h6>
                      <p className="mb-0">{intervention.adresse}</p>
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="d-flex align-items-center mb-3">
                    <FiTool className="me-3" size={20} color={theme.primary} />
                    <div>
                      <h6 className="mb-0 fw-bold">Type de panne</h6>
                      <p className="mb-0">{intervention.typePanne}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <FiCalendar className="me-3" size={20} color={theme.primary} />
                    <div>
                      <h6 className="mb-0 fw-bold">Date déclaration</h6>
                      <p className="mb-0">
                        {new Date(intervention.dateDeclaration).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div>
                    <h6 className="fw-bold mb-2">Description</h6>
                    <p className="text-muted" style={{ lineHeight: '1.6' }}>{intervention.descriptionPanne}</p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assignment Form */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm" style={{ border: `1px solid ${theme.border}` }}>
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* Date Intervention */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <FiClock className="me-2" size={18} />
                    Date prévue d'intervention
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={dateIntervention}
                    onChange={(e) => setDateIntervention(e.target.value)}
                    required
                    className="py-2"
                    style={{ border: `1px solid ${theme.border}`, borderRadius: '8px' }}
                  />
                  <Form.Text className="text-muted">
                    Sélectionnez la date et l'heure prévues pour l'intervention
                  </Form.Text>
                </Form.Group>

                {/* Technician Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <FiUser className="me-2" size={18} />
                    Sélectionner un ou plusieurs techniciens
                  </Form.Label>
                  
                  {/* Specialty Filter */}
                  <div className="mb-3">
                    <Form.Select 
                      value={filterSpecialite}
                      onChange={(e) => setFilterSpecialite(e.target.value)}
                      className="py-2"
                      style={{ 
                        width: '250px',
                        border: `1px solid ${theme.border}`,
                        borderRadius: '8px'
                      }}
                    >
                      <option value="Tous">Toutes les spécialités</option>
                      {specialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </Form.Select>
                  </div>

                  {/* Technicians List */}
                  <div style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '8px' }}>
                    {filteredTechniciens.length > 0 ? (
                      <ListGroup>
                        {filteredTechniciens.map(tech => (
                          <ListGroup.Item 
                            key={tech.id}
                            action
                            onClick={() => handleTechSelection(tech.id)}
                            className="d-flex justify-content-between align-items-center py-3 px-4"
                            style={{
                              border: `1px solid ${theme.border}`,
                              marginBottom: '8px',
                              borderRadius: '8px',
                              transition: 'all 0.2s',
                              backgroundColor: selectedTechs.includes(tech.id) ? theme.selection : 'white'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <div 
                                  className={`d-flex align-items-center justify-content-center p-2 rounded-circle ${selectedTechs.includes(tech.id) ? 'bg-primary text-white' : 'bg-light'}`}
                                  style={{ width: '40px', height: '40px' }}
                                >
                                  <FiUser size={18} />
                                </div>
                              </div>
                              <div>
                                <h6 className="mb-1">{tech.nom}</h6>
                                <small className="text-muted d-flex align-items-center">
                                  <span className="me-2">Spécialité: {tech.specialite}</span>
                                  <Badge bg="success" className="d-flex align-items-center py-1">
                                    <FiCheck size={12} className="me-1" /> Disponible
                                  </Badge>
                                </small>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Alert variant="info" className="d-flex align-items-center">
                        <FiX className="me-2" />
                        Aucun technicien ne correspond aux filtres sélectionnés
                      </Alert>
                    )}
                  </div>
                </Form.Group>

                {/* Comment */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex align-items-center">
                    <FiUser className="me-2" size={18} />
                    Commentaire (optionnel)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ajoutez des instructions spécifiques pour les techniciens..."
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                    style={{ 
                      border: `1px solid ${theme.border}`,
                      borderRadius: '8px',
                      resize: 'none'
                    }}
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || selectedTechs.length === 0}
                    className="d-flex align-items-center px-4 py-2"
                    style={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      borderRadius: '8px',
                      minWidth: '200px',
                      justifyContent: 'center'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Assignation en cours...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Confirmer l'assignation
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Selected Technicians Preview */}
        <Col md={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ 
            top: '20px',
            border: `1px solid ${theme.border}`,
            borderRadius: '12px'
          }}>
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <span className="bg-primary bg-opacity-10 p-2 rounded-circle d-inline-flex me-3">
                  <FiUser color={theme.primary} />
                </span>
                Techniciens sélectionnés ({selectedTechs.length})
              </h5>
            </Card.Header>
            <Card.Body>
              {selectedTechs.length > 0 ? (
                <>
                  <ListGroup variant="flush">
                    {techniciens
                      .filter(t => selectedTechs.includes(t.id))
                      .map(tech => (
                        <ListGroup.Item key={tech.id} className="mb-3 px-0">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 d-flex p-2 rounded-circle me-3">
                              <FiUser size={20} color={theme.primary} />
                            </div>
                            <div>
                              <h6 className="mb-1">{tech.nom}</h6>
                              <div className="d-flex gap-2">
                                <Badge bg="info" className="py-1">{tech.specialite}</Badge>
                                <Badge bg="success" className="py-1 d-flex align-items-center">
                                  <FiCheck size={12} className="me-1" /> Disponible
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                  </ListGroup>
                  
                  {dateIntervention && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="fw-bold d-flex align-items-center mb-3">
                        <FiClock className="me-2" />
                        Intervention prévue
                      </h6>
                      <p className="mb-0 fw-medium">
                        {new Date(dateIntervention).toLocaleString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <Alert variant="info" className="d-flex align-items-center">
                  <FiUser className="me-2" />
                  Aucun technicien sélectionné
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignerTech;