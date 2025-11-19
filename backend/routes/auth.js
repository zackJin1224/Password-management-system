// User Registration and Login Routing
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// user registration
//POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // Retrieve data from the request body
    const { username, email, password } = req.body;

    //Required fields must be filled in
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email address, and password are all required fields.',
      });
    }
    // Check if the user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        error: 'The username or email address is already in use.',
      });
    }

    // Encrypt password
    const saltRounds = 10;
    const password_hash = await argon2.hash(password);

    // Insert a new user into the database
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password_hash]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    //Return a successful response
    res.status(201).json({
      message: 'Registration successful!',
      token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Server error. Please try again later.',
    });
  }
});

// User login
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    //Retrieve data from the request body
    const { email, password } = req.body;

    //Required fields must be filled in
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email address and password are both required fields.',
      });
    }
    // Query User
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    //Check if the user exists
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email address or password',
      });
    }

    const user = result.rows[0];

    //Verify Password
    const isValidPassword = await argon2.verify(user.password_hash, password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email address or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    //Return a successful response
    res.status(200).json({
      message: 'Login successful!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
