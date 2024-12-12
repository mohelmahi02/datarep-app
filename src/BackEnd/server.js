const express = require('express');
const app = express();
const port = 4000;


const cors = require('cors');
app.use(cors()); 


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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


const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String, 
  dueDate: Date
});

const taskModel = mongoose.model('Task', taskSchema);


app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await taskModel.find({});
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


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


app.post('/api/tasks', async (req, res) => {
  const { title, description, status, dueDate, priority } = req.body;
  const newTask = new taskModel({ title, description, status, dueDate, priority });
  await newTask.save();
  res.status(201).json({ message: 'Task Added!', task: newTask });
})

app.put('/api/task/:id', async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body; 
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
