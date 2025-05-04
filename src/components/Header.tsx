import React from 'react';
import { 
  IoNotificationsOutline, IoSettingsOutline, IoHelpCircleOutline 
} from 'react-icons/io5';
import { 
  Navbar, Form, InputGroup, Dropdown, Badge, 
  Container
} from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 px-4 w-100">
      <Container fluid className="px-0">
        
        {/* Admin Profile Section */}
        <div className="ms-auto d-flex align-items-center">
          {/* Icons */}
          <div className="d-flex me-4">
            <button className="btn btn-light position-relative me-2">
              <IoNotificationsOutline size={20} />
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                3
              </Badge>
            </button>
            <button className="btn btn-light me-2">
              <IoSettingsOutline size={20} />
            </button>
            <button className="btn btn-light">
              <IoHelpCircleOutline size={20} />
            </button>
          </div>
          
          {/* Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center">
              <div className="me-2 position-relative">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Admin"
                  className="rounded-circle"
                  style={{ width: "36px", height: "36px", objectFit: "cover" }}
                />
                <span className="position-absolute bottom-0 end-0 p-1 bg-success rounded-circle border border-2 border-white"></span>
              </div>
              <div className="text-start d-none d-lg-block">
                <div className="fw-semibold">Admin User</div>
                <small className="text-muted">Administrator</small>
              </div>
            </Dropdown.Toggle>
            
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.Item href="#">Profile</Dropdown.Item>
              <Dropdown.Item href="#">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;