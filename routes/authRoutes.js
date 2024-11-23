const express = require('express');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { getUsers, addUser, findUserByEmail } = require('../db_utilities');


function isJsonObject(value) {
  return (
      typeof value === 'object' && // Check if it's an object
      value !== null &&            // Ensure it's not null
      !Array.isArray(value)        // Ensure it's not an array
  );
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = findUserByEmail(email);
    console.log("User Exists: ", userExists);

    if (isJsonObject(userExists)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;
    const newUser = addUser(username, email, password);

    res.status(200).json({ message: 'Registration successful'});
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = findUserByEmail(email);

    if (user === undefined) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // const validPassword = await bcrypt.compare(password, user.rows[0].password);
    const validPassword = password == user.password;
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { user_id: user.password, email: user.email },
      process.env.JWT_SECRET, // Use JWT secret from .env file
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
