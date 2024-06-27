import React, { useState } from 'react';
import { Container, Divider, Form, Message, Header } from 'semantic-ui-react';
import axios from 'axios';

const activeAreaOptions = [
  { key: '5', text: '5', value: '5' },
  { key: '100', text: '100', value: '100' },
  { key: '600', text: '600', value: '600' },
];

const testTypeOptions = [
  { key: 'Perf(BVT)', text: 'Perf(BVT)', value: 'Perf(BVT)' },
  { key: 'Dev', text: 'Dev', value: 'Dev' },
  { key: 'Durability', text: 'Durability', value: 'Durability' },
  { key: 'Baseline Performance', text: 'Baseline Performance', value: 'Baseline Performance' },
  { key: 'Conductivity Sensitivity', text: 'Conductivity Sensitivity', value: 'Conductivity Sensitivity' },
  { key: 'Temperature Sensitivity', text: 'Temperature Sensitivity', value: 'Temperature Sensitivity' },
  { key: 'Pressure Sensitivity', text: 'Pressure Sensitivity', value: 'Pressure Sensitivity' },
  { key: 'Compression Sensitivity', text: 'Compression Sensitivity', value: 'Compression Sensitivity' },
  { key: 'Accelerated Stress Test', text: 'Accelerated Stress Test', value: 'Accelerated Stress Test' },
];

const projectAreaOptions = [
  { key: 'Stack', text: 'Stack', value: 'Stack' },
  { key: 'MEA', text: 'MEA', value: 'MEA' },
  { key: 'Development', text: 'Development', value: 'Development' },
];

const StackForm = () => {
  const [formData, setFormData] = useState({ owner: '', cellCount: '', activeArea: '', projectArea: '', testType: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '' });
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
      setFormData({ owner: '', cellCount: '', activeArea: '', projectArea: '', testType: '', cathode: '', anode: '', membrane: '', comments: '', purpose: '' });
    } catch (error) {
      setSubmitMessage('Error submitting request');
      console.error('Error:', error.response || error.message); // Add error logging
    }
    setLoading(false);
  };

  return (
    <Container>
      <Divider hidden />
      <Header as='h2' textAlign="center">Build Request Form</Header>
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
            <label>Active Area: </label>
            <Form.Select placeholder='Select active area' name='activeArea' options={activeAreaOptions} onChange={handleDropdownChange} value={formData.activeArea} />
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field>
            <label>Cell Count: </label>
            <Form.Input placeholder='Cell count' name='cellCount' onChange={handleInputChange} value={formData.cellCount} />
          </Form.Field>
          <Form.Field required>
            <label>Project Area: </label>
            <Form.Select placeholder='Select project area' name='projectArea' options={projectAreaOptions} onChange={handleDropdownChange} value={formData.projectArea} />
          </Form.Field>
          <Form.Field required>
            <label>Test Type: </label>
            <Form.Select placeholder='Select your test type' name='testType' options={testTypeOptions} onChange={handleDropdownChange} value={formData.testType} />
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
        <Form.Button content="Submit" color="teal" disabled={!formData.owner || !formData.cellCount || !formData.projectArea || !formData.activeArea || !formData.testType} />
      </Form>
    </Container>
  );
};

export default StackForm;
