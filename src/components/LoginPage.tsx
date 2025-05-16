import React, { useState, useEffect } from 'react';
import { FaUserShield, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/logoTT.png';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email && password) {
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        onLogin();
      } else {
        setError("Veuillez remplir tous les champs.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0066cc 100%, #003366 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 10px 30px rgba(0, 51, 102, 0.3)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '1000px',
        height: '100%'
      }}>
        {/* Login Form Side */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{
            background: '#0066cc',
            padding: '25px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <img src={logo}
              alt="Tunisie Telecom"
              style={{ height: '60px', marginBottom: '15px' }}
            />
            <h2 style={{
              color: 'white',
              margin: 0,
              fontWeight: '600',
              fontSize: '1.5rem'
            }}>
              Portail de Connexion
            </h2>
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '30px',
              background: '#0066cc',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
            }}></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '40px 30px', position: 'relative', zIndex: 1 }}>
            {error && (
              <div className="alert alert-danger" style={{ borderRadius: '8px', padding: '10px 15px', marginBottom: '20px' }}>
                {error}
              </div>
            )}

            <div className="mb-4" style={{ position: 'relative' }}>
              <label htmlFor="email" className="form-label" style={{ color: '#0066cc', fontWeight: '500', marginBottom: '8px' }}>
                Adresse e-mail
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="on"
                  style={{ paddingLeft: '40px', borderRadius: '8px', border: '1px solid #ced4da', height: '45px' }}
                />
                <FaUserShield style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0066cc'
                }} />
              </div>
            </div>

            <div className="mb-4" style={{ position: 'relative' }}>
              <label htmlFor="password" className="form-label" style={{ color: '#0066cc', fontWeight: '500', marginBottom: '8px' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="on"
                  style={{ paddingLeft: '40px', borderRadius: '8px', border: '1px solid #ced4da', height: '45px' }}
                />
                <FaLock style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#0066cc'
                }} />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#0066cc',
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label" htmlFor="rememberMe" style={{ color: '#0066cc', cursor: 'pointer' }}>
                  Se souvenir de moi
                </label>
              </div>
              <a href="#forgot-password" style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontWeight: '500'
              }}>
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="btn w-100"
              disabled={isLoading}
              style={{
                background: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 8px rgba(0, 102, 204, 0.3)'
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: 'center',
            padding: '15px',
            background: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
            color: '#0066cc',
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} Tunisie Telecom. Tous droits réservés.
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem' }}>
              Version 1.0.0
            </p>
          </div>
        </div>

        {/* Image Side */}
        <div style={{
          flex: 1,
          minWidth: '300px',
          backgroundImage: `url('https://www.tunisietelecom.tn/sites/default/files/styles/actualite_image/public/2021-11/tt-agence.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%' 
        }}></div>
      </div>
    </div>
  );
};

export default LoginPage;
