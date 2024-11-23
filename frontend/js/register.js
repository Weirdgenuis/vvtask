document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
      // Updated URL to match the new /api/auth/register endpoint
      const res = await fetch('/api/auth/register', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (res.status === 200) {
          alert('Registration successful');
          window.location.href = 'index.html'; // Redirect to login page
      } else {
          alert(data.message);  // Show error message if registration fails
      }
  } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred during registration. Please try again.');
  }
});

