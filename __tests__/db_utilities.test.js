const path = require('path')
const fs = require('fs');
jest.mock('fs'); // Mock the fs module

const user_dbPath = path.resolve(__dirname, '../users.json');
const task_dbPath = path.resolve(__dirname, '../tasks.json');


// Mock Database Files
const mockUserDb = { users: [] };
const mockTaskDb = { tasks: [] };

// Mock file content
fs.readFileSync.mockImplementation((path, encoding) => {
  if (path === user_dbPath) return JSON.stringify(mockUserDb);
  if (path === task_dbPath) return JSON.stringify(mockTaskDb);
  throw new Error('File not found');
});

fs.writeFileSync.mockImplementation((path, data, encoding) => {
  if (path === user_dbPath) mockUserDb.users = JSON.parse(data).users;
  if (path === task_dbPath) mockTaskDb.tasks = JSON.parse(data).tasks;
});

// Import functions
const {
  getUsers,
  addUser,
  findUserByEmail,
  readTasks,
  writeTasks,
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../db_utilities'); // Change './functions' to your actual file

// Unit Tests
describe('User Management', () => {
  beforeEach(() => {
    mockUserDb.users = [];
  });

  test('getUsers should return all users', () => {
    mockUserDb.users.push({ username: 'JohnDoe', email: 'john@example.com', password: '1234' });
    const users = getUsers();
    expect(users).toEqual(mockUserDb.users);
  });

  test('addUser should add a new user', () => {
    addUser('JaneDoe', 'jane@example.com', 'password');
    expect(mockUserDb.users).toContainEqual({
      username: 'JaneDoe',
      email: 'jane@example.com',
      password: 'password',
    });
  });

  test('findUserByEmail should return the correct user', () => {
    addUser('JaneDoe', 'jane@example.com', 'password');
    const user = findUserByEmail('jane@example.com');
    expect(user).toEqual({
      username: 'JaneDoe',
      email: 'jane@example.com',
      password: 'password',
    });
  });

  test('findUserByEmail should return null for non-existing email', () => {
    const user = findUserByEmail('nonexistent@example.com');
    expect(user).toBeUndefined();
  });
});

describe('Task Management', () => {
  beforeEach(() => {
    mockTaskDb.tasks = [];
  });

  test('readTasks should return all tasks', () => {
    mockTaskDb.tasks.push({ id: 1, title: 'Task 1', description: 'Test Task' });
    const tasks = readTasks();
    expect(tasks).toEqual(mockTaskDb);
  });

  test('writeTasks should save tasks', () => {
    writeTasks([{ id: 1, title: 'Task 1', description: 'Test Task' }]);
    expect(mockTaskDb.tasks).toEqual([{ id: 1, title: 'Task 1', description: 'Test Task' }]);
  });

  test('createTask should add a new task', () => {
    const task = createTask('Task 1', 'Description', '2024-12-31', 'High');
    expect(mockTaskDb.tasks).toContainEqual({
      id: 1,
      title: 'Task 1',
      description: 'Description',
      deadline: '2024-12-31',
      priority: 'High',
    });
    expect(task.id).toBe(1);
  });

  test('getAllTasks should return all tasks', () => {
    createTask('Task 1', 'Description', '2024-12-31', 'High');
    const tasks = getAllTasks();
    expect(tasks).toEqual(mockTaskDb.tasks);
  });

  test('getTaskById should return the correct task', () => {
    createTask('Task 1', 'Description', '2024-12-31', 'High');
    const task = getTaskById(1);
    expect(task).toEqual(mockTaskDb.tasks[0]);
  });

  test('getTaskById should return null for non-existing task', () => {
    const task = getTaskById(99);
    expect(task).toBeNull();
  });

  test('updateTask should modify an existing task', () => {
    createTask('Task 1', 'Description', '2024-12-31', 'High');
    updateTask(1, { title: 'Updated Task', priority: 'Medium' });
    expect(mockTaskDb.tasks[0]).toMatchObject({ title: 'Updated Task', priority: 'Medium' });
  });

  test('updateTask should do nothing for non-existing task', () => {
    updateTask(99, { title: 'Non-Existent Task' });
    expect(mockTaskDb.tasks).toHaveLength(0);
  });

  test('deleteTask should remove an existing task', () => {
    createTask('Task 1', 'Description', '2024-12-31', 'High');
    deleteTask(1);
    expect(mockTaskDb.tasks).toHaveLength(0);
  });

  test('deleteTask should do nothing for non-existing task', () => {
    deleteTask(99);
    expect(mockTaskDb.tasks).toHaveLength(0);
  });
});
