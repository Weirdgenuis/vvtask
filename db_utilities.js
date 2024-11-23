const fs = require('fs');
const path = require('path');

// Path to the JSON database
const user_dbPath = path.resolve(__dirname, 'users.json');
const task_dbPath = path.resolve(__dirname, 'tasks.json');


const getUsers = () => {
    const data = fs.readFileSync(user_dbPath, 'utf-8');
    const db = JSON.parse(data);
    return db.users;
};


const addUser = (username, email, password) => {
    const data = fs.readFileSync(user_dbPath, 'utf-8');
    const db = JSON.parse(data);

    // Add the new user to the database
    db.users.push({ username, email, password });

    // Save the updated database back to the file
    fs.writeFileSync(user_dbPath, JSON.stringify(db, null, 2), 'utf-8');
    console.log('User added successfully!');
};


const findUserByEmail = (email) => {
    const data = fs.readFileSync(user_dbPath, 'utf-8');
    const db = JSON.parse(data);
    return db.users.find((user) => user.email === email);
};


const readTasks = () => {
    const data = fs.readFileSync(task_dbPath, 'utf-8');
    return JSON.parse(data);
};


const writeTasks = (tasks) => {
    fs.writeFileSync(task_dbPath, JSON.stringify({ tasks }, null, 2), 'utf-8');
};
  

const createTask = (title, description, deadline, priority) => {
    const tasks = readTasks().tasks;
    const newTask = {
        id: tasks.length + 1, // Simple way to create a new ID
        title,
        description,
        deadline,
        priority,
    };

    tasks.push(newTask);
    writeTasks(tasks);
    console.log('New task added:', newTask);
    return newTask;
};
  

const getAllTasks = () => {
    const tasks = readTasks().tasks;
    console.log('All tasks:', tasks);
    return tasks;
};

  
const getTaskById = (id) => {
    const tasks = readTasks().tasks;
    const task = tasks.find((task) => task.id == id);
    if (task) {
        console.log('Task found:', task);
        return task;
    } else {
        console.log(`Task with ID ${id} not found.`);
        return null;
    }
};
  

const updateTask = (id, updatedFields) => {
    const tasks = readTasks().tasks;
    const taskIndex = tasks.findIndex((task) => task.id == id);
    if (taskIndex !== -1) {
    const updatedTask = { ...tasks[taskIndex], ...updatedFields };
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    console.log('Task updated:', updatedTask);
    } else {
    console.log(`Task with ID ${id} not found.`);
    }
};


const deleteTask = (id) => {
    const tasks = readTasks().tasks;
    const taskIndex = tasks.findIndex((task) => task.id == id);
    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1);
        writeTasks(tasks);
        console.log('Task deleted:', deletedTask);
    } else {
        console.log(`Task with ID ${id} not found.`);
    }
};
  
  
module.exports = {
    getUsers,
    addUser,
    findUserByEmail,
    deleteTask,
    updateTask,
    getTaskById,
    getAllTasks,
    createTask,
    writeTasks,
    readTasks,
};
