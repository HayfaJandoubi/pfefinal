import { JSX, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Form, Alert, Badge } from "react-bootstrap";
import { FiArrowLeft, FiSave, FiClock, FiCheckCircle, FiAlertCircle, FiTool, FiFileText } from "react-icons/fi";

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
  dateResolution?: string;
  technicien: string;
  etat: "Non résolue" | "En cours" | "Résolue";
  descriptionPanne: string;
  actionsRealisees: string;
  materielUtilise: string;
  dureeIntervention: string;
  notesComplementaires?: string;
}

const MajEtat = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const intervention: InterventionDetails = state?.intervention || {
    id: 1,
    nomSite: "Site Sahloul",
    adresse: "Sahloul, Sousse",
    coordonnees: "35.8256, 10.6084",
    typePanne: "Problème réseau",
    dateDeclaration: "2023-05-15T09:30",
    dateIntervention: "2023-05-16T14:00",
    technicien: "Mohamed Ali",
    etat: "En cours",
    descriptionPanne: "Perte intermittente du signal réseau dans la zone nord du site",
    actionsRealisees: "Vérification des équipements, diagnostic du problème",
    materielUtilise: "Analyseur de spectre, multimètre",
    dureeIntervention: "2 heures",
    notesComplementaires: "Nécessite un remplacement de la carte réseau"
  };

  const [formData, setFormData] = useState<Omit<InterventionDetails, 'nomSite' | 'adresse' | 'coordonnees' | 'dateDeclaration' | 'dateIntervention'> & { 
    dateResolution?: string 
  }>({
    ...intervention,
    dateResolution: intervention.dateResolution || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEtatChange = (value: InterventionDetails["etat"]) => {
    setFormData(prev => ({ ...prev, etat: value }));
  };

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours} heure${diffHours > 1 ? 's' : ''}${diffMinutes > 0 ? ` et ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}` : ''}`;
    }
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  };

  const handleDateResolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateResolution = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, dateResolution };
      
      if (dateResolution && formData.etat === "Résolue") {
        const duration = calculateDuration(intervention.dateIntervention, dateResolution);
        return { ...newData, dureeIntervention: duration };
      }
      
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare final data
    const updatedIntervention = {
      ...intervention,
      ...formData,
      // Only include dateResolution if status is "Résolue"
      dateResolution: formData.etat === "Résolue" ? formData.dateResolution : undefined
    };

    // Simulate API call
    setTimeout(() => {
      console.log("Intervention mise à jour:", updatedIntervention);
      setIsSubmitting(false);
      setSuccessMessage("L'intervention a été mise à jour avec succès");
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/details-intervention", { state: { intervention: updatedIntervention } });
      }, 2000);
    }, 1500);
  };

  const getEtatBadge = (etat: InterventionDetails["etat"]) => {
    switch(etat) {
      case "Non résolue": return <Badge bg="danger">{etat}</Badge>;
      case "En cours": return <Badge bg="warning">{etat}</Badge>;
      case "Résolue": return <Badge bg="success">{etat}</Badge>;
      default: return <Badge bg="secondary">{etat}</Badge>;
    }
  };

  const etatOptions: { value: InterventionDetails["etat"]; label: string; icon: JSX.Element }[] = [
    { value: "Non résolue", label: "Non résolue", icon: <FiAlertCircle className="me-2" /> },
    { value: "En cours", label: "En cours", icon: <FiClock className="me-2" /> },
    { value: "Résolue", label: "Résolue", icon: <FiCheckCircle className="me-2" /> }
  ];

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
                Mise à jour de l'intervention
              </h2>
              <p className="mb-0 text-muted">
                Intervention #{intervention.id} - {intervention.nomSite}
              </p>
            </div>
            <div>
              <h5 className="mb-0">
                État actuel: {getEtatBadge(intervention.etat)}
              </h5>
            </div>
          </div>
        </Col>
      </Row>

      {/* Update Form */}
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {successMessage && (
                <Alert variant="success" className="mb-4">
                  {successMessage}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                {/* Read-only information */}
                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Site</Form.Label>
                      <Form.Control plaintext readOnly defaultValue={intervention.nomSite} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Adresse</Form.Label>
                      <Form.Control plaintext readOnly defaultValue={intervention.adresse} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Coordonnées</Form.Label>
                      <Form.Control plaintext readOnly defaultValue={intervention.coordonnees} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Date déclaration</Form.Label>
                      <Form.Control 
                        plaintext 
                        readOnly 
                        defaultValue={new Date(intervention.dateDeclaration).toLocaleString()} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Date intervention</Form.Label>
                      <Form.Control 
                        plaintext 
                        readOnly 
                        defaultValue={new Date(intervention.dateIntervention).toLocaleString()} 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Durée intervention</Form.Label>
                      <Form.Control 
                        plaintext 
                        readOnly 
                        defaultValue={formData.dureeIntervention} 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Status update */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">État de l'intervention</Form.Label>
                  <div className="d-flex flex-column gap-2">
                    {etatOptions.map((option) => (
                      <Form.Check
                        key={option.value}
                        type="radio"
                        id={`etat-${option.value}`}
                        name="etat"
                        label={
                          <span className="d-flex align-items-center">
                            {option.icon}
                            {option.label}
                          </span>
                        }
                        value={option.value}
                        checked={formData.etat === option.value}
                        onChange={() => handleEtatChange(option.value)}
                        className="py-2 px-3 rounded"
                        style={{
                          backgroundColor: formData.etat === option.value ? 
                            (option.value === "Non résolue" ? "#f8d7da" : 
                             option.value === "En cours" ? "#fff3cd" : "#d1e7dd") : 
                            theme.background,
                          border: formData.etat === option.value ? 
                            `2px solid ${option.value === "Non résolue" ? theme.danger : 
                              option.value === "En cours" ? theme.warning : theme.success}` : 
                            `1px solid ${theme.light}`
                        }}
                      />
                    ))}
                  </div>
                </Form.Group>

                {/* Resolution date (only shown when status is "Résolue") */}
                {formData.etat === "Résolue" && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Date et heure de résolution</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="dateResolution"
                      value={formData.dateResolution || ""}
                      onChange={handleDateResolutionChange}
                      required
                    />
                    <Form.Text className="text-muted">
                      La durée d'intervention sera automatiquement recalculée
                    </Form.Text>
                  </Form.Group>
                )}

                {/* Technical details */}
                <h5 className="fw-bold mb-3"><FiTool className="me-2" /> Détails techniques</h5>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Type de panne</Form.Label>
                      <Form.Control
                        as="select"
                        name="typePanne"
                        value={formData.typePanne}
                        onChange={handleChange}
                      >
                        <option value="Problème réseau">Problème réseau</option>
                        <option value="Panne matérielle">Panne matérielle</option>
                        <option value="Problème électrique">Problème électrique</option>
                        <option value="Problème logiciel">Problème logiciel</option>
                        <option value="Autre">Autre</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Technicien</Form.Label>
                      <Form.Control
                        type="text"
                        name="technicien"
                        value={formData.technicien}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Description de la panne</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descriptionPanne"
                    value={formData.descriptionPanne}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Actions réalisées</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="actionsRealisees"
                    value={formData.actionsRealisees}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Matériel utilisé</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="materielUtilise"
                    value={formData.materielUtilise}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Notes complémentaires</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notesComplementaires"
                    value={formData.notesComplementaires || ""}
                    onChange={handleChange}
                    placeholder="Ajoutez des notes supplémentaires si nécessaire"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-3 mt-4">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                    className="d-flex align-items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <FiSave className="me-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                </div>
              </Form>
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
          .form-control[readonly] {
            background-color: ${theme.background};
          }
          .form-check-input {
            width: 1.2em;
            height: 1.2em;
            margin-top: 0.2em;
          }
          .form-check {
            transition: all 0.2s;
          }
          .form-check:hover {
            background-color: rgba(63, 81, 181, 0.05);
          }
        `}
      </style>
    </Container>
  );
};

export default MajEtat;