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
        props.reloadData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Card>
        <Card.Header>{props.task.title}</Card.Header>
        <Card.Body>
          <blockquote className="blockquote mb-0">
            <p>{props.task.description}</p>
            <footer>{props.task.status} | Due: {new Date(props.task.dueDate).toLocaleDateString()}</footer>
          </blockquote>
        </Card.Body>
        <Link className="btn btn-primary" to={"/edit/" + props.task._id}>Edit</Link>
        <Button className="btn btn-danger" onClick={handleDelete}>Delete</Button>
      </Card>
    </div>
  );
};

export default TaskItem;
