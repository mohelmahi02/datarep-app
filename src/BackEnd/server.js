const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 


const app = express();
const port = 4000;


app.use(cors());  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://<username>:<password>@cluster0.5qfbx.mongodb.net/taskManagerDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});


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


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); 
  next();
});


const User = mongoose.model('User', userSchema);


app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  console.log('Received registration data:', req.body); 


  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

 
  const newUser = new User({ username, password });

  try {
   
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();
    console.log('User registered successfully');
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Error saving user:', err);  
    res.status(500).json({ msg: 'Registration failed' });
  }
});


app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
