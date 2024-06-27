import React, { useState } from 'react';
import { Button, Form, Message, Container, Header, Divider } from 'semantic-ui-react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      setMessage('Login successful');

      // Redirect based on role
      if (response.data.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (response.data.role === 'researcher') {
        window.location.href = '/dashboard/researcher';
      } else if (response.data.role === 'testengineer') {
        window.location.href = '/dashboard/testengineer';
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', { email, password, role });
      setMessage('Thank you for registering. Admin will review your request shortly.');
      setIsRegister(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <Container className="form-container">
      <Header as='h2' textAlign="center">{isRegister ? 'Create Account' : 'Login'}</Header>
      {message && <Message>{message}</Message>}
      <Form onSubmit={isRegister ? handleSignup : handleLogin}>
        <Form.Field>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Field>
        {isRegister && (
          <Form.Field>
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="researcher">Researcher</option>
              <option value="testengineer">Test Engineer</option>
            </select>
          </Form.Field>
        )}
        <Button type="submit" color={isRegister ? "green" : "blue"}>
          {isRegister ? 'Sign Up' : 'Login'}
        </Button>
      </Form>
      <Divider />
      <Button onClick={() => setIsRegister(!isRegister)} color="grey" fluid>
        {isRegister ? 'Back to Login' : 'Don\'t have an account? Create one here.'}
      </Button>
    </Container>
  );
};

export default LoginPage;
