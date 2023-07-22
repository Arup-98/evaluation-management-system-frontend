import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Header.css';

import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';

const Header = () => {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary header">
        <Container>
          <Navbar.Brand to="/">EMS</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link href="#"></Link>
              <Nav.Link className='text-black'as={HashLink} to="/traineeRegister">Trainee</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/trainerRegister">Trainer</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/allBatch">All Batch</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/createBatch">Batch Create</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/task">Task Create</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/taskEvaluation">Task Evaluation</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/managerEvaluation">Manager Evaluation</Nav.Link>
              <Nav.Link className='text-black'as={HashLink} to="/CEOEvaluation">CEO Evaluation</Nav.Link>
              {/* <Nav.Link className='text-black'as={HashLink} to="/viewTask">View Task</Nav.Link> */}
            </Nav>
            <Nav>
              <Nav.Link href="#deets">Arup Chakraborty</Nav.Link>
              <NavDropdown title="Admin" id="collasible-nav-dropdown" className='header'>
                <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                  Notification
                </NavDropdown.Item>
                {/* <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
};

export default Header;