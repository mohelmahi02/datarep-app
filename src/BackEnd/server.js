const express = require('express');
const app = express();
const port = 4000;

const cors = require('cors');
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import mongoose and connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config(); // To load environment variables (if using .env)
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://<username>:<password>@cluster0.5qfbx.mongodb.net/taskManagerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// User Schema (for authentication)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the User schema for authentication
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);

// Task Schema (for task manager)
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  dueDate: Date
});

const Task = mongoose.model('Task', taskSchema);


const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Authentication Routes
const authRoutes = express.Router();

// Register User 
authRoutes.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login User
authRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


app.use('/api/auth', authRoutes);


app.get('/api/tasks', authMiddleware, async (req, res) => {
  const tasks = await Task.find({}).exec();
  res.status(200).json({ tasks });
});

app.get('/api/task/:id', authMiddleware, async (req, res) => {
  const task = await Task.findById(req.params.id).exec();
  res.json(task);
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const newTask = new Task({ title, description, status, dueDate });
  await newTask.save();
  res.status(201).json({ message: "Task added!", task: newTask });
});

app.put('/api/task/:id', authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
  res.json(task);
});

app.delete('/api/task/:id', authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id).exec();
  res.send(task);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
