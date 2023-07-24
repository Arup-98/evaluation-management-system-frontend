import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Task.css'

const ViewTasks = ({ fullName, userId }) => {
  console.log(fullName);
  console.log(userId);
  const { batchId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskSubmissions, setTaskSubmissions] = useState([]);

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

  const handleViewSubmission = (taskId) => {
    setSelectedTaskId(taskId);
    setShowModal(true);

    // Fetch task submissions
    axios
      .get(`http://localhost:8088/tasks/submission/${taskId}`)
      .then((response) => {
        setTaskSubmissions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching task submissions:', error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
                <Button className='taskSubmitButton' variant="success" size="sm">Submit Task</Button>
                <Button variant="primary" size="sm" onClick={() => handleViewSubmission(task.id)}>
                  View Submission
                </Button>
                {/* You can add the "Submit Task" button here */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for displaying submissions */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Task Submissions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Trainee Name</th>
                <th>File Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {taskSubmissions.map((submission, index) => (
                <tr key={submission.submissionId}>
                  <td>{index + 1}</td>
                  <td>{submission.traineeName}</td>
                  <td>{submission.fileName}</td>
                  <td>{formatDate(submission.date)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewTasks;
