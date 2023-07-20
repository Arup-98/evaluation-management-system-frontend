import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const ViewTasks = () => {
  const { batchId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log(batchId);
    const batchNumber = parseInt(batchId);
    console.log(batchNumber);
    axios
      .get(`http://localhost:8088/task/batch/${batchNumber}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [batchId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); // Convert the timestamp to a human-readable date format
  };

  return (
    <Container className='allTaskBody'>
      <h6>Tasks Under Batch</h6>
      <Row xs={1} md={3} className="g-4">
        {tasks.map((task) => (
          <Col key={task.id}>
            <Card>
              <Card.Body>
                <Card.Title>{task.taskName}</Card.Title>
                <Card.Text>
                  <strong>Task Type:</strong> {task.taskType}<br />
                  <strong>Created On:</strong> {formatDate(task.startingDate)}<br />
                  <strong>Deadline:</strong> {formatDate(task.deadline)}<br />
                </Card.Text>
                <Button variant="primary" size="sm">Submit Task</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewTasks;