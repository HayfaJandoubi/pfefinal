import React, { useState, useEffect } from 'react';
import { IoNotificationsOutline, IoClose } from 'react-icons/io5';
import { 
  Navbar, Dropdown, Badge, Container, ListGroup, Button, 
  Modal, Row, Col, Tab, Tabs 
} from 'react-bootstrap';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'warning' | 'danger' | 'info';
}

interface Styles {
  [key: string]: React.CSSProperties;
}

const Header: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  const userRole = sessionStorage.getItem('userRole') || '';
  const userName = sessionStorage.getItem('userName') || '';

  const styles: Styles = {
    headerNavbar: {
      height: '70px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid #eaeaea'
    },
    notificationToggle: {
      border: 'none',
      background: 'transparent',
      padding: '0.5rem',
      position: 'relative',
      cursor: 'pointer',
      color: '#5a5c69'
    },
    notificationBadge: {
      fontSize: '0.6rem',
      position: 'absolute',
      top: '2px',
      right: '2px'
    },
    notificationDropdown: {
      width: '380px',
      border: '1px solid #e3e6f0',
      boxShadow: '0 0.15rem 0.5rem rgba(0, 0, 0, 0.075)',
      padding: '0',
      borderRadius: '0.35rem'
    },
    notificationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #e3e6f0',
      backgroundColor: '#f8f9fc'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '1rem',
      padding: '0.5rem',
      borderRadius: '0.35rem',
      backgroundColor: '#f8f9fc'
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginRight: '0.75rem'
    },
    userText: {
      display: 'flex',
      flexDirection: 'column'
    },
    userName: {
      fontWeight: 600,
      fontSize: '0.875rem',
      color: '#5a5c69'
    },
    userRole: {
      fontSize: '0.75rem',
      color: '#858796',
      textTransform: 'capitalize'
    },
    modalHeader: {
      borderBottom: '1px solid #e3e6f0',
      padding: '1.25rem'
    },
    modalTitle: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#5a5c69'
    },
    tabContent: {
      padding: '1.25rem'
    },
    notificationCard: {
      borderLeft: '3px solid',
      borderLeftColor: '#4e73df',
      borderRadius: '0.35rem',
      marginBottom: '1rem',
      boxShadow: '0 0.15rem 0.5rem rgba(0, 0, 0, 0.03)',
      transition: 'all 0.2s'
    },
    notificationCardHover: {
      boxShadow: '0 0.15rem 0.75rem rgba(0, 0, 0, 0.1)'
    },
    dangerCard: {
      borderLeftColor: '#e74a3b'
    },
    warningCard: {
      borderLeftColor: '#f6c23e'
    },
    infoCard: {
      borderLeftColor: '#36b9cc'
    }
  };

  const getNotificationItemStyle = (read: boolean): React.CSSProperties => ({
    padding: '0.75rem 1rem',
    borderLeft: '3px solid transparent',
    transition: 'all 0.2s',
    backgroundColor: read ? '#ffffff' : '#f8f9fc',
    borderLeftColor: read ? 'transparent' : '#4e73df',
    cursor: 'pointer'
  });

  const getNotificationIndicatorStyle = (type: string): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '8px',
    backgroundColor: type === 'warning' ? '#f6c23e' : type === 'danger' ? '#e74a3b' : '#36b9cc'
  });

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Alerte système',
        message: 'Panne critique détectée dans la région centrale. Une intervention immédiate est requise pour résoudre ce problème avant qu\'il n\'affecte plus d\'utilisateurs.',
        date: 'Il y a 10 min',
        read: false,
        type: 'danger'
      },
      {
        id: 2,
        title: 'Maintenance planifiée',
        message: 'Maintenance prévue pour la région nord demain à 02:00. Cette maintenance durera environ 2 heures et pourrait causer des interruptions de service.',
        date: 'Il y a 2h',
        read: false,
        type: 'warning'
      },
      {
        id: 3,
        title: 'Mise à jour équipe',
        message: 'Nouveau technicien assigné à votre département. Mohammed Ali rejoindra votre équipe à partir de lundi prochain.',
        date: 'Il y a 5h',
        read: true,
        type: 'info'
      },
      {
        id: 4,
        title: 'Rapport mensuel',
        message: 'Votre rapport de performance pour le mois dernier est maintenant disponible dans la section rapports.',
        date: 'Hier',
        read: true,
        type: 'info'
      },
      {
        id: 5,
        title: 'Problème réseau',
        message: 'Problème intermittent détecté sur le site de Sousse. Les techniciens ont été alertés et travaillent sur une solution.',
        date: 'Hier',
        read: false,
        type: 'warning'
      }
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const getDisplayRole = () => {
    switch (userRole.toLowerCase()) {
      case 'admin':
        return 'Admin';
      case 'gestionnaire':
        return 'Gestionnaire';
      case 'technicien':
        return 'Technicien';
      default:
        return userRole || 'Utilisateur';
    }
  };

  const handleNotificationClick = (id: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const filteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'alerts':
        return notifications.filter(n => n.type === 'danger' || n.type === 'warning');
      default:
        return notifications;
    }
  };

  const getCardStyle = (type: string) => {
    switch (type) {
      case 'danger':
        return styles.dangerCard;
      case 'warning':
        return styles.warningCard;
      case 'info':
        return styles.infoCard;
      default:
        return {};
    }
  };

  return (
    <>
      <Navbar style={styles.headerNavbar} expand="lg">
        <Container fluid style={{ padding: '0 1.5rem' }}>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            {/* Notifications */}
            <Dropdown show={showNotifications} onToggle={setShowNotifications}>
              <Dropdown.Toggle
                as="div"
                style={styles.notificationToggle}
                aria-label="Notifications"
              >
                <IoNotificationsOutline size={20} />
                {unreadCount > 0 && (
                  <Badge pill bg="danger" style={styles.notificationBadge}>
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu style={styles.notificationDropdown} align="end">
                <div style={styles.notificationHeader}>
                  <h6 style={{ margin: 0, fontWeight: 600 }}>Centre de notifications</h6>
                  <Button
                    variant="link"
                    size="sm"
                    style={{
                      color: '#4e73df',
                      padding: '0',
                      fontWeight: 500,
                      textDecoration: 'none'
                    }}
                    onClick={markAllAsRead}
                  >
                    Tout marquer comme lu
                  </Button>
                </div>

                <ListGroup variant="flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map(notification => (
                      <ListGroup.Item
                        key={notification.id}
                        action
                        style={{
                          ...getNotificationItemStyle(notification.read),
                          backgroundColor:
                            hoveredItemId === notification.id
                              ? '#f1f3f9'
                              : getNotificationItemStyle(notification.read).backgroundColor
                        }}
                        onClick={() => handleNotificationClick(notification.id)}
                        onMouseEnter={() => setHoveredItemId(notification.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                      >
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <div style={getNotificationIndicatorStyle(notification.type)}></div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '4px'
                              }}
                            >
                              <strong style={{ fontSize: '0.875rem' }}>{notification.title}</strong>
                              <small
                                style={{
                                  color: '#6c757d',
                                  fontSize: '0.75rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {notification.date}
                              </small>
                            </div>
                            <p
                              style={{
                                margin: '0',
                                color: '#6c757d',
                                fontSize: '0.8125rem',
                                lineHeight: 1.4
                              }}
                            >
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item
                      style={{
                        textAlign: 'center',
                        padding: '1.5rem',
                        color: '#6c757d',
                        fontSize: '0.875rem'
                      }}
                    >
                      Aucune nouvelle notification
                    </ListGroup.Item>
                  )}
                </ListGroup>

                <div
                  style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    borderTop: '1px solid #e3e6f0',
                    backgroundColor: '#f8f9fc'
                  }}
                >
                  <Button
                    variant="link"
                    size="sm"
                    style={{
                      color: '#4e73df',
                      fontWeight: 500,
                      textDecoration: 'none'
                    }}
                    onClick={() => {
                      setShowNotifications(false);
                      setShowAllNotifications(true);
                    }}
                  >
                    Voir toutes les notifications
                  </Button>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* User info */}
            <div style={styles.userInfo}>
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80"
                alt="Profile"
                style={styles.avatar}
              />
              <div style={styles.userText}>
                <div style={styles.userName}>{userName}</div>
                <div style={styles.userRole}>{getDisplayRole()}</div>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* All Notifications Modal */}
      <Modal
        show={showAllNotifications}
        onHide={() => setShowAllNotifications(false)}
        size="lg"
        centered
      >
        <Modal.Header style={styles.modalHeader}>
          <Modal.Title style={styles.modalTitle}>
            <IoNotificationsOutline size={24} className="me-2" />
            Toutes les notifications
          </Modal.Title>
          <Button
            variant="link"
            onClick={() => setShowAllNotifications(false)}
            style={{ color: '#6c757d', padding: '0.25rem' }}
          >
            <IoClose size={24} />
          </Button>
        </Modal.Header>
        
        <Modal.Body style={{ padding: 0 }}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'all')}
            className="mb-3 px-3"
            fill
          >
            <Tab eventKey="all" title="Toutes">
              <div style={styles.tabContent}>
                {filteredNotifications().length > 0 ? (
                  filteredNotifications().map(notification => (
                    <div
                      key={notification.id}
                      className="card"
                      style={{
                        ...styles.notificationCard,
                        ...getCardStyle(notification.type),
                        ...(hoveredCardId === notification.id ? styles.notificationCardHover : {}),
                        opacity: notification.read ? 0.8 : 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                      onMouseEnter={() => setHoveredCardId(notification.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0" style={{ fontSize: '1rem' }}>
                            {notification.title}
                          </h5>
                          <small className="text-muted">{notification.date}</small>
                        </div>
                        <p className="card-text" style={{ color: '#6c757d' }}>
                          {notification.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className={`badge bg-${notification.type === 'danger' ? 'danger' : notification.type === 'warning' ? 'warning' : 'info'} text-white`}>
                            {notification.type === 'danger' ? 'Urgent' : notification.type === 'warning' ? 'Alerte' : 'Information'}
                          </small>
                          {!notification.read && (
                            <small className="text-primary">Nouveau</small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Aucune notification trouvée</p>
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="unread" title="Non lues">
              <div style={styles.tabContent}>
                {filteredNotifications().length > 0 ? (
                  filteredNotifications().map(notification => (
                    <div
                      key={notification.id}
                      className="card"
                      style={{
                        ...styles.notificationCard,
                        ...getCardStyle(notification.type),
                        ...(hoveredCardId === notification.id ? styles.notificationCardHover : {}),
                        cursor: 'pointer'
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                      onMouseEnter={() => setHoveredCardId(notification.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0" style={{ fontSize: '1rem' }}>
                            {notification.title}
                          </h5>
                          <small className="text-muted">{notification.date}</small>
                        </div>
                        <p className="card-text" style={{ color: '#6c757d' }}>
                          {notification.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className={`badge bg-${notification.type === 'danger' ? 'danger' : notification.type === 'warning' ? 'warning' : 'info'} text-white`}>
                            {notification.type === 'danger' ? 'Urgent' : notification.type === 'warning' ? 'Alerte' : 'Information'}
                          </small>
                          <small className="text-primary">Nouveau</small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Aucune notification non lue</p>
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="alerts" title="Alertes">
              <div style={styles.tabContent}>
                {filteredNotifications().length > 0 ? (
                  filteredNotifications().map(notification => (
                    <div
                      key={notification.id}
                      className="card"
                      style={{
                        ...styles.notificationCard,
                        ...getCardStyle(notification.type),
                        ...(hoveredCardId === notification.id ? styles.notificationCardHover : {}),
                        opacity: notification.read ? 0.8 : 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleNotificationClick(notification.id)}
                      onMouseEnter={() => setHoveredCardId(notification.id)}
                      onMouseLeave={() => setHoveredCardId(null)}
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="card-title mb-0" style={{ fontSize: '1rem' }}>
                            {notification.title}
                          </h5>
                          <small className="text-muted">{notification.date}</small>
                        </div>
                        <p className="card-text" style={{ color: '#6c757d' }}>
                          {notification.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <small className={`badge bg-${notification.type === 'danger' ? 'danger' : 'warning'} text-white`}>
                            {notification.type === 'danger' ? 'Urgent' : 'Alerte'}
                          </small>
                          {!notification.read && (
                            <small className="text-primary">Nouveau</small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">Aucune alerte trouvée</p>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        
        <Modal.Footer className="justify-content-between">
          <Button
            variant="link"
            onClick={markAllAsRead}
            style={{ color: '#4e73df' }}
          >
            Tout marquer comme lu
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowAllNotifications(false)}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;