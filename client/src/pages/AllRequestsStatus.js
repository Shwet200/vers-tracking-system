import React, { useState, useEffect } from 'react';
import { Table, Container, Header, Icon } from 'semantic-ui-react';
import axios from 'axios';

const AllRequestsStatus = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/researcher/all-requests', {
          headers: { Authorization: `${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Icon name='hourglass half' color='yellow' />;
      case 'rejected':
        return <Icon name='times circle' color='red' />;
      case 'accepted':
        return <Icon name='thumbs up' color='blue' />;
      case 'assigned':
        return <Icon name='tasks' color='orange' />;
      case 'completed':
        return <Icon name='check circle' color='green' />;
      default:
        return <Icon name='question circle' color='grey' />;
    }
  };

  return (
    <Container>
      <Header as='h2' textAlign="center" className= "h2headers">All Requests Status</Header>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Request ID</Table.HeaderCell>
            <Table.HeaderCell>Requester Email</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Priority</Table.HeaderCell>
            <Table.HeaderCell>Assigned To</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {requests.map((request) => (
            <Table.Row key={request.id}>
              <Table.Cell>{request.id}</Table.Cell>
              <Table.Cell>{request.ownerEmail}</Table.Cell>
              <Table.Cell>{getStatusIcon(request.status)} {request.status}</Table.Cell>
              <Table.Cell>{request.status === 'rejected' ? 'N/A' : (request.priority ? 'Yes' : 'No')}</Table.Cell>
              <Table.Cell>{request.status === 'rejected' ? 'N/A' : (request.assignedTo || 'Not yet')}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default AllRequestsStatus;
