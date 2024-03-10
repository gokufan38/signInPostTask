const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3001;

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'User created!' });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 11000) { // Handle duplicate key errors
      res.status(400).json({ message: 'Email or username already exists' });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// View User (get by ID)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ message: 'Error getting user' });
  }
});

// Edit User (update by ID) 
app.put('/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedUser) {
      res.json({ message: 'User updated!' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete User 
app.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
