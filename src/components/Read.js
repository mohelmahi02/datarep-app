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
 // Reload data function
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
 // Handle seacrch functionality
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query); 
//filter task based on title or description
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);  
  };
//clear search function
  const clearSearch = () => {
    setSearchQuery('');  
    setFilteredTasks(tasks);  
  };
//sortting tasks function 
  const handleSort = (option) => {
    setSortOption(option);

    let sortedTasks = [...tasks]; 
// Sorting tasks based on the selected option (due date, status, priority)
    if (option === 'dueDate') {
      sortedTasks = sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    } else if (option === 'status') {
      sortedTasks = sortedTasks.sort((a, b) => a.status.localeCompare(b.status));
    } else if (option === 'priority') {
      //Priority order for sorting
      const priorityOrder = ['High', 'Medium', 'Low'];
      sortedTasks = sortedTasks.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
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
{/* Clear search button  */}
      <button onClick={clearSearch} className="btn btn-secondary mb-3">
        Clear Search
      </button>

   {/* Sorting buttons */}
      <div className="mb-3">
        <button className="btn btn-info me-2" onClick={() => handleSort('dueDate')}>Sort by Due Date</button>
        <button className="btn btn-info me-2" onClick={() => handleSort('status')}>Sort by Status</button>
        <button className="btn btn-info" onClick={() => handleSort('priority')}>Sort by Priority</button>
      </div>

       {/* Render filtered tasks */}
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
