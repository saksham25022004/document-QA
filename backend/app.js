const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');

// Create Express app
const app = express();

//MongoDB URL
const MONGO_DB=process.env.MONGO_URI || 'mongodb://localhost:27017/document_qa';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/documents', documentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
