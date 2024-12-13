import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');  
  const navigate = useNavigate();
// Handle form submit function
  const handleSubmit = (e) => {
    e.preventDefault();
    const task = { title, description, status, dueDate, priority }; 

    axios.post('http://localhost:4000/api/tasks', task)
      .then((res) => { 
        alert('Task Added Successfully!');
        navigate('/read');
        console.log(res.data);
      })
      .catch((err) => { 
        console.log(err);
      });
  };

  return (
    <div>
      <h3>Create a new Task</h3>
      {/* The form for adding a new task */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title: </label>
          <input 
            type="text" 
            className="form-control" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Task Description: </label>
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
            <option value="incompleted">Incompleted</option>
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
          <select 
            className="form-control" 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>


        {/* Submit button to add the new task */}
        <div>
          <input type="submit" value="Add Task" />
        </div>
      </form>
    </div>
  );
};

export default Create;
