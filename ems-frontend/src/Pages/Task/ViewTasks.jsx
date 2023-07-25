import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Table, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './Task.css';

const ViewTasks = ({ fullName, traineeId,role }) => {
  const { batchId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    const batchNumber = parseInt(batchId);
    axios
      .get(`http://localhost:8088/task/batch/${batchNumber}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [batchId]);

  const handleViewSubmission = (taskId) => {
    setSelectedTaskId(taskId);
    setShowViewModal(true);

    axios
      .get(`http://localhost:8088/tasks/submission/${taskId}`)
      .then((response) => {
        setTaskSubmissions(response.data);
      })
      .catch((error) => {
        console.error('Error fetching task submissions:', error);
      });
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
  };

  const handleTaskSubmission = (taskId) => {
    setSelectedTaskId(taskId);
    setShowSubmitModal(true);
  };

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedTask(null); // Reset the selected task after the modal is closed
    setSubmitSuccess(false); // Reset the success message state
    setSubmitError(false); // Reset the error message state
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();

    const { date, filename,role } = selectedTask;
    

    const taskSubmission = {
      traineeId,
      date,
      filename,
      role,
      taskId: selectedTaskId,
    };

    axios
      .post(`http://localhost:8088/tasks/submit/${parseInt(selectedTaskId)}`, taskSubmission)
      .then((response) => {
        console.log('Task submitted successfully!', response);
        setSubmitSuccess(true); // Set the success message state to true
        setTimeout(() => {
          setShowSubmitModal(false);
          setSelectedTask(null); // Reset the selected task after the modal is closed
          setSubmitSuccess(false); // Reset the success message state after 3 seconds
        }, 3000);
      })
      .catch((error) => {
        console.error('Error submitting task:', error);
        setSubmitError(true); // Set the error message state to true
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <Container className='allTaskBody'>
      <h6>Tasks Under Batch</h6>
      <Row xs={1} md={3} className='g-4'>
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
                {role !=='Admin' &&(
                <Button className='taskSubmitButton' variant='success' size='sm' onClick={() => handleTaskSubmission(task.id)}>Submit Task</Button>
                )}
                {role !== 'Trainee' && (
                  <Button variant='primary' size='sm' onClick={() => handleViewSubmission(task.id)}>View Submission</Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for submitting the task */}
      <Modal show={showSubmitModal} onHide={handleCloseSubmitModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitError && (
            <Alert variant='danger'>Error submitting task. Please try again later.</Alert>
          )}
          <Form onSubmit={handleTaskSubmit}>
            <Form.Group controlId='traineeName'>
              <Form.Label>Trainee Name</Form.Label>
              <Form.Control type='text' value={fullName} disabled />
            </Form.Group>
            <Form.Group controlId='date'>
              <Form.Label>Date</Form.Label>
              <Form.Control type='date' onChange={(e) => setSelectedTask({ ...selectedTask, date: e.target.value })} required />
            </Form.Group>
            <Form.Group controlId='filename'>
              <Form.Label>File Name</Form.Label>
              <Form.Control type='text' onChange={(e) => setSelectedTask({ ...selectedTask, filename: e.target.value })} required />
            </Form.Group>
            
            <Button type='submit'>Submit Task</Button>
          
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for displaying task submissions */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
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
          <Button variant='secondary' onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewTasks;
