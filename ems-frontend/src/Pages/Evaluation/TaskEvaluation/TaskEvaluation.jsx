import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Form, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const TaskEvaluation = () => {
  const { batchId } = useParams();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskEvaluations, setTaskEvaluations] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [traineesLoaded, setTraineesLoaded] = useState(false);

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
    if (batchId) {
      axios
        .get(`http://localhost:8088/batch/${batchId}`)
        .then((response) => {
          setSelectedBatch(response.data);

          if (response.data) {
            setTrainees(response.data.trainees || []);
            setTraineesLoaded(true);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      axios
        .get(`http://localhost:8088/task/batch/${batchId}`)
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [batchId]);

  const handleTaskChange = (traineeId, field, value) => {
    setTaskEvaluations((prevEvaluations) => {
      const existingEvaluation = prevEvaluations.find((te) => te.traineeId === traineeId);

      if (existingEvaluation) {
        return prevEvaluations.map((te) =>
          te.traineeId === traineeId ? { ...te, [field]: value } : te
        );
      } else {
        return [
          ...prevEvaluations,
          {
            traineeId,
            [field]: value,
          },
        ];
      }
    });
  };

  const handleTaskSubmit = (traineeId) => {
    const taskEvaluation = taskEvaluations.find((te) => te.traineeId === traineeId);
    if (
      !taskEvaluation ||
      !taskEvaluation.taskId ||
      !taskEvaluation.taskType ||
      !isValidNumber(taskEvaluation.requirementUnderstanding) ||
      !isValidNumber(taskEvaluation.expectedOutput) ||
      !isValidNumber(taskEvaluation.codeQuality) ||
      !isValidNumber(taskEvaluation.demonstration) ||
      !isValidNumber(taskEvaluation.codeUnderstanding)
    ) {
      return;
    }

    axios
      .post('http://localhost:8088/taskEvaluation/upload', taskEvaluation)
      .then((response) => {
        setShowSuccessMessage(true);
        setTaskEvaluations((prevEvaluations) =>
          prevEvaluations.filter((te) => te.traineeId !== traineeId)
        );
      })
      .catch((error) => {
        console.error(error);
        setShowSuccessMessage(false);
      });
  };

  // Function to validate decimal or fractional numbers
  const isValidNumber = (value) => {
    const numberPattern = /^\d+(\.\d+)?$/; // Allows digits and an optional decimal point
    return numberPattern.test(value);
  };

  return (
    <Container>
      <h4>Select Batch:</h4>
      <Form.Select
        value={batchId}
        onChange={(e) => {
          const selectedBatchId = e.target.value;
          window.location.href = `/taskEvaluation/${selectedBatchId}`;
        }}
      >
        <option value="">Select Batch</option>
        {batches.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.batchName}
          </option>
        ))}
      </Form.Select>
      <h4>Batch: {selectedBatch?.batchName}</h4>
      {showSuccessMessage && <Alert variant="success">Tasks submitted successfully!</Alert>}
      {traineesLoaded ? (
        <Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Trainee Name</th>
                <th>Task Name</th>
                <th>Task Type</th>
                <th>Requirement Understanding</th>
                <th>Expected Output</th>
                <th>Code Quality</th>
                <th>Demonstration</th>
                <th>Code Understanding</th>
                <th>Submit</th>
              </tr>
            </thead>
            <tbody>
              {trainees.map((trainee) => (
                <tr key={trainee.id}>
                  <td>{trainee.fullName}</td>
                  <td>
                    <Form.Select
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.taskId || ''
                      }
                      onChange={(e) =>
                        handleTaskChange(
                          trainee.id,
                          'taskId',
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Task</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.taskName}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Select
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.taskType || ''
                      }
                      onChange={(e) =>
                        handleTaskChange(trainee.id, 'taskType', e.target.value)
                      }
                    >
                      <option value="">Select Task Type</option>
                      <option value="Daily Task">Daily Task</option>
                      <option value="Mini Project">Mini Project</option>
                      <option value="Mid Project">Mid Project</option>
                      <option value="Final Project">Final Project</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Control
                      type="text" // Use text input instead of number
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.requirementUnderstanding || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isValidNumber(value)) {
                          handleTaskChange(
                            trainee.id,
                            'requirementUnderstanding',
                            value
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text" // Use text input instead of number
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.expectedOutput || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isValidNumber(value)) {
                          handleTaskChange(
                            trainee.id,
                            'expectedOutput',
                            value
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text" // Use text input instead of number
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.codeQuality || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isValidNumber(value)) {
                          handleTaskChange(
                            trainee.id,
                            'codeQuality',
                            value
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text" // Use text input instead of number
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.demonstration || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isValidNumber(value)) {
                          handleTaskChange(
                            trainee.id,
                            'demonstration',
                            value
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text" // Use text input instead of number
                      value={
                        taskEvaluations.find((te) => te.traineeId === trainee.id)?.codeUnderstanding || ''
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isValidNumber(value)) {
                          handleTaskChange(
                            trainee.id,
                            'codeUnderstanding',
                            value
                          );
                        }
                      }}
                    />
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleTaskSubmit(trainee.id)}
                      disabled={
                        !taskEvaluations.find((te) => te.traineeId === trainee.id)?.taskId ||
                        !taskEvaluations.find((te) => te.traineeId === trainee.id)?.taskType ||
                        !isValidNumber(taskEvaluations.find((te) => te.traineeId === trainee.id)?.requirementUnderstanding) ||
                        !isValidNumber(taskEvaluations.find((te) => te.traineeId === trainee.id)?.expectedOutput) ||
                        !isValidNumber(taskEvaluations.find((te) => te.traineeId === trainee.id)?.codeQuality) ||
                        !isValidNumber(taskEvaluations.find((te) => te.traineeId === trainee.id)?.demonstration) ||
                        !isValidNumber(taskEvaluations.find((te) => te.traineeId === trainee.id)?.codeUnderstanding)
                      }
                    >
                      Submit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Form>
      ) : (
        <p>Loading trainees...</p>
      )}
    </Container>
  );
};

export default TaskEvaluation;
