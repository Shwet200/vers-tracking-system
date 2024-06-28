import React, { useState, useEffect } from 'react';
import { Container, Menu, Table, Header, Message, Button } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AnalysisDashboard from './AnalysisDashboard';
import AllRequestsStatus from './AllRequestsStatus'; // Import new component

const TestEngineerDashboard = () => {
  const [activeItem, setActiveItem] = useState('assignedTests');
  const [assignedTests, setAssignedTests] = useState([]);
  const [priorityTests, setPriorityTests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleItemClick = (e, { name }) => setActiveItem(name);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/engineer/tests', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        const tests = response.data;
        const assigned = tests.filter(test => test.priority === 0);
        const priority = tests.filter(test => test.priority === 1);
        setAssignedTests(assigned);
        setPriorityTests(priority);
      } catch (error) {
        console.error('Error fetching tests:', error);
        setMessage('Error fetching tests. Please try again.');
      }
    };

    fetchTests();
  }, []);

  const handleLogResults = (testId) => {
    navigate(`/log-results/${testId}`);
  };

  return (
    <Container>
      <Menu pointing>
        <Menu.Item
          name='assignedTests'
          active={activeItem === 'assignedTests'}
          onClick={handleItemClick}
        >
          Tests Assigned
        </Menu.Item>
        <Menu.Item
          name='priorityTests'
          active={activeItem === 'priorityTests'}
          onClick={handleItemClick}
        >
          Priority Tests
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
      </Menu>
      {message && <Message positive={message.includes('successfully')} negative={!message.includes('successfully')}>{message}</Message>}
      {activeItem === 'assignedTests' && (
        <Container>
          <Header as='h2' textAlign="center" className= "h2headers">Tests Assigned to You</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Request ID</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Details</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {assignedTests.map((test) => (
                <Table.Row key={test.id}>
                  <Table.Cell>{test.id}</Table.Cell>
                  <Table.Cell>{test.owner}</Table.Cell>
                  <Table.Cell>{test.email}</Table.Cell>
                  <Table.Cell>
                    <pre>{JSON.stringify(test, null, 2)}</pre>
                  </Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => handleLogResults(test.id)}>Log Results</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
      {activeItem === 'priorityTests' && (
        <Container>
          <Header as='h2' textAlign="center" className= "h2headers">Priority Tests</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Request ID</Table.HeaderCell>
                <Table.HeaderCell>Owner</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Details</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {priorityTests.map((test) => (
                <Table.Row key={test.id}>
                  <Table.Cell>{test.id}</Table.Cell>
                  <Table.Cell>{test.owner}</Table.Cell>
                  <Table.Cell>{test.email}</Table.Cell>
                  <Table.Cell>
                    <pre>{JSON.stringify(test, null, 2)}</pre>
                  </Table.Cell>
                  <Table.Cell>
                    <Button onClick={() => handleLogResults(test.id)}>Log Results</Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Container>
      )}
      {activeItem === 'analysisDashboard' && <AnalysisDashboard />}
      {activeItem === 'allRequestsStatus' && <AllRequestsStatus />}
    </Container>
  );
};

export default TestEngineerDashboard;
