import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Button, Modal, Table } from 'react-bootstrap';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import ViewTasks from '../../Task/ViewTasks';
import './Batch.css';

const Batch = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainees, setSelectedTrainees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8088/batch/allBatches`)
      .then((response) => {
        const selectedBatch = response.data.find((b) => b.id === parseInt(batchId));
        setBatch(selectedBatch);

        if (selectedBatch) {
          setTrainees(selectedBatch.trainees || []);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [batchId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const batchIdNumber = parseInt(batchId);
    axios
      .post(`http://localhost:8088/trainee/assign/batch/${batchIdNumber}`, selectedTrainees.map(Number))
      .then((response) => {
        setShowModal(false);
        setSelectedTrainees([]);
        setTrainees(trainees.filter((trainee) => !selectedTrainees.includes(trainee.id)));
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleTraineeSelection = (traineeId) => {
    if (selectedTrainees.includes(traineeId)) {
      setSelectedTrainees(selectedTrainees.filter((id) => id !== traineeId));
    } else {
      setSelectedTrainees([...selectedTrainees, traineeId]);
    }
  };

  return (
    <div>
      <Container>
        {batch && (
          <>
          <div className='assignTraineeButton'>
            <Button className="assignButton" variant="primary" onClick={() => setShowModal(true)}>
              Assign Trainees
            </Button>
            

            {/* Button to navigate to the tasks page */}
            <NavLink to={`/viewTask/${batch.id}`}>
              <Button variant="success">View Tasks</Button>
            </NavLink>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title><h6>Assign Trainees to Batch: {batch.batchName}</h6></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit}>
                  {trainees.map((trainee) => (
                    <div key={trainee.id}>
                      <input
                        type="checkbox"
                        id={`trainee_${trainee.id}`}
                        name={`trainee_${trainee.id}`}
                        checked={selectedTrainees.includes(trainee.id)}
                        onChange={() => handleTraineeSelection(trainee.id)}
                      />
                      <label htmlFor={`trainee_${trainee.id}`}>{trainee.fullName}</label>
                    </div>
                  ))}
                  <Button type="submit">Submit</Button>
                </form>
              </Modal.Body>
            </Modal>
          </>
        )}

        {batch && trainees.length > 0 && (
          <>
            <h4>Trainees in Batch: {batch.batchName}</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact Number</th>
                  <th>Present Address</th>
                </tr>
              </thead>
              <tbody>
                {trainees.map((trainee) => (
                  <tr key={trainee.id}>
                    <td>{trainee.fullName}</td>
                    <td>{trainee.email}</td>
                    <td>{trainee.contactNumber}</td>
                    <td>{trainee.presentAddress}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}

        {showMessage && <p>Trainees assigned successfully!</p>}
      </Container>
    </div>
  );
};

export default Batch;