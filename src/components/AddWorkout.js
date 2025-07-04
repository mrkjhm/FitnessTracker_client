import { useState } from 'react';
import { Form, Button, Modal, FloatingLabel } from 'react-bootstrap';

export default function AddWorkout({ show, handleClose, onAdd }) {
    const [name, setName] = useState('');
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState('');
    const [second, setSecond] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        onAdd(name, hour, minute, second);

        setName('');
        setHour(0);
        setMinute('');
        setSecond(0);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Workout</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group controlId="workoutName" className='pb-2'>
                        <FloatingLabel controlId="floatingWorkoutName" label="Workout Name">
                            <Form.Control
                                type="text"
                                placeholder="Workout Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <Form.Label>Hours</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            value={hour}
                            onChange={(e) => setHour(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className='pb-2'>
                        <Form.Label>Minutes</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            max="60"
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className='pb-2'>
                        <Form.Label>Seconds</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            max="60"
                            value={second}
                            onChange={(e) => setSecond(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Add
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
