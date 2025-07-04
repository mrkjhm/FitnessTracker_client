import { Button } from "react-bootstrap";

export default function ResetWorkout({ workout, status, onReset, resetDisabled }) {
    if (status === 'completed') return null; // hide if already completed

    return (
        <Button
            variant="light"
            size="sm"
            onClick={() => onReset(workout)}
            className="border "
            disabled={resetDisabled}
        >
            Reset
        </Button>
    );
}
