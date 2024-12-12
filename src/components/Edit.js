import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

  
  useEffect(() => {
    axios.get(`http://localhost:4000/api/task/${id}`)
      .then((res) => {
        const task = res.data;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setDueDate(task.dueDate);
      })
      .catch((err) => {
        console.error("Error fetching task:", err);
        setError('Failed to fetch task data');
      });
  }, [id]);

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = { title, description, status, dueDate ,priority};

    axios.put(`http://localhost:4000/api/task/${id}`, updatedTask)
      .then((res) => {
        console.log('Task updated:', res.data);
        navigate('/read');  
      })
      .catch((err) => {
        console.error('Error updating task:', err);
      });
  };

  return (
    <div>
      <h3>Edit Task</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}  

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Edit Task Title: </label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Edit Task Description: </label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Status: </label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="completed">Incompleted</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date: </label>
          <input
            type="date"
            className="form-control"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
                    <label>Priority: </label>
                    <select className="form-control"
                        value={priority}
                        onChange={(e) => { setPriority(e.target.value) }}
                    >
                        <option value="Low">High</option>
                        <option value="Medium">Medium</option>
                        <option value="High">Low</option>
                    </select>
                </div>
        <button type="submit" className="btn btn-primary">Edit Task</button>
      </form>
    </div>
  );
};

export default Edit;
