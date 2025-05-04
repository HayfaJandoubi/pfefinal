import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-auto bg-primary text-white p-0" style={{ width: '280px' }}>
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="col d-flex flex-column h-100 p-0">
          {/* Header */}
          <div className="bg-white shadow-sm">
            <Header />
          </div>

          {/* Content */}
          <div className="flex-grow-1 overflow-auto p-4 bg-light">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
