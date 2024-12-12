import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

const Read = () => {
  const [tasks, setTasks] = useState([]);  
  const [filteredTasks, setFilteredTasks] = useState([]);  
  const [searchQuery, setSearchQuery] = useState('');  
  const [isLoading, setIsLoading] = useState(true);  
  const [sortOption, setSortOption] = useState('');
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
  
  const reloadData = () => {
    axios.get('http://localhost:4000/api/tasks')
      .then(response => {
        setTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      })
      .catch(err => {
        console.log('Error reloading tasks:', err);
      });
  };
  
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

  const handleSort = (option) => {
    setSortOption(option);

    let sortedTasks = [...tasks]; 

    
    if (option === 'dueDate') {
      sortedTasks = sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (option === 'status') {
      sortedTasks = sortedTasks.sort((a, b) => a.status.localeCompare(b.status));
    }

    setFilteredTasks(sortedTasks); 
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
     
     < div className="mb-3">
        <button className="btn btn-info me-2" onClick={() => handleSort('dueDate')}>Sort by Due Date</button>
        <button className="btn btn-info me-2" onClick={() => handleSort('status')}>Sort by Status</button>
      </div>
      
      {filteredTasks.length > 0 ? (
        filteredTasks.map(task => (
          <TaskItem key={task._id} task={task} reloadData={reloadData} />
        ))
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
};

export default Read;
