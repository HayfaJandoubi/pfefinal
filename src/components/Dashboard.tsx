import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  FiUsers, FiWifi, FiPhone, FiActivity, FiAlertCircle, FiCheckCircle 
} from 'react-icons/fi';
import { Card, Row, Col, Container } from 'react-bootstrap';

// Sample data for charts (same as before)
const monthlyData = [
  { name: 'Jan', incidents: 4000, resolved: 2400, newCustomers: 2400 },
  { name: 'Feb', incidents: 3000, resolved: 1398, newCustomers: 2210 },
  { name: 'Mar', incidents: 2000, resolved: 9800, newCustomers: 2290 },
  { name: 'Apr', incidents: 2780, resolved: 3908, newCustomers: 2000 },
  { name: 'May', incidents: 1890, resolved: 4800, newCustomers: 2181 },
  { name: 'Jun', incidents: 2390, resolved: 3800, newCustomers: 2500 },
  { name: 'Jul', incidents: 3490, resolved: 4300, newCustomers: 2100 },
];

const serviceDistribution = [
  { name: 'Mobile', value: 400 },
  { name: 'Internet', value: 300 },
  { name: 'Landline', value: 300 },
  { name: 'TV', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const performanceData = [
  { name: 'Jan', responseTime: 2.5, satisfaction: 4.2 },
  { name: 'Feb', responseTime: 2.3, satisfaction: 4.3 },
  { name: 'Mar', responseTime: 2.0, satisfaction: 4.5 },
  { name: 'Apr', responseTime: 1.8, satisfaction: 4.6 },
  { name: 'May', responseTime: 1.5, satisfaction: 4.7 },
  { name: 'Jun', responseTime: 1.4, satisfaction: 4.8 },
  { name: 'Jul', responseTime: 1.2, satisfaction: 4.9 },
];

const Dashboard: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <h1 className="mb-4">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiUsers className="text-primary" size={24} />}
            title="Total Customers"
            value="1,248"
            change="+12%"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiWifi className="text-success" size={24} />}
            title="Active Services"
            value="3,742"
            change="+5%"
            isPositive={true}
          />
        </Col>
        <Col md={6} lg={3} className="mb-3 mb-lg-0">
          <StatCard 
            icon={<FiActivity className="text-warning" size={24} />}
            title="Network Incidents"
            value="48"
            change="-8%"
            isPositive={false}
          />
        </Col>
        <Col md={6} lg={3}>
          <StatCard 
            icon={<FiPhone className="text-info" size={24} />}
            title="Support Tickets"
            value="126"
            change="+3%"
            isPositive={false}
          />
        </Col>
      </Row>

      {/* Main Charts Row */}
      <Row className="mb-4">
        <Col lg={4} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Monthly Incidents & Resolutions</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incidents" fill="#F87171" name="Incidents" />
                    <Bar dataKey="resolved" fill="#4ADE80" name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Service Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {serviceDistribution.map((entry, index) => (
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
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Performance Metrics</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="responseTime" stroke="#8884d8" name="Response Time (hrs)" />
                    <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#82ca9d" name="Satisfaction (1-5)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row>
        <Col lg={6} className="mb-3 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <div className="activity-feed">
                <ActivityItem 
                  icon={<FiCheckCircle className="text-success" />}
                  title="Network upgrade completed"
                  time="2 hours ago"
                  description="Zone 4 network infrastructure upgraded to 5G"
                />
                <ActivityItem 
                  icon={<FiAlertCircle className="text-warning" />}
                  title="Service interruption"
                  time="5 hours ago"
                  description="Reported outage in downtown area"
                />
                <ActivityItem 
                  icon={<FiCheckCircle className="text-success" />}
                  title="Maintenance scheduled"
                  time="1 day ago"
                  description="Planned maintenance for tomorrow night"
                />
                <ActivityItem 
                  icon={<FiCheckCircle className="text-success" />}
                  title="New customer portal"
                  time="2 days ago"
                  description="Launched new self-service customer portal"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Network Status</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="newCustomers" stackId="1" stroke="#8884d8" fill="#8884d8" name="New Customers" />
                    <Area type="monotone" dataKey="resolved" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Resolved Issues" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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

// Activity Item Component with Bootstrap
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  time: string;
  description: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon, title, time, description }) => {
  return (
    <div className="d-flex mb-3">
      <div className="me-3 mt-1">
        {icon}
      </div>
      <div>
        <div className="d-flex align-items-center">
          <h6 className="mb-0 me-2">{title}</h6>
          <small className="text-muted">{time}</small>
        </div>
        <p className="text-muted mb-0"><small>{description}</small></p>
      </div>
    </div>
  );
};

export default Dashboard;