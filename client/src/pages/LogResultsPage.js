//import React, { useState, useEffect } from 'react';
//import { Container, Form, TextArea, Button, Checkbox, Message, Header } from 'semantic-ui-react';
//import { useParams, useNavigate } from 'react-router-dom';
//import axios from 'axios';
//
//const LogResultsPage = () => {
//  const { testId } = useParams();
//  const [testDetails, setTestDetails] = useState({});
//  const [testCompleted, setTestCompleted] = useState(false);
//  const [bolPh, setBolPh] = useState('');
//  const [comments, setComments] = useState('');
//  const [message, setMessage] = useState('');
//  const navigate = useNavigate();
//
//  useEffect(() => {
//    const fetchTestDetails = async () => {
//      try {
//        const response = await axios.get(`/api/engineer/tests/${testId}`, {
//          headers: { Authorization: localStorage.getItem('token') }
//        });
//        setTestDetails(response.data);
//      } catch (error) {
//        console.error('Error fetching test details:', error);
//        setMessage('Error fetching test details. Please try again.');
//      }
//    };
//
//    fetchTestDetails();
//  }, [testId]);
//
//  const handleSubmit = async () => {
//    try {
//      const response = await axios.post('/api/engineer/log-results', {
//        testRequestId: testId,
//        testCompleted,
//        bolPh,
//        comments
//      }, {
//        headers: { Authorization: localStorage.getItem('token') }
//      });
//      setMessage(response.data.message);
//      setTestCompleted(false);
//      setBolPh('');
//      setComments('');
//      navigate('/dashboard/testengineer');
//    } catch (error) {
//      console.error('Error logging results:', error);
//      setMessage('Error logging results. Please try again.');
//    }
//  };
//
//  return (
//    <Container>
//      <Header as='h2' textAlign="center">Log Test Results for Request ID: {testId}</Header>
//      {message && <Message positive={message.includes('successfully')} negative={!message.includes('successfully')}>{message}</Message>}
//      <Form onSubmit={handleSubmit}>
//        <Form.Field>
//          <label>Test Details</label>
//          <pre>{JSON.stringify(testDetails, null, 2)}</pre>
//        </Form.Field>
//        <Form.Field>
//          <label>Test Completed</label>
//          <Checkbox
//            checked={testCompleted}
//            onChange={() => setTestCompleted(!testCompleted)}
//          />
//        </Form.Field>
//        <Form.Field required>
//          <label>BoL pH</label>
//          <input
//            type="number"
//            value={bolPh}
//            onChange={(e) => setBolPh(e.target.value)}
//            required
//          />
//        </Form.Field>
//        <Form.Field>
//          <label>Comments</label>
//          <TextArea
//            value={comments}
//            onChange={(e) => setComments(e.target.value)}
//          />
//        </Form.Field>
//        <Button type='submit'>Submit Results</Button>
//      </Form>
//    </Container>
//  );
//};
//
//export default LogResultsPage;
import React, { useState, useEffect } from 'react';
import { Container, Form, TextArea, Button, Checkbox, Message, Header } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogResultsPage = () => {
  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [bolPh, setBolPh] = useState('');
  const [comments, setComments] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`/api/engineer/tests/${testId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setTestDetails(response.data);
      } catch (error) {
        console.error('Error fetching test details:', error);
        setMessage('Error fetching test details. Please try again.');
      }
    };

    fetchTestDetails();
  }, [testId]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/engineer/log-results', {
        testRequestId: testId,
        testCompleted,
        bolPh,
        comments
      }, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setMessage(response.data.message);
      setTestCompleted(false);
      setBolPh('');
      setComments('');
      navigate('/dashboard/testengineer');
    } catch (error) {
      console.error('Error logging results:', error);
      setMessage('Error logging results. Please try again.');
    }
  };

  return (
    <Container>
      <Header as='h2' textAlign="center">Log Test Results for Request ID: {testId}</Header>
      {message && <Message positive={message.includes('successfully')} negative={!message.includes('successfully')}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Test Details</label>
          <pre>{JSON.stringify(testDetails, null, 2)}</pre>
        </Form.Field>
        <Form.Field>
          <label>Test Completed</label>
          <Checkbox
            checked={testCompleted}
            onChange={() => setTestCompleted(!testCompleted)}
          />
        </Form.Field>
        <Form.Field required>
          <label>BoL pH</label>
          <input
            type="number"
            value={bolPh}
            onChange={(e) => setBolPh(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Comments</label>
          <TextArea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Form.Field>
        <Button type='submit'>Submit Results</Button>
      </Form>
    </Container>
  );
};

export default LogResultsPage;
