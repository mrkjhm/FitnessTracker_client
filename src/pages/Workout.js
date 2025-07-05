import { useCallback, useContext, useEffect, useState, useRef } from "react"
import { Row, Col, Button, Card, Container } from "react-bootstrap"
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { useNavigate } from "react-router-dom";
import 'react-circular-progressbar/dist/styles.css';

import Swal from "sweetalert2"

import UserContext from '../UserContext';

import AddWorkout from "../components/AddWorkout"
import UpdateWorkout from "../components/UpdateWorkout"
import DeleteWorkout from "../components/DeleteWorkout"
import CompletedWorkout from "../components/CompletedWorkout"
import StartWorkout from "../components/StartWorkout";
import ResetWorkout from "../components/ResetWorkout";


// Helper function
/*const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (val) => val.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};*/


export default function Workout() {
    const API_URL = process.env.REACT_APP_API_URL;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [workouts, setWorkouts] = useState([]);
    const [addWorkoutModal, setAddWorkoutModal] = useState(false);
    const [activeWorkoutId, setActiveWorkoutId] = useState(null);
    const [workoutTimers, setWorkoutTimers] = useState({});

    const [isPaused, setIsPaused] = useState(false);
    const [resetDisabled, setResetDisabled] = useState(false);

    const timerRef = useRef(null);

    const closeAddWorkoutModal = () => setAddWorkoutModal(false);
    const showAddWorkoutModal = () => setAddWorkoutModal(true);

    const groupWorkoutsByDate = (workouts) => {
        return workouts.reduce((acc, workout) => {
            const dateObj = new Date(workout.dateAdded);

            // Get full day name (e.g., Monday)
            const day = dateObj.toLocaleDateString(undefined, { weekday: 'long' });

            // Format date (e.g., July 4, 2025)
            const formattedDate = dateObj.toLocaleDateString();

            // Combine day + date (e.g., Friday - 7/4/2025)
            const displayDate = `${day} | ${formattedDate}`;

            if (!acc[displayDate]) acc[displayDate] = [];
            acc[displayDate].push(workout);

            return acc;
        }, {});
    };

    const addWorkout = (name, hour, minute, second) => {
        fetch(`${API_URL}/workouts/addWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name,
                hours: parseInt(hour) || 0,
                minutes: parseInt(minute) || 0,
                seconds: parseInt(second) || 0
            })
        })
            .then(res => res.json())
            .then(data => {
                if (typeof data.message !== "string") {
                    Swal.fire({
                        title: "Awesome Job!",
                        text: "You're one step closer to your fitness goals. Keep going!",
                        icon: "success",
                        confirmButtonText: "Let's Do More!"
                    });
                    closeAddWorkoutModal();
                    fetchWorkout();
                } else {
                    Swal.fire({
                        title: "Failed to Add Workout",
                        icon: "error"
                    });
                }
            });
    };

    const updateWorkout = (name, hour, minute, second, id, closeUpdate) => {
        fetch(`${API_URL}/workouts/updateWorkout/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name, hour, minute, second })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Workout updated successfully") {
                    Swal.fire({
                        title: "Workout Updated Successfully",
                        icon: "success"
                    });
                    closeUpdate();

                    // Update workouts state directly without waiting for fetchWorkout
                    setWorkouts(prev =>
                        prev.map(w =>
                            w._id === id ? {
                                ...w,
                                name,
                                duration: {
                                    hours: parseInt(hour),
                                    minutes: parseInt(minute)
                                }
                            } : w
                        )
                    );

                    // Also update workoutTimers state
                    const totalSeconds = (parseInt(hour) * 3600) + (parseInt(minute) * 60) + (parseInt(second) || 0);

                    setWorkoutTimers(prev => ({
                        ...prev,
                        [id]: totalSeconds
                    }));

                    // Persist to localStorage if active
                    if (activeWorkoutId === id) {
                        const newTimers = {
                            ...workoutTimers,
                            [id]: totalSeconds
                        };
                        localStorage.setItem('workoutTimers', JSON.stringify(newTimers));
                    }
                } else {
                    Swal.fire({
                        title: "Failed to Update Workout",
                        icon: "error"
                    });
                }
            });
    };

    const deleteWorkout = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${API_URL}/workouts/deleteWorkout/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        Swal.fire({
                            title: data.message === "Workout deleted successfully" ? "Deleted!" : "Error",
                            text: data.message === "Workout deleted successfully" ? "Your workout has been deleted." : "Cannot Delete.",
                            icon: data.message === "Workout deleted successfully" ? "success" : "error"
                        });
                        fetchWorkout();
                    })
                    .catch(error => Swal.fire({ title: "Error", text: error.message, icon: "error" }));
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({ title: 'Cancelled', text: 'Your workout is safe :)', icon: 'info' });
            }
        });
    };

    const completedWorkout = (eOrId, idMaybe) => {
        const id = typeof eOrId === 'string' ? eOrId : idMaybe;

        // Optional: only call preventDefault if event exists
        if (typeof eOrId !== 'string' && eOrId?.preventDefault) {
            eOrId.preventDefault();
        }

        Swal.fire({
            title: 'Are you sure you completed the workout?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes, I've completed my workout!",
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`${API_URL}/workouts/completeWorkoutStatus/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        Swal.fire({
                            title: data.message === "Workout status updated successfully" ? "Great Job!" : "Error",
                            text: data.message === "Workout status updated successfully" ? "Your workout has been completed." : "Something went wrong.",
                            icon: data.message === "Workout status updated successfully" ? "success" : "error"
                        });

                        if (id === activeWorkoutId) {
                            setActiveWorkoutId(null);
                            setIsPaused(false);
                            setWorkoutTimers(prev => {
                                const newTimers = { ...prev };
                                delete newTimers[id];
                                return newTimers;
                            });

                            localStorage.removeItem('activeWorkoutId');
                            localStorage.removeItem('timeLeft');
                            localStorage.removeItem('isPaused');
                        }

                        fetchWorkout();
                    })
                    .catch(error => Swal.fire({ title: "Error", text: error.message, icon: "error" }));
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({ title: 'Cancelled', text: 'Please complete your workout :)', icon: 'info' });
            }
        });
    };

    const resetCountdown = (workout) => {
        const { _id } = workout;

        Swal.fire({
            title: 'Reset Workout?',
            text: "Are you sure you want to reset this workout?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, reset it!',
            cancelButtonText: 'No, keep it',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Stop timer
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }

                // Clear state and localStorage
                setActiveWorkoutId(null);
                setIsPaused(false);
                localStorage.removeItem('activeWorkoutId');
                localStorage.removeItem('isPaused');
                localStorage.removeItem('workoutTimers');

                // Call backend
                fetch(`${API_URL}/workouts/resetWorkout/${_id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        const updated = data.workout;
                        const totalSeconds =
                            (updated.duration.hours * 3600) +
                            (updated.duration.minutes * 60) +
                            (updated.duration.seconds || 0);

                        setWorkoutTimers(prev => {
                            const updatedTimers = {
                                ...prev,
                                [_id]: totalSeconds
                            };
                            localStorage.setItem('workoutTimers', JSON.stringify(updatedTimers));
                            return updatedTimers;
                        });

                        fetchWorkout();

                        Swal.fire('Reset!', 'Your workout has been reset.', 'success');
                    })
                    .catch(error => {
                        console.error("Reset failed:", error);
                        Swal.fire({ title: 'Error', text: 'Workout reset failed.', icon: 'error' });
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your workout remains unchanged.', 'info');
            }
        });
    };

    const startCountdown = (workout) => {
        const { _id, duration } = workout;
        const totalSeconds = (duration.hours * 3600) + (duration.minutes * 60) + (duration.seconds || 0);


        // Pause current workout
        if (activeWorkoutId && activeWorkoutId !== _id) {
            setIsPaused(true);
        }

        setActiveWorkoutId(_id);
        setIsPaused(false);

        setWorkoutTimers(prev => ({
            ...prev,
            [_id]: prev[_id] || totalSeconds // retain existing or set initial
        }));

        localStorage.setItem('activeWorkoutId', _id);
        localStorage.setItem('isPaused', 'false');
    };

    const pauseCountdown = () => {
        setIsPaused(true);
        localStorage.setItem('isPaused', 'true');
    };

    const resumeCountdown = () => {
        setIsPaused(false);
        localStorage.setItem('isPaused', 'false');
    };

    useEffect(() => {
        const savedId = localStorage.getItem('activeWorkoutId');
        const savedTime = localStorage.getItem('timeLeft');
        const savedPaused = localStorage.getItem('isPaused');

        if (savedId && savedTime) {
            setActiveWorkoutId(savedId);
            setWorkoutTimers(Number(savedTime));
            setIsPaused(savedPaused === 'true');
        }
    }, []);

    useEffect(() => {
        if (activeWorkoutId && !isPaused) {
            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setWorkoutTimers(prev => {
                    const newTime = (prev[activeWorkoutId] || 0) - 1;

                    if (newTime <= 0) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;

                        const updatedTimers = { ...prev, [activeWorkoutId]: 0 };
                        setIsPaused(false);

                        return updatedTimers;
                    }

                    // ✅ ⬇️ ADD THIS INSIDE setWorkoutTimers BEFORE RETURN
                    localStorage.setItem('workoutTimers', JSON.stringify({
                        ...prev,
                        [activeWorkoutId]: newTime
                    }));

                    return { ...prev, [activeWorkoutId]: newTime };
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [activeWorkoutId, isPaused]);


    const fetchWorkout = useCallback(() => {
        fetch(`${API_URL}/workouts/getMyWorkouts`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (typeof data.message !== "string") {
                    const sortedWorkouts = data.workouts.sort((a, b) => {
                        if (a.status === 'pending' && b.status === 'completed') return -1;
                        if (a.status === 'completed' && b.status === 'pending') return 1;
                        return 0;
                    });
                    setWorkouts(sortedWorkouts);

                    // ⏱ Initialize timers if not set yet
                    setWorkoutTimers(prev => {
                        const newTimers = { ...prev };

                        sortedWorkouts.forEach(workout => {
                            const id = workout._id;
                            if (!newTimers[id] && workout.status !== 'completed') {
                                const totalSeconds = (workout.duration.hours * 3600) + (workout.duration.minutes * 60) + (workout.duration.seconds || 0);

                                newTimers[id] = totalSeconds;
                            }
                        });
                        return newTimers;
                    });
                } else {
                    setWorkouts([]);
                }
            });
    }, [API_URL]);

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        // ✅ ⬇️ RESTORE STATE FROM LOCALSTORAGE
        const savedId = localStorage.getItem('activeWorkoutId');
        const savedPaused = localStorage.getItem('isPaused');
        const savedTimers = localStorage.getItem('workoutTimers');

        if (savedId && savedTimers) {
            setActiveWorkoutId(savedId);
            setIsPaused(savedPaused === 'true');
            setWorkoutTimers(JSON.parse(savedTimers));
        }

        fetchWorkout();
    }, [user.id, navigate, fetchWorkout]);


    return (
        <>
            <div className="container">
                <Row>
                    <Col className="p-4 text-center">
                        <h1>Your Personalized Workout Plans</h1>
                    </Col>
                </Row>
                <Row className="mb-5 d-flex justify-content-center">
                    <Col xs="auto">
                        <Button variant="danger" onClick={showAddWorkoutModal}>
                            {workouts.length > 0 ? " Add your next workout!" : "ADD WORKOUT"}
                        </Button>
                    </Col>
                </Row>
                <Container>
                    {Object.entries(groupWorkoutsByDate(workouts)).map(([date, dailyWorkouts]) => (
                        <div key={date} className="mb-4">
                            <h5 style={{ fontSize: '0.80rem' }} className="fw-bold text-muted mb-3" >{date}</h5>
                            <Row>
                                {dailyWorkouts.map(workout => {
                                    const formatTime = (totalSeconds) => {
                                        const hours = Math.floor(totalSeconds / 3600);
                                        const minutes = Math.floor((totalSeconds % 3600) / 60);
                                        const seconds = totalSeconds % 60;
                                        return [
                                            hours.toString().padStart(2, '0'),
                                            minutes.toString().padStart(2, '0'),
                                            seconds.toString().padStart(2, '0')
                                        ].join(':');
                                    };
                                    const dateAdded = new Date(workout.dateAdded).toLocaleString();
                                    const dateCompleted = workout.dateCompleted ? new Date(workout.dateCompleted).toLocaleString() : null;
                                    return (
                                        <Col lg={4} md={6} xs={12} key={workout._id} className="mb-3">
                                            <Card>
                                                <Card.Header className="d-flex justify-content-between align-items-center">
                                                    <Card.Title className="mb-0">
                                                        {workout.name}

                                                    </Card.Title>
                                                    <span className={`badge bg-${workout.status === 'completed'
                                                        ? 'success'
                                                        : activeWorkoutId === workout._id
                                                            ? 'primary'
                                                            : workout.status === 'inProgress'
                                                                ? 'warning'
                                                                : 'info'}`}>{
                                                        workout.status === 'completed'
                                                            ? 'Completed!'
                                                            : activeWorkoutId === workout._id
                                                                ? 'Active'
                                                                : workout.status === 'inProgress'
                                                                    ? 'Paused'
                                                                    : 'Ready to Start'
                                                    }</span>
                                                </Card.Header>
                                                <Card.Body>
                                                    {workout.status !== 'completed' && workoutTimers[workout._id] !== undefined && (
                                                        <div style={{ width: '50%', height: '50%', margin: '0 auto', paddingBottom: '20px' }}>
                                                            <CircularProgressbarWithChildren
                                                                value={workoutTimers[workout._id]}
                                                                maxValue={(workout.duration.hours * 3600 + workout.duration.minutes * 60 + (workout.duration.seconds || 0))}

                                                                styles={buildStyles({
                                                                    pathColor: activeWorkoutId === workout._id
                                                                        ? (workoutTimers[workout._id] <= 10 ? '#dc3545' : '#198754')
                                                                        : '#adb5bd',
                                                                    trailColor: '#dee2e6',
                                                                })}
                                                                strokeWidth={4}
                                                            >
                                                                <div style={{ fontSize: '30px', textAlign: 'center' }}>
                                                                    <div style={{ fontSize: '14px' }}>Time Left</div>
                                                                    <strong>{formatTime(workoutTimers[workout._id])}</strong>
                                                                    <StartWorkout
                                                                        status={workout.status}
                                                                        workout={workout}
                                                                        activeWorkoutId={activeWorkoutId}
                                                                        isPaused={isPaused}
                                                                        timeLeft={workoutTimers[workout._id]}
                                                                        onStart={startCountdown}
                                                                        onPause={pauseCountdown}
                                                                        onResume={resumeCountdown}
                                                                        onComplete={completedWorkout}
                                                                    />
                                                                </div>
                                                            </CircularProgressbarWithChildren>
                                                        </div>
                                                    )}

                                                    <Card.Text className="text pt-2">Date Added: {dateAdded}</Card.Text>
                                                    {workout.status === 'completed' && dateCompleted && (
                                                        <Card.Text className="text">Date Completed: {dateCompleted}</Card.Text>
                                                    )}
                                                </Card.Body>
                                                <Card.Footer className="d-flex flex-wrap justify-content-start gap-2">
                                                    {workout.status !== 'completed' && activeWorkoutId !== workout._id && (
                                                        <UpdateWorkout
                                                            workoutName={workout.name}
                                                            workoutDuration={workout.duration}
                                                            workout={workout._id}
                                                            onUpdate={updateWorkout}
                                                        />
                                                    )}
                                                    {!(activeWorkoutId === workout._id && !isPaused) && (
                                                        <DeleteWorkout
                                                            workout={workout._id}
                                                            onDelete={deleteWorkout}
                                                            status={workout.status}
                                                        />

                                                    )}
                                                    {workout.status !== 'completed' && (
                                                        <CompletedWorkout
                                                            status={workout.status}
                                                            workout={workout._id}
                                                            onDone={completedWorkout}
                                                        />
                                                    )}
                                                    <ResetWorkout
                                                        workout={workout}
                                                        status={workout.status}
                                                        onReset={resetCountdown}
                                                    />
                                                </Card.Footer>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                    ))}
                </Container>
            </div>
            <AddWorkout show={addWorkoutModal} handleClose={closeAddWorkoutModal} onAdd={addWorkout} />
        </>
    );
}
