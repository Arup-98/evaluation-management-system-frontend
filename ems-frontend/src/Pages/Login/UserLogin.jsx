import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Toast } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserLogin.css';
const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
      });
      const [showSuccessMessage, setShowSuccessMessage] = useState(false);
      const [showErrorMessage, setShowErrorMessage] = useState(false);
    
      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };
      const navigate = useNavigate();
    
      const handleSubmit = (event) => {
        event.preventDefault();
        axios
          .post('http://localhost:8088/user/login', formData)
          .then((response) => {
            setShowSuccessMessage(true); // Show success message
            setShowErrorMessage(false); // Hide error message
            
            navigate('/home'); // Redirect the user to the home page after successful login
          })
          .catch((error) => {
            setShowErrorMessage(true); // Show error message
            setShowSuccessMessage(false); // Hide success message
            // Handle error if login fails
          });
      };
    return (
        <div className='loginPatrent'>
      <Toast
        show={showErrorMessage}
        onClose={() => setShowErrorMessage(false)}
        delay={3000}
        autohide
        bg="danger"
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      >
        <Toast.Header>
          <strong className="mr-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>
          Login Failed. Please check your email and password.
        </Toast.Body>
      </Toast>
            <div className="login">
      <Container className='loginForm'>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <h5 className="text-center mb-4">BJIT Academy</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Button className="loginButton"variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      
    </div>
        </div>
    );
};

export default UserLogin;