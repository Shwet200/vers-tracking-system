import React, { useState, useEffect } from 'react';
import { Container, Menu, Table, Button, Dropdown, Form, Header, Message } from 'semantic-ui-react';
import axios from 'axios';
import AnalysisDashboard from './AnalysisDashboard';
import AllRequestsStatus from './AllRequestsStatus';
import DataReviewDashboard from './DataReviewDashboard'; // Import DataReviewDashboard
import '../styles.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('pendingRequests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [priorityTests, setPriorityTests] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const navigate = useNavigate();

const handleItemClick = (e, { name }) => {
    if (name === 'dataReviewDashboard') {
      navigate('/data-review'); // Navigate to DataReviewDashboard page
    } else {
      setActiveItem(name);
    }
  };

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('/api/admin/requests/pending', {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setPendingRequests(response.data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    const fetchAcceptedRequests = async () => {
      try {
        const response = await axios.get('/api/admin/requests/accepted', {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setAcceptedRequests(response.data);
      } catch (error) {
        console.error('Error fetching accepted requests:', error);
      }
    };

    const fetchEngineers = async () => {
      try {
        const response = await axios.get('/api/admin/test-engineers', {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setEngineers(response.data.map(engineer => ({
          key: engineer.email,
          text: engineer.email,
          value: engineer.email
        })));
      } catch (error) {
        console.error('Error fetching test engineers:', error);
      }
    };

    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users/pending', {
          headers: { Authorization: ` ${localStorage.getItem('token')}` }
        });
        setPendingUsers(response.data);
      } catch (error) {
        console.error('Error fetching pending users:', error);
      }
    };

    fetchPendingRequests();
    fetchAcceptedRequests();
    fetchEngineers();
    fetchPendingUsers();
  }, []);

  const handleAssign = async (requestId) => {
    try {
      const priority = priorityTests.includes(requestId) ? 1 : 0;
      const response = await axios.post('/api/admin/requests/assign', { requestId, engineerEmail: selectedEngineer, priority }, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      const fetchAcceptedRequests = async () => {
        try {
          const response = await axios.get('/api/admin/requests/accepted', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setAcceptedRequests(response.data);
        } catch (error) {
          console.error('Error fetching accepted requests:', error);
        }
      };
      fetchAcceptedRequests();
    } catch (error) {
      console.error('Error assigning test:', error);
    }
  };

  const handlePriorityChange = (requestId) => {
    setPriorityTests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId]
    );
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post('/api/admin/requests/accept', { requestId }, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get('/api/admin/requests/pending', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setPendingRequests(response.data);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      };
      fetchPendingRequests();
      const fetchAcceptedRequests = async () => {
        try {
          const response = await axios.get('/api/admin/requests/accepted', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setAcceptedRequests(response.data);
        } catch (error) {
          console.error('Error fetching accepted requests:', error);
        }
      };
      fetchAcceptedRequests();
    } catch (error) {
      console.error('Error accepting test request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post('/api/admin/requests/reject', { requestId }, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      const fetchPendingRequests = async () => {
        try {
          const response = await axios.get('/api/admin/requests/pending', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setPendingRequests(response.data);
        } catch (error) {
          console.error('Error fetching pending requests:', error);
        }
      };
      fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting test request:', error);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      const response = await axios.post('/api/admin/users/approve', { userId }, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      const fetchPendingUsers = async () => {
        try {
          const response = await axios.get('/api/admin/users/pending', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setPendingUsers(response.data);
        } catch (error) {
          console.error('Error fetching pending users:', error);
        }
      };
      fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      const response = await axios.post('/api/admin/users/reject', { userId }, {
        headers: { Authorization: ` ${localStorage.getItem('token')}` }
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(''), 5000);
      const fetchPendingUsers = async () => {
        try {
          const response = await axios.get('/api/admin/users/pending', {
            headers: { Authorization: ` ${localStorage.getItem('token')}` }
          });
          setPendingUsers(response.data);
        } catch (error) {
          console.error('Error fetching pending users:', error);
        }
      };
      fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <Container>
      <Menu pointing className="menu">
        <Menu.Item
          name='pendingRequests'
          active={activeItem === 'pendingRequests'}
          onClick={handleItemClick}
        >
          Pending Test Requests
        </Menu.Item>
        <Menu.Item
          name='assignTests'
          active={activeItem === 'assignTests'}
          onClick={handleItemClick}
        >
          Assign Tests
        </Menu.Item>
        <Menu.Item
          name='analysisDashboard'
          active={activeItem === 'analysisDashboard'}
          onClick={handleItemClick}
        >
          Analysis Dashboard
        </Menu.Item>
        <Menu.Item
          name='allRequestsStatus'
          active={activeItem === 'allRequestsStatus'}
          onClick={handleItemClick}
        >
          All Requests Made
        </Menu.Item>
        <Menu.Item
          name='approveUsers'
          active={activeItem === 'approveUsers'}
          onClick={handleItemClick}
        >
          Approve Users
        </Menu.Item>
        <Menu.Item
          name='dataReviewDashboard'
          active={activeItem === 'dataReviewDashboard'}
          onClick={handleItemClick}
        >
          Data Review Dashboard
        </Menu.Item>
      </Menu>
      {activeItem === 'pendingRequests' && (
        <Container className="container">
          <Header as='h2' textAlign="center" className="h2headers">Pending Test Requests</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Request ID</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Submitted At</Table.HeaderCell>
                <Table.HeaderCell>Details</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pendingRequests.map((request) => (
                <Table.Row key={request.id}>
                  <Table.Cell>{request.id}</Table.Cell>
                  <Table.Cell>{request.owner}</Table.Cell>
                  <Table.Cell>{request.ownerEmail}</Table.Cell>
                  <Table.Cell>{new Date(request.created_at).toLocaleString()}</Table.Cell>
                  <Table.Cell>
                    <pre>{JSON.stringify(request, null, 2)}</pre>
                  </Table.Cell>
                  <Table.Cell>
                    <Button color='green' onClick={() => handleAccept(request.id)}>Accept</Button>
                    <Button color='red' onClick={() => handleReject(request.id)}>Reject</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
      {activeItem === 'assignTests' && (
        <Container className="container">
          <Header as='h2' textAlign="center" className="h2headers">Assign Tests</Header>
          {message && <Message positive>{message}</Message>}
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Request ID</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Assign To</Table.HeaderCell>
                <Table.HeaderCell>Mark as Priority</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {acceptedRequests.map((request) => (
                <Table.Row key={request.id}>
                  <Table.Cell>{request.id}</Table.Cell>
                  <Table.Cell>{request.owner}</Table.Cell>
                  <Table.Cell>{request.ownerEmail}</Table.Cell>
                  <Table.Cell>
                    <Dropdown
                      placeholder='Select Test Engineer'
                      selection
                      options={engineers}
                      onChange={(e, { value }) => setSelectedEngineer(value)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Form.Checkbox
                      checked={priorityTests.includes(request.id)}
                      onChange={() => handlePriorityChange(request.id)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => handleAssign(request.id)}
                      disabled={!selectedEngineer}
                    >
                      Assign
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
      {activeItem === 'analysisDashboard' && <AnalysisDashboard />}
      {activeItem === 'allRequestsStatus' && <AllRequestsStatus />}
      {activeItem === 'approveUsers' && (
        <Container className="container">
          <Header as='h2' textAlign="center" className="h2headers">Approve Users</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>User ID</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {pendingUsers.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.id}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.role}</Table.Cell>
                  <Table.Cell>
                    <Button color='green' onClick={() => handleApproveUser(user.id)}>Approve</Button>
                    <Button color='red' onClick={() => handleRejectUser(user.id)}>Reject</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
      {activeItem === 'dataReviewDashboard' && <DataReviewDashboard />}
    </Container>
  );
};

export default AdminDashboard;
