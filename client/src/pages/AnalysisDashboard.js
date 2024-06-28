import React, { useState, useEffect } from 'react';
import { Container, Table, Header, Message } from 'semantic-ui-react';
import axios from 'axios';

const AnalysisDashboard = () => {
  const [completedTests, setCompletedTests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        const response = await axios.get('/api/engineer/completed-tests', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setCompletedTests(response.data);
      } catch (error) {
        console.error('Error fetching completed tests:', error);
        setMessage('Error fetching completed tests. Please try again.');
      }
    };

    fetchCompletedTests();
  }, []);

  return (
    <Container fluid>
      <Header as='h2' textAlign="center" className = "h2headers">Completed Tests Analysis</Header>
      {message && <Message negative>{message}</Message>}
      <div style={{ overflowX: 'auto' }}>
        <Table celled compact selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Cell Count</Table.HeaderCell>
              <Table.HeaderCell>Active Area</Table.HeaderCell>
              <Table.HeaderCell>Project Area</Table.HeaderCell>
              <Table.HeaderCell>Test Type</Table.HeaderCell>
              <Table.HeaderCell>Cathode</Table.HeaderCell>
              <Table.HeaderCell>Anode</Table.HeaderCell>
              <Table.HeaderCell>Membrane</Table.HeaderCell>
              <Table.HeaderCell>Request Comments</Table.HeaderCell>
              <Table.HeaderCell>Purpose</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Created At</Table.HeaderCell>
              <Table.HeaderCell>Assigned To</Table.HeaderCell>
              <Table.HeaderCell>Priority</Table.HeaderCell>
              <Table.HeaderCell>Engineer Email</Table.HeaderCell>
              <Table.HeaderCell>Test Completed</Table.HeaderCell>
              <Table.HeaderCell>BoL pH</Table.HeaderCell>
              <Table.HeaderCell>Result Comments</Table.HeaderCell>
              <Table.HeaderCell>Logged At</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {completedTests.map(test => (
              <Table.Row key={test.id}>
                <Table.Cell>{test.id}</Table.Cell>
                <Table.Cell>{test.owner}</Table.Cell>
                <Table.Cell>{test.cellCount}</Table.Cell>
                <Table.Cell>{test.activeArea}</Table.Cell>
                <Table.Cell>{test.projectArea}</Table.Cell>
                <Table.Cell>{test.testType}</Table.Cell>
                <Table.Cell>{test.cathode}</Table.Cell>
                <Table.Cell>{test.anode}</Table.Cell>
                <Table.Cell>{test.membrane}</Table.Cell>
                <Table.Cell>{test.requestComments}</Table.Cell>
                <Table.Cell>{test.purpose}</Table.Cell>
                <Table.Cell>{test.status}</Table.Cell>
                <Table.Cell>{new Date(test.created_at).toLocaleString()}</Table.Cell>
                <Table.Cell>{test.assignedTo}</Table.Cell>
                <Table.Cell>{test.priority ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{test.engineerEmail}</Table.Cell>
                <Table.Cell>{test.testCompleted ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{test.bolPh}</Table.Cell>
                <Table.Cell>{test.resultComments}</Table.Cell>
                <Table.Cell>{new Date(test.loggedAt).toLocaleString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default AnalysisDashboard;
