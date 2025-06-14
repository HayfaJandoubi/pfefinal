import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiGlobe, FiEye, FiEyeOff } from 'react-icons/fi';
import { Card } from 'react-bootstrap';
import logo from '../assets/logoTT.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de connexion
    navigate('/dashboard');
  };

  const handleForgotPassword = () => {
    if (!email) {
      Swal.fire({
        title: 'Email manquant',
        text: 'Veuillez saisir votre adresse email avant de demander une réinitialisation.',
        icon: 'warning',
        confirmButtonColor: '#0056b3',
      });
      return;
    }

    Swal.fire({
      title: 'Mot de passe oublié?',
      text: `Voulez-vous réinitialiser le mot de passe pour ${email}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0056b3',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Demande envoyée',
          text: 'L\'administrateur a été notifié. Vous recevrez votre nouveau mot de passe par email.',
          icon: 'success',
          confirmButtonColor: '#0056b3',
        });
      }
    });
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <div style={styles.formSection}>
          <div style={styles.logoWrapper}>
            <img src={logo} alt="Tunisie Telecom" style={styles.logo} />
          </div>

          <div style={styles.formWrapper}>
            <h2 style={styles.formTitle}>Connexion à votre espace</h2>
            <p style={styles.formSubtitle}>Accédez à votre tableau de bord</p>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Adresse Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.inputField}
                  placeholder="Saisissez votre e-mail"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Mot de passe</label>
                <div style={styles.passwordInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.inputField}
                    placeholder="Saisissez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div style={styles.optionsRow}>
                <div style={styles.rememberMeWrapper}>
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
                    Se souvenir de moi
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={styles.forgotPasswordLink}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button type="submit" style={styles.submitButton}>
                Se connecter
              </button>
            </form>
          </div>
        </div>

        <div style={styles.imageSection}>
          <div style={styles.imageOverlay}></div>
          <div style={styles.imageContent}>
            <h3 style={styles.imageTitle}>Bienvenue chez Tunisie Telecom</h3>
            <p style={styles.imageText}>
              Connectez-vous pour accéder à votre espace personnel et gérer vos services
            </p>
          </div>
        </div>
      </div>

      <Card.Footer style={styles.footer}>
        <small style={styles.footerText}>
          <FiGlobe style={styles.globeIcon} />
          © {new Date().getFullYear()} Tunisie Telecom - Tous droits réservés
        </small>
      </Card.Footer>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    width: '100vw',
    overflowX: 'hidden' as const,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    width: '100%',
    minHeight: 'calc(100vh - 60px)',
  },
  formSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
    minWidth: '50%',
  },
  logoWrapper: {
    marginBottom: '40px',
    textAlign: 'center' as const,
  },
  logo: {
    height: '100px',
    width: 'auto',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '450px',
  },
  formTitle: {
    color: '#0056b3',
    fontSize: '28px',
    fontWeight: '600' as const,
    marginBottom: '8px',
    textAlign: 'center' as const,
  },
  formSubtitle: {
    color: '#6c757d',
    fontSize: '16px',
    marginBottom: '32px',
    textAlign: 'center' as const,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  inputLabel: {
    display: 'block',
    marginBottom: '8px',
    color: '#495057',
    fontSize: '14px',
    fontWeight: '500' as const,
  },
  inputField: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#212529',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  passwordInputWrapper: {
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
  },
  passwordToggle: {
    position: 'absolute' as const,
    right: '12px',
    background: 'transparent',
    border: 'none',
    color: '#6c757d',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  rememberMeWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    accentColor: '#0056b3',
  },
  rememberMeLabel: {
    color: '#495057',
    fontSize: '14px',
    cursor: 'pointer',
  },
  forgotPasswordLink: {
    background: 'none',
    border: 'none',
    color: '#0056b3',
    fontSize: '14px',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0056b3',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0, 86, 179, 0.2)',
  },
  imageSection: {
    flex: 1,
    backgroundImage: 'url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '50%',
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 86, 179, 0.85)',
  },
  imageContent: {
    position: 'relative' as const,
    zIndex: 1,
    color: '#ffffff',
    textAlign: 'center' as const,
    padding: '40px',
    maxWidth: '600px',
  },
  imageTitle: {
    fontSize: '32px',
    fontWeight: '600' as const,
    marginBottom: '16px',
  },
  imageText: {
    fontSize: '18px',
    lineHeight: '1.6',
    opacity: 0.9,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: '16px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e9ecef',
    height: '60px',
  },
  footerText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6c757d',
    fontSize: '14px',
  },
  globeIcon: {
    marginRight: '8px',
    fontSize: '16px',
  },
};

export default Login;