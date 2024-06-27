import React, { useState } from 'react';
import { Container, Menu, Header } from 'semantic-ui-react';
import StackForm from './StackForm';
import AnalysisDashboard from './AnalysisDashboard';
import RequestStatus from './RequestStatus';
import AllRequestsStatus from './AllRequestsStatus'; // Import new component

const ResearcherDashboard = () => {
  const [activeItem, setActiveItem] = useState('testRequestForm');

  const handleItemClick = (e, { name }) => setActiveItem(name);

  return (
    <Container>
      <Menu pointing>
        <Menu.Item
          name='testRequestForm'
          active={activeItem === 'testRequestForm'}
          onClick={handleItemClick}
        >
          Test Request Form
        </Menu.Item>
        <Menu.Item
          name='analysisDashboard'
          active={activeItem === 'analysisDashboard'}
          onClick={handleItemClick}
        >
          Analysis Dashboard
        </Menu.Item>
        <Menu.Item
          name='requestStatus'
          active={activeItem === 'requestStatus'}
          onClick={handleItemClick}
        >
          Your Request Status
        </Menu.Item>
        <Menu.Item
          name='allRequestsStatus'
          active={activeItem === 'allRequestsStatus'}
          onClick={handleItemClick}
        >
          All Requests Made
        </Menu.Item>
      </Menu>
      {activeItem === 'testRequestForm' && (
        <Container>
          <StackForm />
        </Container>
      )}
      {activeItem === 'analysisDashboard' && <AnalysisDashboard />}
      {activeItem === 'requestStatus' && <RequestStatus />}
      {activeItem === 'allRequestsStatus' && <AllRequestsStatus />}
    </Container>
  );
};

export default ResearcherDashboard;
