// password management routing
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all passwords of current user
//GET /api/passwords
router.get('/', authenticateToken, async (req, res) => {
  try {
    // get user id from req.user
    const userId = req.user.userId;

    //query all passwords records of current user
    const result = await pool.query(
      'SELECT id, site_name, site_url, username, encrypted_password, created_at, updated_at FROM passwords WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    //return to the result
    res.status(200).json({
      count: result.rows.length,
      passwords: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving password list:', error);
    res.status(500).json({
      error: 'Server error. Please try again later.',
    });
  }
});

// add new password
//POST /api/passwords
router.post('/', authenticateToken, async (req, res) => {
  try {
    //get data
    const userId = req.user.userId;
    const { site_name, site_url, username, encrypted_password } = req.body;

    // authenticate not null
    if (!site_name || !encrypted_password) {
      return res.status(400).json({
        error: 'Site name and password cannot be null',
      });
    }

    // insert new password record
    const result = await pool.query(
      'INSERT INTO passwords (user_id, site_name, site_url, username, encrypted_password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        userId,
        site_name,
        site_url || null,
        username || null,
        encrypted_password,
      ]
    );

    const newPassword = result.rows[0];

    // return to the success response
    res.status(201).json({
      message: 'Password added successfully',
      password: newPassword,
    });
  } catch (error) {
    console.error('Password added error', error);
    res.status(500).json({
      error: 'Server error, please try again later',
    });
  }
});
//get single password detail
//GET /api/passwords/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordId = req.params.id;

    const result = await pool.query(
      'SELECT * FROM passwords WHERE id = $1 AND user_id = $2',
      [passwordId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Password entry does not exist or lacks access permission.',
      });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get password detail error', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// update password
//PUT /api/passwords/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordId = req.params.id;
    const { site_name, site_url, username, encrypted_password } = req.body;

    // authenticate the not null
    if (!site_name || !encrypted_password) {
      return res.status(400).json({
        error: 'Site name and password cannot be null',
      });
    }

    //Verify that the password record exists and belongs to the current user
    const checkResult = await pool.query(
      'SELECT * FROM passwords WHERE id = $1 AND user_id = $2',
      [passwordId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Password entry does not exist or lacks access permission.',
      });
    }
    // update the password record
    const result = await pool.query(
      'UPDATE passwords SET site_name = $1, site_url = $2, username = $3, encrypted_password = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
      [
        site_name,
        site_url || null,
        username || null,
        encrypted_password,
        passwordId,
        userId,
      ]
    );
    res.status(200).json({
      message: 'Password updated successfully',
      password: result.rows[0],
    });
  } catch (error) {
    console.error('Password updated error', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});
//delete password
//DELETE /api/passwords/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const passwordId = req.params.id;

    //Verify that the password record exists and belongs to the current user
    const checkResult = await pool.query(
      'SELECT * FROM passwords WHERE id = $1 AND user_id = $2',
      [passwordId, userId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Password entry does not exist or lacks access permission.',
      });
    }
    //delete password record
    await pool.query('DELETE FROM passwords WHERE id = $1 AND user_id = $2', [
      passwordId,
      userId,
    ]);
    res.status(200).json({
      message: 'Password deleted successfully',
    });
  } catch (error) {
    console.error('Password deleted error', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});
module.exports = router;
