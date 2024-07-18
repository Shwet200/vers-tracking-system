//
//import React, { useState } from 'react';
//import { Container, Divider, Form, Message, Header } from 'semantic-ui-react';
//import axios from 'axios';
//
//const StackForm = () => {
//  const [formData, setFormData] = useState({ owner: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '' });
//  const [submitMessage, setSubmitMessage] = useState('');
//  const [loading, setLoading] = useState(false);
//
//  const handleInputChange = (e) => {
//    setFormData({ ...formData, [e.target.name]: e.target.value });
//  };
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    setLoading(true);
//    try {
//      const token = localStorage.getItem('token');
//      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user information
//      console.log('Submitting request with user info:', user); // Debug log
//      const response = await axios.post('/api/researcher/test-request', {
//        ...formData,
//        ownerId: user.id, // Include user ID
//        ownerEmail: user.email, // Include user email
//      }, {
//        headers: { Authorization: `${token}` } // Add the token to the request headers
//      });
//      setSubmitMessage(response.data.message);
//      setFormData({ owner: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '' });
//    } catch (error) {
//      setSubmitMessage('Error submitting request');
//      console.error('Error:', error.response || error.message); // Add error logging
//    }
//    setLoading(false);
//  };
//
//  return (
//    <Container>
//      <Divider hidden />
//      <Header as='h2' textAlign="center" className="h2headers">Build Request Form</Header>
//      <Divider section />
//      <Form onSubmit={handleSubmit} loading={loading}>
//        {submitMessage && (
//          <Message
//            negative={submitMessage.includes('Error')}
//            positive={!submitMessage.includes('Error')}
//            header='Form Submitted'
//            content={submitMessage}
//          />
//        )}
//        <Form.Group widths="equal">
//          <Form.Field required>
//            <label>Owner: </label>
//            <Form.Input placeholder='Stack Owner' name='owner' onChange={handleInputChange} value={formData.owner} />
//          </Form.Field>
//        </Form.Group>
//        <Divider section />
//        <Header as='h4'>Additional Info</Header>
//        <Form.Group widths='equal'>
//          <Form.Field>
//            <label>Cathode Part Number: </label>
//            <Form.Input placeholder='Cathode Part Number' name='cathode' onChange={handleInputChange} value={formData.cathode} />
//          </Form.Field>
//          <Form.Field>
//            <label>Anode Part Number: </label>
//            <Form.Input placeholder='Anode Part Number' name='anode' onChange={handleInputChange} value={formData.anode} />
//          </Form.Field>
//          <Form.Field>
//            <label>Membrane Part Number: </label>
//            <Form.Input placeholder='Membrane Part Number' name='membrane' onChange={handleInputChange} value={formData.membrane} />
//          </Form.Field>
//        </Form.Group>
//        <Form.Group widths='equal'>
//          <Form.Field>
//            <label>Purpose of this Stack: </label>
//            <Form.TextArea placeholder='Please enter the purpose of this stack' name='purpose' onChange={handleInputChange} value={formData.purpose} />
//          </Form.Field>
//          <Form.Field>
//            <label>Comments: </label>
//            <Form.TextArea placeholder='Anything important to add?' name='comments' onChange={handleInputChange} value={formData.comments} />
//          </Form.Field>
//        </Form.Group>
//        <Divider hidden />
//        <Form.Button content="Submit" color="teal" disabled={!formData.owner} />
//      </Form>
//    </Container>
//  );
//};
//
//export default StackForm;

import React, { useState } from 'react';
import { Container, Divider, Form, Message, Header } from 'semantic-ui-react';
import axios from 'axios';

const baselineOptions = [
  { key: '2Q2023', text: '2Q2023', value: '2Q2023' },
  { key: '2Q2024', text: '2Q2024', value: '2Q2024' },
  { key: '3Q2024', text: '3Q2024', value: '3Q2024' },
];

const StackForm = () => {
  const [formData, setFormData] = useState({ owner: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '', baseline: '' });
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (e, { name, value }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user information
      console.log('Submitting request with user info:', user); // Debug log
      const response = await axios.post('/api/researcher/test-request', {
        ...formData,
        ownerId: user.id, // Include user ID
        ownerEmail: user.email, // Include user email
      }, {
        headers: { Authorization: `${token}` } // Add the token to the request headers
      });
      setSubmitMessage(response.data.message);
      setFormData({ owner: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '', baseline: '' });
    } catch (error) {
      setSubmitMessage('Error submitting request');
      console.error('Error:', error.response || error.message); // Add error logging
    }
    setLoading(false);
  };

  return (
    <Container>
      <Divider hidden />
      <Header as='h2' textAlign="center" className="h2headers">Build Request Form</Header>
      <Divider section />
      <Form onSubmit={handleSubmit} loading={loading}>
        {submitMessage && (
          <Message
            negative={submitMessage.includes('Error')}
            positive={!submitMessage.includes('Error')}
            header='Form Submitted'
            content={submitMessage}
          />
        )}
        <Form.Group widths="equal">
          <Form.Field required>
            <label>Owner: </label>
            <Form.Input placeholder='Stack Owner' name='owner' onChange={handleInputChange} value={formData.owner} />
          </Form.Field>
          <Form.Field required>
            <label>Baseline: </label>
            <Form.Select placeholder='Select Baseline' name='baseline' options={baselineOptions} onChange={handleDropdownChange} value={formData.baseline} />
          </Form.Field>
        </Form.Group>
        <Divider section />
        <Header as='h4'>Additional Info</Header>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Cathode Part Number: </label>
            <Form.Input placeholder='Cathode Part Number' name='cathode' onChange={handleInputChange} value={formData.cathode} />
          </Form.Field>
          <Form.Field>
            <label>Anode Part Number: </label>
            <Form.Input placeholder='Anode Part Number' name='anode' onChange={handleInputChange} value={formData.anode} />
          </Form.Field>
          <Form.Field>
            <label>Membrane Part Number: </label>
            <Form.Input placeholder='Membrane Part Number' name='membrane' onChange={handleInputChange} value={formData.membrane} />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Purpose of this Stack: </label>
            <Form.TextArea placeholder='Please enter the purpose of this stack' name='purpose' onChange={handleInputChange} value={formData.purpose} />
          </Form.Field>
          <Form.Field>
            <label>Comments: </label>
            <Form.TextArea placeholder='Anything important to add?' name='comments' onChange={handleInputChange} value={formData.comments} />
          </Form.Field>
        </Form.Group>
        <Divider hidden />
        <Form.Button content="Submit" color="teal" disabled={!formData.owner || !formData.baseline} />
      </Form>
    </Container>
  );
};

export default StackForm;
