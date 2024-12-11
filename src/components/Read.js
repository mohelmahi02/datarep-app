import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

const Read = () => {
  const [tasks, setTasks] = useState([]);  
  const [filteredTasks, setFilteredTasks] = useState([]);  
  const [searchQuery, setSearchQuery] = useState('');  
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    
    axios.get('http://localhost:4000/api/tasks')
      .then(response => {
        const fetchedTasks = response.data.tasks;
        setTasks(fetchedTasks);  
        setFilteredTasks(fetchedTasks);  
        setIsLoading(false);  
      })
      .catch(err => {
        console.log('Error fetching tasks:', err);
        setIsLoading(false);
      });
  }, []);

  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query); 

   
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);  
  };

  
  const clearSearch = () => {
    setSearchQuery('');  
    setFilteredTasks(tasks);  
  };

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <h2>All Tasks</h2>

      
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
        className="form-control mb-3"
      />

      <button onClick={clearSearch} className="btn btn-secondary mb-3">
        Clear Search
      </button>

      
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
};

export default Read;
