import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

export default function UpdateWorkout({ workoutName, workoutDuration, workout, onUpdate }) {
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [name, setName] = useState('');
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState(0);

    const closeUpdate = () => setShowUpdateModal(false);
    const showUpdate = () => setShowUpdateModal(true);

    // ✅ Set form values when modal is opened
    useEffect(() => {
        if (showUpdateModal) {
            setName(workoutName || '');
            setHour(workoutDuration?.hours || 0);
            setMinute(workoutDuration?.minutes || 0);
            setSecond(workoutDuration?.seconds || 0);
        }
    }, [showUpdateModal, workoutName, workoutDuration]);

    const submitUpdate = (e) => {
        e.preventDefault();
        onUpdate(name, hour, minute, second, workout, closeUpdate);
    };

    return (
        <>
            <Button variant="light" className="border" size="sm" onClick={showUpdate}>Update</Button>

            <Modal show={showUpdateModal} onHide={closeUpdate}>
                <Form onSubmit={submitUpdate}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Workout</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Name:</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Hour/s:</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                max="24"
                                required
                                value={hour}
                                onChange={e => setHour(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Minutes:</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                max="60"
                                required
                                value={minute}
                                onChange={e => setMinute(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Seconds:</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                max="60"
                                required
                                value={second}
                                onChange={e => setSecond(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={closeUpdate}>Close</Button>
                        <Button variant="primary" type="submit">Update</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}
