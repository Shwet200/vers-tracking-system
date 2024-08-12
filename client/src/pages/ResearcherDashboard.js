import React, { useState } from 'react';
import { Container, Menu } from 'semantic-ui-react';
import StackForm from './StackForm';
import AnalysisDashboard from './AnalysisDashboard';
import RequestStatus from './RequestStatus';
import AllRequestsStatus from './AllRequestsStatus';
import DataReviewDashboard from './DataReviewDashboard'; // Import DataReviewDashboard
import { useNavigate } from 'react-router-dom';

const ResearcherDashboard = () => {
  const [activeItem, setActiveItem] = useState('testRequestForm');
  const navigate = useNavigate();

const handleItemClick = (e, { name }) => {
    if (name === 'dataReviewDashboard') {
      navigate('/data-review'); // Navigate to DataReviewDashboard page
    } else {
      setActiveItem(name);
    }
  };

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
        <Menu.Item
          name='dataReviewDashboard'
          active={activeItem === 'dataReviewDashboard'}
          onClick={handleItemClick}
        >
          Data Review Dashboard
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
      {activeItem === 'dataReviewDashboard' && <DataReviewDashboard />}
    </Container>
  );
};

export default ResearcherDashboard;
