import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import './SideBar.css';

const SideBar = () => {
    return (
        
             <div className="sidebar">
      <Container>
        <Row className="mb-4">
          <Col>
            <h3></h3>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="primary" block>
              Button 1
            </Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="success" block>
              Button 2
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="warning" block>
              Button 3
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
        
    );
};

export default SideBar;