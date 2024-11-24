const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Assuming your register route is in this file
const taskRoutes = require('./routes/taskRoutes'); // Assuming your task routes are in this file


dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'frontend')));

// Mount routes with '/api/auth' prefix for authentication and '/api/tasks' for task management
app.use('/api/auth', authRoutes);  // Authentication routes (e.g., /api/auth/register)
app.use('/api/tasks', taskRoutes);  // Task management routes (e.g., /api/tasks/create)

// Basic route for home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Catch-all for 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

