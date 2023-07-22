import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Dropdown, Table } from 'react-bootstrap';
import "./ShowMarks.css";

const ShowMarks = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [marksData, setMarksData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8088/batch/allBatches')
      .then((response) => {
        setBatches(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      axios
        .get('http://localhost:8088/taskEvaluation/allMarks')
        .then((response) => {
          const filteredMarks = response.data.filter((item) => item.task.batchId === selectedBatch);
          setMarksData(filteredMarks);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedBatch]);

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
  };

  return (
    <Container>
      <h5>Task Marks by Batch</h5>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Select Batch
        </Dropdown.Toggle>
        <div className='marksButton'>
        <Dropdown.Menu >
          {batches.map((batch) => (
            <Dropdown.Item key={batch.id} onClick={() => handleBatchSelect(batch.id)}>
              {batch.batchName}
            </Dropdown.Item>
            
          ))}
        </Dropdown.Menu>
        </div>
      </Dropdown>

      {selectedBatch && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Trainee Name</th>
              <th>Task Type</th>
              <th>Requirement Understanding</th>
              <th>Expected Output</th>
              <th>Code Quality</th>
              <th>Demonstration</th>
              <th>Code Understanding</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {marksData.map((mark) => (
              <tr key={mark.trainee.id}>
                <td>{mark.trainee.fullName}</td>
                <td>{mark.task.taskType}</td>
                <td>{mark.requirementUnderstanding}</td>
                <td>{mark.expectedOutput}</td>
                <td>{mark.codeQuality}</td>
                <td>{mark.demonstration}</td>
                <td>{mark.codeUnderstanding}</td>
                <td>{mark.totalMarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ShowMarks;