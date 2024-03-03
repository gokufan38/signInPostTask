const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    const uri = process.env.MONGODB_URI;
    const uriParts = uri.split('/');
    const databaseName = uriParts[uriParts.length - 1]; 
    console.log('Connected to MongoDB - Database:', databaseName);
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Schemas & Models
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true }, 
  originalFilename: { type: String, required: true }
});
const File = mongoose.model('File', fileSchema);

// Routes
app.post('/signup', async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: savedUser });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).json({ error: 'Failed to save user' }); 
  }
});

app.get('/files', async (req, res) => {
  try {
    const allFiles = await File.find();
    res.json(allFiles); 
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Root route (should generally be at the end)
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start Server
app.listen(port, () => console.log(`Server listening on port ${port}`));

const uri = process.env.MONGODB_URI;
const uriParts = uri.split('/');
const databaseName = uriParts[uriParts.length - 1]; 
console.log('Database name:', databaseName);
