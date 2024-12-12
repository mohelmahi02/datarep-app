import { useEffect } from "react";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const TaskItem = (props) => {
  useEffect(() => {
    console.log("Task Item:", props.task);
  }, [props.task]);

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`http://localhost:4000/api/task/${props.task._id}`)
      .then((res) => {
        console.log('Task deleted:', res.data);
        props.reloadData();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    const updatedTask = { ...props.task, status: newStatus };

    
    axios.put(`http://localhost:4000/api/task/${props.task._id}`, updatedTask)
      .then((res) => {
        console.log('Task updated:', res.data);
        props.reloadData();  
      })
      .catch((error) => {
        console.log('Error updating task:', error);
      });
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
        <Link className="btn btn-primary" to={"/edit/" + props.task._id}>Edit</Link>
        <Button className="btn btn-danger" onClick={handleDelete}>Delete</Button>
      </Card>
    </div>
    
  );
};

export default TaskItem;
