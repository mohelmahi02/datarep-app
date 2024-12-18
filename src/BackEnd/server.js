const express = require('express');
const app = express();
const port = 4000;//Listen on port 400

// Import CORS to handle cross-origin requests
const cors = require('cors');
app.use(cors()); 


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Mongoose connection
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:admin@cluster0.5qfbx.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});

//Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  dueDate: Date,
  priority: { 
    type: String, 
    enum: ['High', 'Medium', 'Low'], 
    default: 'Low' 
  }
});

const taskModel = mongoose.model('Task', taskSchema);

// Route to get all tasks from the database
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Route to get a specific task by ID
app.get('/api/task/:id', async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ message: 'Error fetching task' });
  }
});

//Route to create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, description, status, dueDate, priority } = req.body;
  const newTask = new taskModel({ title, description, status, dueDate, priority });
  await newTask.save();
  res.status(201).json({ message: 'Task Added!', task: newTask });
})
// Route to update an existing task by ID
app.put('/api/task/:id', async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body; 
    const task = await taskModel.findByIdAndUpdate(
      req.params.id,
      { title, description, status, dueDate }, 
      { new: true } 
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task); 
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Error updating task' });
  }
});
// Route to delete a task by ID
app.delete('/api/task/:id', async (req, res) => {
  try {
    const task = await taskModel.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted', task });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
