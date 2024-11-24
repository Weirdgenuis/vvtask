document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    // Update the endpoint to match your route
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // Check if the response was successful (status 200)
    if (!res.ok) {
      // If response status isn't 200, throw an error and handle it below
      const errorData = await res.json();
      console.error("Error: ", errorData);
      throw new Error(errorData.message || 'Login failed');
    }

    // If the login was successful, parse the JSON response
    const data = await res.json();
    console.log("✅✅✅ Data = ", data);

    // Store the JWT token in localStorage
    localStorage.setItem('authToken', data.token);

    // Redirect to the main page (task management)
    window.location.href = 'task.html';

  } catch (error) {
    // Log the error and display a user-friendly message
    console.error('Error logging in user:', error);
    alert(error.message || 'An error occurred. Please try again.');
  }
});
