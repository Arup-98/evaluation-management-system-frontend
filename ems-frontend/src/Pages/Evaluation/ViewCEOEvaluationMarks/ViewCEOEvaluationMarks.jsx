import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Form } from 'react-bootstrap';

const ViewCEOEvaluationMarks = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchData, setBatchData] = useState([]);
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    // Make an API call to fetch all batches
    axios.get('http://localhost:8088/batch/allBatches')
      .then((response) => {
        setBatchData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleBatchChange = (event) => {
    const batchId = event.target.value;
    const selectedBatch = batchData.find((batch) => batch.id === parseInt(batchId));
    setSelectedBatch(selectedBatch);

    // Make an API call to fetch all marks for the selected batch
    axios.get(`http://localhost:8088/CEOEvaluation/allMarks`)
      .then((response) => {
        const marksForBatch = response.data.filter((mark) => mark.trainee.id === parseInt(batchId));
        setMarksData(marksForBatch);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container>
      <h5>View Marks by Batch</h5>
      <Form>
        <Form.Group controlId="batchSelect">
          <Form.Label>Select Batch:</Form.Label>
          <Form.Control as="select" onChange={handleBatchChange} value={selectedBatch?.id || ''}>
            <option value="">Select Batch</option>
            {batchData.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batchName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>
      {selectedBatch && (
        <div>
          <h5>Trainee Marks for Batch: {selectedBatch.batchName}</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trainee Name</th>
                <th>Aptitude Test Score</th>
                <th>HR Interview Score</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((mark) => (
                <tr key={mark.id}>
                  <td>{mark.trainee.fullName}</td>
                  <td>{mark.aptitudeTest}</td>
                  <td>{mark.hrInterview}</td>
                  <td>{mark.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default ViewCEOEvaluationMarks;