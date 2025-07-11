import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaPlay, FaPause, FaCheck, FaRedo } from 'react-icons/fa';

export default function StartWorkout({
                                        status,
                                        workout,
                                        activeWorkoutId,
                                        isPaused,
                                        onStart,
                                        onPause,
                                        onResume,
                                        onComplete,
                                        timeLeft,
                                        resetWorkoutId
                                    }) {
    const isActive = activeWorkoutId === workout._id;
    const [localStatus, setLocalStatus] = useState(status);

    useEffect(() => {
        if (resetWorkoutId === workout._id) {
            setLocalStatus('pending');
            return;
        }

        if (isActive) {
            if (timeLeft === 0) {
                setLocalStatus('complete-ready');
            } else if (isPaused) {
                setLocalStatus('paused');
            } else {
                setLocalStatus('started');
            }
        } else {
            setLocalStatus(status);
        }
    }, [status, isActive, isPaused, timeLeft, resetWorkoutId]);



    const handleClick = () => {
        if (localStatus === 'pending' || (localStatus === 'inProgress' && timeLeft > 0)) {
            onStart(workout);
        } else if (localStatus === 'started') {
            onPause();
        } else if (localStatus === 'paused') {
            onResume();
        } else if (localStatus === 'complete-ready') {
            onComplete(workout._id);
        }
    };


    if (status === 'completed') return null;

    let buttonIcon = <FaPlay />;
    let buttonVariant = "success";

    if (localStatus === 'started') {
        buttonIcon = <FaPause />;
        buttonVariant = "warning";
    } else if (localStatus === 'paused') {
        buttonIcon = <FaPlay />;
        buttonVariant = "success";
    } else if (localStatus === 'complete-ready') {
        buttonIcon = <FaCheck />;
        buttonVariant = "primary";
    }


    return (
        <div className="d-flex justify-content-center">
            <Button
                className="d-flex justify-content-center align-items-center rounded-circle p-0"
                style={{ width: '40px', height: '40px' }}
                size="sm"
                variant={buttonVariant}
                onClick={handleClick}
            >
                {buttonIcon}
                <span className="visually-hidden">
    {localStatus === 'started'
        ? 'Pause'
        : localStatus === 'paused'
            ? 'Resume'
            : localStatus === 'complete-ready'
                ? 'Complete'
                : 'Start'}
  </span>
            </Button>



        </div>

    );
}
