import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Form, Container, Row, Col, FormCheck, Image, FloatingLabel, Badge } from 'react-bootstrap';
import { FiUser, FiLock, FiLogIn, FiShield, FiGlobe, FiSettings, FiTool } from 'react-icons/fi';
import Swal from 'sweetalert2';

// Type-safe CSS properties
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    background: 'linear-gradient(135deg, rgba(63,81,181,0.1) 0%, rgba(255,255,255,1) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  } as React.CSSProperties,
  card: {
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(63, 81, 181, 0.2)',
    border: 'none',
    width: '100%',
    maxWidth: '500px',
    transform: 'translateY(-5%)'
  } as React.CSSProperties,
  header: {
    backgroundColor: '#3f51b5',
    color: 'white',
    textAlign: 'center' as const,
    padding: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden'
  } as React.CSSProperties,
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(63,81,181,0.8) 0%, rgba(100,115,255,0.6) 100%)',
    zIndex: 0
  } as React.CSSProperties,
  logo: {
    height: '70px',
    marginBottom: '15px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
    position: 'relative',
    zIndex: 1
  } as React.CSSProperties,
  body: {
    padding: '2.5rem',
    position: 'relative'
  } as React.CSSProperties,
  input: {
    borderRadius: '12px',
    padding: '15px 20px',
    border: '1px solid #e0e0e0',
    marginBottom: '1.5rem',
    fontSize: '1rem',
    boxShadow: 'none',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  inputFocus: {
    borderColor: '#3f51b5',
    boxShadow: '0 0 0 0.25rem rgba(63, 81, 181, 0.25)'
  },
  button: {
    borderRadius: '12px',
    padding: '15px',
    fontSize: '1.1rem',
    fontWeight: 500,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(45deg, #3f51b5, #6573c3)',
    border: 'none',
    marginTop: '1rem',
    transition: 'all 0.3s ease'
  } as React.CSSProperties,
  footer: {
    backgroundColor: '#f8f9fa',
    textAlign: 'center' as const,
    padding: '1.5rem',
    borderTop: '1px solid #e0e0e0',
    fontSize: '0.9rem'
  } as React.CSSProperties,
  roleBadge: {
    padding: '10px 20px',
    margin: '0 8px',
    borderRadius: '50px',
    fontWeight: 500,
    fontSize: '0.9rem'
  } as React.CSSProperties,
  floatingLabel: {
    color: '#6c757d',
    fontSize: '1rem'
  } as React.CSSProperties,
  decorativeElement: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, rgba(63,81,181,0.05) 0%, rgba(63,81,181,0.15) 100%)',
    zIndex: 0
  } as React.CSSProperties
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setLoading(false);
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs',
        confirmButtonColor: '#3f51b5',
        background: '#ffffff',
        backdrop: `
          rgba(63,81,181,0.1)
          url("/images/network-loader.gif")
          center top
          no-repeat
        `
      });
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let role = 'technicien';
      if (email.includes('admin')) role = 'admin';
      if (email.includes('gestion')) role = 'gestionnaire';

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', role);

      await Swal.fire({
        icon: 'success',
        title: 'Connexion réussie',
        html: `
          <div style="text-align:center">
            <h3>Bienvenue ${email.split('@')[0]}!</h3>
            <p>Vous êtes connecté en tant que <strong>${getRoleName(role)}</strong></p>
            <div style="margin-top:20px">
              <div style="display:inline-block;background:#f8f9fa;padding:10px 20px;border-radius:10px">
                <FiGlobe size={24} style="margin-right:10px" />
                <span>Réseaux & Sites Mobiles</span>
              </div>
            </div>
          </div>
        `,
        confirmButtonColor: '#3f51b5',
        background: '#ffffff',
        timer: 2500,
        timerProgressBar: true
      });

      switch(role) {
        case 'admin': navigate('/admin/dashboard'); break;
        case 'gestionnaire': navigate('/gestion/dashboard'); break;
        default: navigate('/technicien/interventions');
      }

    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: 'Email ou mot de passe incorrect',
        confirmButtonColor: '#3f51b5',
        background: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role: string) => {
    switch(role) {
      case 'admin': return 'Administrateur';
      case 'gestionnaire': return 'Gestionnaire';
      default: return 'Technicien';
    }
  };

  return (
    <Container fluid style={styles.container}>
      {/* Decorative background elements */}
      <div style={{
        ...styles.decorativeElement,
        top: '-50px',
        right: '-50px',
        transform: 'rotate(45deg)'
      }} />
      <div style={{
        ...styles.decorativeElement,
        bottom: '-70px',
        left: '-70px',
        width: '200px',
        height: '200px'
      }} />

      <Row className="justify-content-center w-100">
        <Col md={8} lg={6} xl={5}>
          <Card style={styles.card}>
            <div style={styles.header}>
              <div style={styles.headerOverlay} />
              <Image 
                src={require('../assets/logoTT.png')} 
                alt="Telecom Logo" 
                style={styles.logo} 
              />
              <h3 style={{ position: 'relative', zIndex: 1 }}>Portail d'Authentification</h3>
              <p style={{ position: 'relative', zIndex: 1, opacity: 0.9, marginBottom: 0 }}>
                <FiShield style={{ marginRight: '8px' }} />
                Sécurité des Réseaux
              </p>
            </div>

            <Card.Body style={styles.body}>
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                display: 'flex',
                gap: '5px'
              }}>
                <FiSettings style={{ color: '#e0e0e0', fontSize: '1.2rem' }} />
              </div>

              <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="floatingEmail" label="Adresse Email" className="mb-4">
                  <Form.Control
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    className="focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Mot de passe" className="mb-4">
                  <Form.Control
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </FloatingLabel>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <FormCheck
                    type="checkbox"
                    id="rememberMe"
                    label="Se souvenir de moi"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="text-muted"
                  />
                  <Button variant="link" className="text-primary p-0" style={{ fontWeight: 500 }}>
                    Mot de passe oublié ?
                  </Button>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  style={styles.button}
                  className="hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="me-2" size={18} />
                      Se connecter
                    </>
                  )}
                </Button>

                <div className="mt-4 pt-4 text-center border-top">
                  <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                    Accès sécurisé pour:
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <Badge bg="primary" style={styles.roleBadge}>
                      <FiSettings className="me-1" />
                      Admin
                    </Badge>
                    <Badge bg="info" style={styles.roleBadge}>
                      <FiUser className="me-1" />
                      Gestion
                    </Badge>
                    <Badge bg="secondary" style={styles.roleBadge}>
                      <FiTool className="me-1" />
                      Technicien
                    </Badge>
                  </div>
                </div>
              </Form>
            </Card.Body>

            <Card.Footer style={styles.footer}>
              <small className="text-muted d-flex align-items-center justify-content-center">
                <FiGlobe className="me-2" />
                © {new Date().getFullYear()} Telecom Tunisia - Tous droits réservés
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* SweetAlert styling */}
      <style>
        {`
          .form-control:focus {
            border-color: #3f51b5;
            box-shadow: 0 0 0 0.25rem rgba(63, 81, 181, 0.25);
          }
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(63, 81, 181, 0.3);
          }
          .floating-label {
            transition: all 0.3s ease;
          }
          .swal2-popup {
            border-radius: 20px !important;
          }
        `}
      </style>
    </Container>
  );
};

export default LoginPage;