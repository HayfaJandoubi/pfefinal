import React from 'react'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  FiWifi, FiAlertCircle, FiCheckCircle, FiUser, FiTool 
} from 'react-icons/fi';
import { Card, Row, Col, Container, Table, Badge } from 'react-bootstrap';

// Sample data for mobile sites
const mobileSitesData = [
  { name: 'Jan', active: 120, down: 5 },
  { name: 'Feb', active: 125, down: 3 },
  { name: 'Mar', active: 130, down: 8 },
  { name: 'Apr', active: 135, down: 2 },
  { name: 'May', active: 140, down: 6 },
  { name: 'Jun', active: 145, down: 4 },
  { name: 'Jul', active: 150, down: 1 },
];

const siteStatusData = [
  { name: 'Active', value: 145 },
  { name: 'Down', value: 5 },
];

const COLORS = ['#4ADE80', '#F87171'];

// Sample alerts data
const recentAlerts = [
  { id: 1, site: 'Site A', type: 'Power Failure', status: 'Critical', time: '10 min ago' },
  { id: 2, site: 'Site B', type: 'Connectivity Loss', status: 'Warning', time: '25 min ago' },
  { id: 3, site: 'Site C', type: 'Hardware Fault', status: 'Critical', time: '1 hour ago' },
  { id: 4, site: 'Site D', type: 'Maintenance', status: 'Info', time: '2 hours ago' },
];

// Sample managers and technicians
const managers = [
  { id: 1, name: 'Mohamed Ali', email: 'm.ali@example.com', sites: 12 },
  { id: 2, name: 'Fatma Ben Salah', email: 'f.bensalah@example.com', sites: 8 },
  { id: 3, name: 'Ahmed Khemiri', email: 'a.khemiri@example.com', sites: 15 },
];

const technicians = [
  { id: 1, name: 'Samir Trabelsi', email: 's.trabelsi@example.com', skills: '5G, Fiber' },
  { id: 2, name: 'Leila Boukadi', email: 'l.boukadi@example.com', skills: 'Microwave, Power' },
  { id: 3, name: 'Karim Hammami', email: 'k.hammami@example.com', skills: 'Antennas, RF' },
];

const Dashboard: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiWifi className="text-primary" size={24} />}
            title="Total Mobile Sites"
            value="150"
            change="+5%"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiCheckCircle className="text-success" size={24} />}
            title="Active Sites"
            value="145"
            change="+3%"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiAlertCircle className="text-warning" size={24} />}
            title="Sites Down"
            value="5"
            change="-2%"
            isPositive={false}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiAlertCircle className="text-danger" size={24} />}
            title="Critical Alerts"
            value="2"
            change="+1"
            isPositive={false}
          />
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row className="mb-4">
        <Col lg={6} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Mobile Sites Status</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mobileSitesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" fill="#4ADE80" name="Active Sites" />
                    <Bar dataKey="down" fill="#F87171" name="Down Sites" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Sites Status Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={siteStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {siteStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row>
        <Col lg={4} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Recent Alerts</Card.Title>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map(alert => (
                    <tr key={alert.id}>
                      <td>{alert.site}</td>
                      <td>{alert.type}</td>
                      <td>
                        <Badge 
                          bg={
                            alert.status === 'Critical' ? 'danger' : 
                            alert.status === 'Warning' ? 'warning' : 'info'
                          }
                        >
                          {alert.status}
                        </Badge>
                      </td>
                      <td>{alert.time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Gestionnaires</Card.Title>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Sites</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map(manager => (
                    <tr key={manager.id}>
                      <td>{manager.name}</td>
                      <td>{manager.email}</td>
                      <td>{manager.sites}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Techniciens</Card.Title>
              <Table striped hover size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map(tech => (
                    <tr key={tech.id}>
                      <td>{tech.name}</td>
                      <td>{tech.email}</td>
                      <td>{tech.skills}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Stat Card Component with Bootstrap
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, change, isPositive }) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="text-muted mb-2">{title}</h6>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className="p-2 rounded bg-light">
            {icon}
          </div>
        </div>
        <p className={`mb-0 mt-3 ${isPositive ? 'text-success' : 'text-danger'}`}>
          <small>{change} from last month</small>
        </p>
      </Card.Body>
    </Card>
  );
};

export default Dashboard;