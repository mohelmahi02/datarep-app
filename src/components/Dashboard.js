import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:4000/api/tasks', {
        headers: {
          'x-auth-token': token
        }
      })
      .then(response => {
        setTasks(response.data.tasks);
      })
      .catch(err => console.log(err));
    }
  }, []);

  return (
    <div>
      <h3>Your Tasks</h3>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
