import axios from "axios";
import { useState } from "react";

const Create = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = { title, description, status, dueDate };

    axios.post('http://localhost:4000/api/tasks', task)
      .then((res) => { console.log(res.data) })
      .catch((err) => { console.log(err) });
  };

  return (
    <div>
      <h3>Create a new Task</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title: </label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Task Description: </label>
          <input type="text" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status: </label>
          <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date: </label>
          <input type="date" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <input type="submit" value="Add Task" />
        </div>
      </form>
    </div>
  );
};

export default Create;
