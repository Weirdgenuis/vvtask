const express = require('express');
const router = express.Router();
const { createTask, getTaskById, updateTask, deleteTask, getAllTasks } = require("../db_utilities");


// 1. Create Task
router.post('/tasks', async (req, res) => {
  const { title, description, deadline, priority, user_id } = req.body;

  console.log("Title: ", title);
  console.log("Description: ", description);
  console.log("Deadline: ", deadline);
  console.log("Priority: ", priority);

  try {
    const newTask = createTask(title, description, deadline, priority);
    res.json(newTask);

  } catch (err) {
    console.error("Error -> ", err.message);
    res.status(500).send("Server error");
  }
});

// 2. Get All Tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = getAllTasks();
    res.json(tasks);
  } catch (err) {
    console.error("Error getting all tasks = ", err.message);
    res.status(500).send("Server error");
  }
});

// 3. Update Task
router.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, priority } = req.body;

  try {
    const updatedTask = updateTask(id, title, description, deadline, priority);
    res.json(updatedTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 4. Delete Task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    deleteTask(id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 5. Filter Tasks by Priority
router.get('/tasks/filter/:priority', async (req, res) => {
  const { priority } = req.params;
  try {
    const filteredTasks = await pool.query('SELECT * FROM tasks WHERE priority = $1', [priority]);
    res.json(filteredTasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
