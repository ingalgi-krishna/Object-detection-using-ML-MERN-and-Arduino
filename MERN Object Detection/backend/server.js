const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Object-Detection')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Define Schema
const objectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create Model
const ObjectModel = mongoose.model('Object', objectSchema);

// API Endpoint to get all objects
app.get('/api/objects', async (req, res) => {
  try {
    const objects = await ObjectModel.find().sort({ timestamp: -1 });
    res.status(200).json(objects);
  } catch (error) {
    console.error('Error fetching objects:', error);
    res.status(500).json({ message: 'Failed to fetch objects', error });
  }
});

// API Endpoint to post new objects
app.post('/api/objects', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    const object = new ObjectModel({ name });
    await object.save();
    res.status(201).json(object);
  } catch (error) {
    console.error('Error saving object:', error);
    res.status(500).json({ message: 'Failed to save object', error });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
