import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Edit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');  
    const navigate = useNavigate();

   
    useEffect(() => {
        axios.get('http://localhost:4000/api/task/' + id)
            .then((res) => {
                setTitle(res.data.title);
                setDescription(res.data.description);
                setStatus(res.data.status);
                setDueDate(res.data.dueDate);
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to fetch task data');
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedTask = { title, description, status, dueDate };
        
        axios.put('http://localhost:4000/api/task/' + id, updatedTask)
            .then((res) => {
                console.log("Edited: ", res.data);
                navigate('/read');  
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to update task');
            });
    };

    return (
        <div>
            <h3>Edit Task</h3>
            {error && <div className="alert alert-danger">{error}</div>}  
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Edit Task Title: </label>
                    <input 
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value) }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Edit Task Description: </label>
                    <input 
                        type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Status: </label>
                    <select
                        className="form-control"
                        value={status}
                        onChange={(e) => { setStatus(e.target.value) }}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option> 
                    </select>
                </div>
                <div className="form-group">
                    <label>Due Date: </label>
                    <input 
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => { setDueDate(e.target.value) }}
                        required
                    />
                </div>
                <div>
                    <input type="submit" value="Edit Task" />
                </div>
            </form>
        </div>
    );
}

export default Edit;
