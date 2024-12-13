import { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const TaskItem = (props) => {
  const [isCompleted, setIsCompleted] = useState(props.task.status === 'completed');  // Track task completion status
  
  useEffect(() => {
    console.log("Task Item:", props.task);
  }, [props.task]);

  // Task handle task completion toggle
  const handleCompletionToggle = () => {
    // Toggle between 'completed' and 'pending'
    const newStatus = isCompleted ? 'pending' : 'completed'; 
    const updatedTask = { ...props.task, status: newStatus };

    // Send PUT request to update the task status in the backend
    axios.put(`http://localhost:4000/api/task/${props.task._id}`, updatedTask)
      .then((res) => {
        console.log('Task updated:', res.data);
        setIsCompleted(!isCompleted);  // Toggle the isCompleted state
        props.reloadData();  // Reload task data after update
      })
      .catch((error) => {
        console.log('Error updating task:', error);  
      });
  };
//Handle Delete function
  const handleDelete = (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      axios.delete(`http://localhost:4000/api/task/${props.task._id}`)
        .then((res) => {
          console.log('Task deleted:', res.data);
          props.reloadData();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Card>
        <Card.Header>{props.task.title}</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>{props.task.description}</p>
            <footer>
              {props.task.status} | Due: {new Date(props.task.dueDate).toLocaleDateString()} 
              | Priority: <strong>{props.task.priority}</strong>
            </footer>
          </blockquote>
        </Card.Body>

        {/* Checkbox for marking the task as completed */}
        <div className="form-group">
          <label>Task Completed: </label>
          <input 
            type="checkbox" 
            checked={isCompleted}  // Checked if the task is completed
            onChange={handleCompletionToggle}  
          />
        </div>

        {/* Edit button */}
        <Link className="btn btn-primary" to={"/edit/" + props.task._id}>Edit</Link>

        {/* Delete button */}
        <Button className="btn btn-danger" onClick={handleDelete}>Delete</Button>
      </Card>
    </div>
  );
};

export default TaskItem;
