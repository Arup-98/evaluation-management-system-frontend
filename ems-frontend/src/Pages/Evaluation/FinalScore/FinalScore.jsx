import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Form, Button, Alert, Container } from 'react-bootstrap';
import './FinalScore.css';

const FinalScoreCreate = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [scores, setScores] = useState({
    dailyTask: '',
    miniProject: '',
    midProject: '',
    finalProject: '',
    managerEvaluation: '',
    CEOEvaluation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the list of all batches from the API
    axios
      .get('http://localhost:8088/batch/allBatches')
      .then((response) => {
        setBatches(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBatchChange = (batchId) => {
    setSelectedBatch(batchId);
  };

  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setScores((prevScores) => ({
      ...prevScores,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Convert the scores to numbers (floats) before making the API call
    const parsedScores = {
      dailyTask: parseFloat(scores.dailyTask),
      miniProject: parseFloat(scores.miniProject),
      midProject: parseFloat(scores.midProject),
      finalProject: parseFloat(scores.finalProject),
      managerEvaluation: parseFloat(scores.managerEvaluation),
      CEOEvaluation: parseFloat(scores.CEOEvaluation),
    };

    // Make the API call to create the total final score using the selected batchId and scores
    const apiUrl = `http://localhost:8088/final/create/${selectedBatch}`;
    axios
      .post(apiUrl, parsedScores)
      .then((response) => {
        setIsLoading(false);
        setSuccessMessage('Total final score created successfully!');
        setErrorMessage('');
        // Reset input fields after successful submission
        setScores({
          dailyTask: '',
          miniProject: '',
          midProject: '',
          finalProject: '',
          managerEvaluation: '',
          CEOEvaluation: '',
        });
        setSelectedBatch(''); // Reset the selected batch after submission
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      })
      .catch((error) => {
        setIsLoading(false);
        setSuccessMessage('');
        setErrorMessage('Error creating total final score.');
        console.error('Error creating total final score:', error);
        // Hide error message after 3 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  };

  return (
    <div>
      <Container>
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="batch-dropdown">
            {selectedBatch ? `Batch ID: ${selectedBatch}` : 'Select Batch'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {batches.map((batch) => (
              <Dropdown.Item key={batch.id} onClick={() => handleBatchChange(batch.id)}>
                {batch.batchName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        {selectedBatch && (
          <Form className='finalScoreForm'>
            <Form.Group controlId="dailyTask">
              <Form.Label>Daily Task</Form.Label>
              <Form.Control type="text" name="dailyTask" value={scores.dailyTask} onChange={handleScoreChange} />
            </Form.Group>
            <Form.Group controlId="miniProject">
              <Form.Label>Mini Project</Form.Label>
              <Form.Control type="text" name="miniProject" value={scores.miniProject} onChange={handleScoreChange} />
            </Form.Group>
            <Form.Group controlId="midProject">
              <Form.Label>Mid Project</Form.Label>
              <Form.Control type="text" name="midProject" value={scores.midProject} onChange={handleScoreChange} />
            </Form.Group>
            <Form.Group controlId="finalProject">
              <Form.Label>Final Project</Form.Label>
              <Form.Control type="text" name="finalProject" value={scores.finalProject} onChange={handleScoreChange} />
            </Form.Group>
            <Form.Group controlId="managerEvaluation">
              <Form.Label>Manager Evaluation</Form.Label>
              <Form.Control type="text" name="managerEvaluation" value={scores.managerEvaluation} onChange={handleScoreChange} />
            </Form.Group>
            <Form.Group controlId="CEOEvaluation">
              <Form.Label>CEO Evaluation</Form.Label>
              <Form.Control type="text" name="CEOEvaluation" value={scores.CEOEvaluation} onChange={handleScoreChange} />
            </Form.Group>
            <Button className='finalScoreButton' variant="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </Form>
        )}

        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      </Container>
    </div>
  );
};

export default FinalScoreCreate;
