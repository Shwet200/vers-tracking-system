import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Message, Header, Dropdown } from 'semantic-ui-react';

const roleOptions = [
  { key: 'researcher', text: 'Researcher', value: 'researcher' },
  { key: 'testengineer', text: 'Test Engineer', value: 'testengineer' },
];

console.log('Role options:', roleOptions); //debugging purpose only

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('/api/users/register', { email, password, role });
      setSuccess('Account created successfully');
      setEmail('');
      setPassword('');
      setRole('');
    } catch (error) {
      setError('Error creating account');
    }
  };

  return (
    <Container>
      <Header as='h2' textAlign="center">Sign Up</Header>
      <Form onSubmit={handleSignup}>
        <Form.Field>
          <label>Email</label>
          <input
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Role</label>
          <Dropdown
            placeholder='Select Role'
            fluid
            selection
            options={roleOptions}
            value={role}
            onChange={(e, { value }) => setRole(value)}
          />
        </Form.Field>
        <Button type='submit'>Sign Up</Button>
        {error && <Message negative>{error}</Message>}
        {success && <Message positive>{success}</Message>}
      </Form>
    </Container>
  );
};

export default SignupPage;
