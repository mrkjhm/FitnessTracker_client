import { Button } from "react-bootstrap";

export default function CompletedWorkout({ status, workout, onDone }) {
    return (
        <Button
            disabled={status === 'completed'}  // Disable if completed
            variant={status === 'completed' ? "secondary" : "success"}  // Change color when completed
            size="sm" 
            onClick={(e) => onDone(e, workout)}
        >
            {status === 'completed' ? 'Completed' : 'Complete'}
        </Button>
    );
}

