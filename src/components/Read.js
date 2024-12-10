import { useEffect, useState } from "react";
import axios from "axios";
import TaskItem from "./TaskItem";

const Read = () => {
  const [tasks, setTasks] = useState([]);

  const reloadData = () => {
    axios.get('http://localhost:4000/api/tasks')
      .then((response) => {
        setTasks(response.data.tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <div>
      <h3>Task List</h3>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} reloadData={reloadData} />
      ))}
    </div>
  );
};

export default Read;
