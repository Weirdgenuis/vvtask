document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
      // If there's no token, redirect to login page
      window.location.href = 'index.html';
  }
  loadTasks(); // Load tasks only if the user is authenticated
});

// 1. Load All Tasks
async function loadTasks() {
  const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage

  console.log("Token: ", token);

  try {
      const res = await fetch('/api/tasks/tasks', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Send token in the Authorization header
          }
      });

    //   console.log("Response = ", res.json());

      if (!res.ok) {
          throw new Error('Failed to load tasks');
      }

      const tasks = await res.json();
      console.log("🇳🇬🇳🇬🇳🇬 Tasks = ", tasks);

      const taskList = document.getElementById('task-list');
      taskList.innerHTML = ''; // Clear current list

      tasks.forEach(task => {
          const taskDiv = document.createElement('div');
          taskDiv.classList.add('task');
          taskDiv.innerHTML = `
              <h3>${task.title}</h3>
              <p>${task.description}</p>
              <p>Deadline: ${task.deadline}</p>
              <p>Priority: ${task.priority}</p>
              <button onclick="deleteTask(${task.id})">Delete</button>
              <button onclick="editTask(${task.id})">Edit</button>
          `;
          taskList.appendChild(taskDiv);
      });
  } catch (error) {
      console.error('Error loading tasks:', error);
      alert('An error occurred while loading tasks');
  }
}

// 2. Create Task
document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const deadline = document.getElementById('task-deadline').value;
  const priority = document.getElementById('task-priority').value;

  try {
      const res = await fetch('/api/tasks/tasks', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Send token in the Authorization header
          },
          body: JSON.stringify({ title, description, deadline, priority })
      });
      
      if (!res.ok) {
          throw new Error('Failed to create task');
      }

      const newTask = await res.json();
      loadTasks(); // Reload tasks after creating a new one
  } catch (error) {
      console.error('Error creating task:', error);
      alert('An error occurred while creating task');
  }
});

// 3. Delete Task
async function deleteTask(id) {
  const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage

  try {
      const res = await fetch(`/api/tasks/tasks/${id}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}` // Send token in the Authorization header
          }
      });
      
      if (!res.ok) {
          throw new Error('Failed to delete task');
      }
      
      loadTasks(); // Reload tasks after deletion
  } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting task');
  }
}

// 4. Edit Task
async function editTask(id) {
  const newTitle = prompt("Enter new task title:");
  const newDescription = prompt("Enter new task description:");
  const newDeadline = prompt("Enter new deadline:");
  const newPriority = prompt("Enter new priority:");

  const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage

  try {
      const res = await fetch(`/api/tasks/tasks/${id}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` // Send token in the Authorization header
          },
          body: JSON.stringify({
              title: newTitle,
              description: newDescription,
              deadline: newDeadline,
              priority: newPriority
          })
      });
      
      if (!res.ok) {
          throw new Error('Failed to update task');
      }

      loadTasks(); // Reload tasks after update
  } catch (error) {
      console.error('Error editing task:', error);
      alert('An error occurred while editing task');
  }
}

// 5. Search Tasks
function searchTasks() {
  const query = document.getElementById('search-bar').value.toLowerCase();
  const taskList = document.getElementById('task-list');
  const tasks = taskList.getElementsByClassName('task');

  Array.from(tasks).forEach(task => {
      const taskTitle = task.querySelector('h3').textContent.toLowerCase();
      const taskDescription = task.querySelector('p').textContent.toLowerCase();

      if (taskTitle.includes(query) || taskDescription.includes(query)) {
          task.style.display = 'block';
      } else {
          task.style.display = 'none';
      }
  });
}

// 6. Filter Tasks by Priority
async function filterTasks(priority = '') {
  const token = localStorage.getItem('authToken'); // Get the JWT token from localStorage

  try {
      const res = await fetch(`/api/tasks/tasks/filter/${priority}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}` // Send token in the Authorization header
          }
      });
      
      if (!res.ok) {
          throw new Error('Failed to filter tasks');
      }

      const tasks = await res.json();

      const taskList = document.getElementById('task-list');
      taskList.innerHTML = ''; // Clear current list

      tasks.forEach(task => {
          const taskDiv = document.createElement('div');
          taskDiv.classList.add('task');
          taskDiv.innerHTML = `
              <h3>${task.title}</h3>
              <p>${task.description}</p>
              <p>Deadline: ${task.deadline}</p>
              <p>Priority: ${task.priority}</p>
              <button onclick="deleteTask(${task.id})">Delete</button>
              <button onclick="editTask(${task.id})">Edit</button>
          `;
          taskList.appendChild(taskDiv);
      });
  } catch (error) {
      console.error('Error filtering tasks:', error);
      alert('An error occurred while filtering tasks');
  }
}
