import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: '280px',
          flexShrink: 0,
          backgroundColor: '#0d6efd', // bootstrap primary
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}
      >
        <Sidebar />
      </div>

      {/* Main content column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0 }}>
          <Header />
        </div>

        {/* Scrollable content area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#f8f9fa', // bootstrap light
            padding: '1.5rem',        // roughly p-4
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
