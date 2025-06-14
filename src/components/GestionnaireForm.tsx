import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaKey, FaSave, FaUserShield, FaUserCog } from "react-icons/fa";
import { Container, Card, Form, Button, Row, Col, InputGroup } from "react-bootstrap";

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

const AjouterUtilisateur = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userToEdit = location.state?.userToEdit || null;

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    siege: "",
    telephone: "",
    role: "",
    password: generatePassword(),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const tunisianRegions = [
    "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba",
    "Kairouan", "Kasserine", "Kébili", "Kef", "Mahdia", "Manouba", "Médenine",
    "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine",
    "Tozeur", "Tunis", "Zaghouan"
  ];

  function generatePassword(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&!";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  }

  useEffect(() => {
    if (userToEdit) {
      // Format the phone number for display (remove any existing formatting)
      const cleanPhone = userToEdit.telephone.replace(/[^\d]/g, "");
      let formattedPhone = cleanPhone;
      if (cleanPhone.length > 2) {
        formattedPhone = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 5)}`;
        if (cleanPhone.length > 5) {
          formattedPhone += ` ${cleanPhone.slice(5, 8)}`;
        }
      }
      
      setFormData({ 
        ...userToEdit, 
        telephone: formattedPhone,
        // Ensure password is maintained if it exists, otherwise generate one
        password: userToEdit.password || generatePassword() 
      });
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "nom" || name === "prenom") {
      const capitalized = value.replace(/\b\w/g, (c) => c.toUpperCase());
      setFormData((prev) => ({ ...prev, [name]: capitalized }));
    } else if (name === "telephone") {
      // Allow only digits and limit to 8 characters
      const digitsOnly = value.replace(/[^\d]/g, "").slice(0, 8);
      
      // Format as XX XXX XXX
      let formatted = digitsOnly;
      if (digitsOnly.length > 2) {
        formatted = `${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 5)}`;
        if (digitsOnly.length > 5) {
          formatted += ` ${digitsOnly.slice(5, 8)}`;
        }
      }
      
      setFormData((prev) => ({ ...prev, telephone: formatted }));
      
      // Validate length
      if (digitsOnly.length < 8 && digitsOnly.length > 0) {
        setPhoneError("Le numéro doit contenir 8 chiffres");
      } else {
        setPhoneError("");
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    const phoneDigits = formData.telephone.replace(/[^\d]/g, "");
    if (phoneDigits.length !== 8) {
      setPhoneError("Le numéro doit contenir 8 chiffres");
      return;
    }

    if (!formData.role) {
      Swal.fire({
        icon: "warning",
        title: "Rôle requis",
        text: "Veuillez sélectionner un rôle pour l'utilisateur.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Veuillez patienter...",
        text: userToEdit ? "Mise à jour en cours..." : "Ajout de l'utilisateur en cours.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await new Promise((res) => setTimeout(res, 1000));

      Swal.close();
      Swal.fire({
        icon: "success",
        title: userToEdit ? "Modification Réussie" : "Ajout Réussi",
        text: userToEdit
          ? "Les informations ont été mises à jour."
          : "L'utilisateur a été ajouté avec succès.",
      });

      navigate("/gestionnaires");
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite.",
      });
    }
  };

  return (
    <Container fluid className="px-4 py-4" style={{ backgroundColor: theme.background, minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow border-0" style={{ borderRadius: '16px' }}>
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {userToEdit ? (
                    <FaUserCog size={24} color={theme.primary} />
                  ) : (
                    <FaUser size={24} color={theme.primary} />
                  )}
                </div>
                <div>
                  <h2 className="mb-0 fw-bold" style={{ color: theme.dark }}>
                    {userToEdit ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
                  </h2>
                  <p className="mb-0 text-muted">
                    {userToEdit ? "Mettre à jour les informations" : "Créer un nouveau compte utilisateur"}
                  </p>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-4 pt-2">
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Nom</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          <FaUser color={theme.secondary} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleChange}
                          required
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Prénom</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          <FaUser color={theme.secondary} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          required
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          <FaEnvelope color={theme.secondary} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Téléphone</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          +216
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          isInvalid={!!phoneError}
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                          placeholder="XX XXX XXX"
                        />
                      </InputGroup>
                      {phoneError && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {phoneError}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Siège</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          <FaMapMarkerAlt color={theme.secondary} />
                        </InputGroup.Text>
                        <Form.Select
                          name="siege"
                          value={formData.siege}
                          onChange={handleChange}
                          required
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        >
                          <option value="">-- Sélectionnez une région --</option>
                          {tunisianRegions.map((region, idx) => (
                            <option key={idx} value={region}>
                              {region}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-medium text-muted small">Mot de passe</Form.Label>
                      <InputGroup>
                        <InputGroup.Text className="bg-light" style={{ borderRight: 'none' }}>
                          <FaKey color={theme.secondary} />
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          readOnly
                          style={{ borderLeft: 'none', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
                        />
                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{ borderLeft: 'none' }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium text-muted small mb-3">Rôle</Form.Label>
                      <div className="d-flex gap-3">
                        <div className="form-check form-check-card p-3 rounded" style={{ 
                          border: `1px solid ${formData.role === "GESTIONNAIRE" ? theme.primary : '#e0e0e0'}`,
                          backgroundColor: formData.role === "GESTIONNAIRE" ? 'rgba(63, 81, 181, 0.05)' : 'white',
                          flex: 1
                        }}>
                          <input
                            type="radio"
                            name="role"
                            value="GESTIONNAIRE"
                            checked={formData.role === "GESTIONNAIRE"}
                            onChange={handleChange}
                            className="form-check-input"
                            id="gestionnaire"
                            style={{ marginTop: '0.2rem' }}
                          />
                          <label htmlFor="gestionnaire" className="form-check-label d-flex align-items-center ms-2">
                            <FaUserShield className="me-2" size={18} />
                            <div>
                              <div className="fw-bold">Gestionnaire</div>
                              <small className="text-muted">Gestion des utilisateurs</small>
                            </div>
                          </label>
                        </div>
                        <div className="form-check form-check-card p-3 rounded" style={{ 
                          border: `1px solid ${formData.role === "TECHNICIEN" ? theme.primary : '#e0e0e0'}`,
                          backgroundColor: formData.role === "TECHNICIEN" ? 'rgba(63, 81, 181, 0.05)' : 'white',
                          flex: 1
                        }}>
                          <input
                            type="radio"
                            name="role"
                            value="TECHNICIEN"
                            checked={formData.role === "TECHNICIEN"}
                            onChange={handleChange}
                            className="form-check-input"
                            id="technicien"
                            style={{ marginTop: '0.2rem' }}
                          />
                          <label htmlFor="technicien" className="form-check-label d-flex align-items-center ms-2">
                            <FaUserCog className="me-2" size={18} />
                            <div>
                              <div className="fw-bold">Technicien</div>
                              <small className="text-muted">Maintenance technique</small>
                            </div>
                          </label>
                        </div>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-2">
                    <Button
                      type="submit"
                      className="w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                      variant="primary"
                      style={{ borderRadius: '8px' }}
                    >
                      <FaSave className="me-2" />
                      {userToEdit ? "Enregistrer les modifications" : "Ajouter l'utilisateur"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Custom styles */}
      <style>
        {`
          .card {
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
          }
          .form-control, .form-select {
            border-radius: 8px;
            padding: 10px 15px;
          }
          .form-check-input {
            width: 1.2em;
            height: 1.2em;
          }
          .form-check-label {
            display: flex;
            align-items: center;
          }
          .form-check-card {
            transition: all 0.2s;
            cursor: pointer;
          }
          .form-check-card:hover {
            border-color: ${theme.primary} !important;
          }
        `}
      </style>
    </Container>
  );
};

export default AjouterUtilisateur;