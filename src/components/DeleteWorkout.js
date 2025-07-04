import { Button } from "react-bootstrap";

export default function DeleteWorkout({workout, onDelete, status}) {

    return (
        <Button
            variant={status === 'completed' ? 'light' : 'danger'}
            size="sm"
            onClick={ (e) => onDelete(e , workout )}
        >
            Delete
        </Button>
    )
}