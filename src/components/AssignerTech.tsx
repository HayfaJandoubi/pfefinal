import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form, Alert, Badge, ListGroup } from "react-bootstrap";
import { FiArrowLeft, FiUser, FiSave, FiClock, FiAlertCircle } from "react-icons/fi";

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
  technicien?: string;
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

  // Mock data for technicians - replace with API call
  const [techniciens, setTechniciens] = useState<Technicien[]>([
    { id: "tech1", nom: "Mohamed Ali", specialite: "Réseaux", disponibilite: "Disponible", interventionsEnCours: 1 },
    { id: "tech2", nom: "Ahmed Ben Salah", specialite: "Électricité", disponibilite: "Disponible", interventionsEnCours: 0 },
    { id: "tech3", nom: "Samira Khemiri", specialite: "Réseaux", disponibilite: "Occupé", interventionsEnCours: 3 },
    { id: "tech4", nom: "Karim Jebali", specialite: "Matériel", disponibilite: "Disponible", interventionsEnCours: 1 },
    { id: "tech5", nom: "Leila Mansour", specialite: "Logiciel", disponibilite: "En congé", interventionsEnCours: 0 }
  ]);

  const [selectedTech, setSelectedTech] = useState<string | null>(intervention.technicien || null);
  const [dateIntervention, setDateIntervention] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState<string>("Tous");
  const [filterDisponibilite, setFilterDisponibilite] = useState<string>("Tous");

  // Filter technicians based on filters
  const filteredTechniciens = techniciens.filter(tech => {
    const matchesSpecialite = filterSpecialite === "Tous" || tech.specialite === filterSpecialite;
    const matchesDisponibilite = filterDisponibilite === "Tous" || tech.disponibilite === filterDisponibilite;
    return matchesSpecialite && matchesDisponibilite;
  });

  // Get available specialties for filter
  const specialties = Array.from(new Set(techniciens.map(t => t.specialite)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedTech) {
      alert("Veuillez sélectionner un technicien");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const updatedIntervention = {
        ...intervention,
        technicien: selectedTech,
        dateIntervention: dateIntervention || new Date().toISOString(),
        etat: "En cours" as const
      };

      console.log("Technicien assigné:", {
        interventionId: intervention.id,
        technicienId: selectedTech,
        dateIntervention,
        commentaire
      });

      setIsSubmitting(false);
      setSuccessMessage("Technicien assigné avec succès");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/details-intervention", { state: { intervention: updatedIntervention } });
      }, 2000);
    }, 1500);
  };

  const getDisponibiliteBadge = (disponibilite: Technicien["disponibilite"]) => {
    switch(disponibilite) {
      case "Disponible": return <Badge bg="success">{disponibilite}</Badge>;
      case "Occupé": return <Badge bg="warning">{disponibilite}</Badge>;
      case "En congé": return <Badge bg="secondary">{disponibilite}</Badge>;
      default: return <Badge bg="secondary">{disponibilite}</Badge>;
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
                Assigner un technicien
              </h2>
              <p className="mb-0 text-muted">
                Intervention #{intervention.id} - {intervention.nomSite}
              </p>
            </div>
            <div>
              <Badge bg="danger" className="fs-6 px-3 py-2">
                <FiAlertCircle className="me-1" /> Non résolue
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* Intervention Summary */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">Détails de l'intervention</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Site:</span>
                      <span>{intervention.nomSite}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Adresse:</span>
                      <span>{intervention.adresse}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Type de panne:</span>
                      <span>{intervention.typePanne}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Date déclaration:</span>
                      <span>{new Date(intervention.dateDeclaration).toLocaleString()}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span className="fw-bold">Technicien actuel:</span>
                      <span>{intervention.technicien || "Non assigné"}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <p className="fw-bold mb-1">Description:</p>
                  <p>{intervention.descriptionPanne}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Assignment Form */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Date Intervention */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    <FiClock className="me-2" />
                    Date prévue d'intervention
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={dateIntervention}
                    onChange={(e) => setDateIntervention(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Sélectionnez la date et l'heure prévues pour l'intervention
                  </Form.Text>
                </Form.Group>

                {/* Technician Selection */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold d-flex justify-content-between align-items-center">
                    <span><FiUser className="me-2" />Sélectionner un technicien</span>
                  </Form.Label>
                  
                  {/* Filters */}
                  <div className="d-flex gap-3 mb-3">
                    <Form.Select 
                      style={{ width: '200px' }}
                      value={filterSpecialite}
                      onChange={(e) => setFilterSpecialite(e.target.value)}
                    >
                      <option value="Tous">Toutes spécialités</option>
                      {specialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </Form.Select>

                    <Form.Select 
                      style={{ width: '200px' }}
                      value={filterDisponibilite}
                      onChange={(e) => setFilterDisponibilite(e.target.value)}
                    >
                      <option value="Tous">Toutes disponibilités</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Occupé">Occupé</option>
                      <option value="En congé">En congé</option>
                    </Form.Select>
                  </div>

                  {/* Technicians List */}
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredTechniciens.length > 0 ? (
                      <ListGroup>
                        {filteredTechniciens.map(tech => (
                          <ListGroup.Item 
                            key={tech.id}
                            action
                            active={selectedTech === tech.id}
                            onClick={() => setSelectedTech(tech.id)}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h6 className="mb-1">{tech.nom}</h6>
                              <small className="text-muted">Spécialité: {tech.specialite}</small>
                            </div>
                            <div className="d-flex flex-column align-items-end">
                              {getDisponibiliteBadge(tech.disponibilite)}
                              <small className="text-muted">
                                {tech.interventionsEnCours} intervention{tech.interventionsEnCours !== 1 ? 's' : ''} en cours
                              </small>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <Alert variant="info">
                        Aucun technicien ne correspond aux filtres sélectionnés
                      </Alert>
                    )}
                  </div>
                </Form.Group>

                {/* Comment */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Commentaire (optionnel)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ajoutez des instructions spécifiques pour le technicien..."
                    value={commentaire}
                    onChange={(e) => setCommentaire(e.target.value)}
                  />
                </Form.Group>

                {/* Submit Button */}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || !selectedTech}
                    className="d-flex align-items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Assignation en cours...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Assigner le technicien
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Selected Technician Preview */}
        <Col md={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 fw-bold">Technicien sélectionné</h5>
            </Card.Header>
            <Card.Body>
              {selectedTech ? (
                <>
                  {techniciens.filter(t => t.id === selectedTech).map(tech => (
                    <div key={tech.id}>
                      <div className="text-center mb-3">
                        <div className="bg-primary bg-opacity-10 d-inline-flex p-4 rounded-circle mb-2">
                          <FiUser size={32} color={theme.primary} />
                        </div>
                        <h4>{tech.nom}</h4>
                        <Badge bg="info">{tech.specialite}</Badge>
                      </div>
                      
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Disponibilité:</strong> {getDisponibiliteBadge(tech.disponibilite)}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Interventions en cours:</strong> {tech.interventionsEnCours}
                        </ListGroup.Item>
                      </ListGroup>

                      {dateIntervention && (
                        <div className="mt-3 p-3 bg-light rounded">
                          <h6 className="fw-bold">Intervention prévue:</h6>
                          <p className="mb-0">
                            {new Date(dateIntervention).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <Alert variant="info">
                  Aucun technicien sélectionné
                </Alert>
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
            cursor: pointer;
            transition: all 0.2s;
          }
          .list-group-item:hover {
            background-color: rgba(63, 81, 181, 0.05);
          }
          .list-group-item.active {
            background-color: ${theme.primary};
            border-color: ${theme.primary};
          }
        `}
      </style>
    </Container>
  );
};

export default AssignerTech;