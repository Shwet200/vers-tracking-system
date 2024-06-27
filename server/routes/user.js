//const express = require('express');
//const router = express.Router();
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const db = require('../index');
//const config = require('../config');
//
//// Register user
//router.post('/register', (req, res) => {
//  const { email, password, role } = req.body;
//
//  // Check if email ends with @versogen.com
//  if (!email.endsWith('@versogen.com')) {
//    return res.status(400).json({ message: 'Only @versogen.com emails are allowed' });
//  }
//
//  // Check if the email is already registered
//  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
//  db.query(sqlCheck, [email], (err, results) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error' });
//    }
//    if (results.length > 0) {
//      return res.status(400).json({ message: 'This email is already registered. Please sign in.' });
//    }
//
//    // Hash the password and insert the new user into the database
//    bcrypt.hash(password, 10, (err, hash) => {
//      if (err) {
//        console.error('Error hashing password:', err);
//        return res.status(500).json({ message: 'Error hashing password' });
//      }
//
//      const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
//      db.query(sql, [email, hash, role], (err, result) => {
//        if (err) {
//          console.error('Database error:', err);
//          return res.status(500).json({ message: 'Database error' });
//        }
//        res.status(201).json({ message: 'User registered successfully' });
//      });
//    });
//  });
//});
//
//// Login user
//router.post('/login', (req, res) => {
//  const { email, password } = req.body;
//
//  const sql = 'SELECT * FROM users WHERE email = ?';
//  db.query(sql, [email], (err, results) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error' });
//    }
//    if (results.length === 0) {
//      return res.status(400).json({ message: 'Invalid email or password' });
//    }
//
//    const user = results[0];
//    bcrypt.compare(password, user.password, (err, isMatch) => {
//      if (err) {
//        console.error('Error comparing passwords:', err);
//        return res.status(500).json({ message: 'Error comparing passwords' });
//      }
//      if (!isMatch) {
//        return res.status(400).json({ message: 'Invalid email or password' });
//      }
//
//      const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
//      res.json({ token, role: user.role });
//    });
//  });
//});
//
//module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../index');
const config = require('../config');

// Register user (store in pending_users)
router.post('/register', (req, res) => {
  const { email, password, role } = req.body;

  // Check if email ends with @versogen.com
  if (!email.endsWith('@versogen.com')) {
    return res.status(400).json({ message: 'Only @versogen.com emails are allowed' });
  }

  // Check if the email is already registered
  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
  db.query(sqlCheck, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length > 0) {
      return res.status(400).json({ message: 'This email is already registered. Please sign in.' });
    }

    // Check if the email is already in pending_users
    const sqlPendingCheck = 'SELECT * FROM pending_users WHERE email = ?';
    db.query(sqlPendingCheck, [email], (err, pendingResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (pendingResults.length > 0) {
        return res.status(400).json({ message: 'This email is already pending approval.' });
      }

      // Hash the password and insert the new user into the pending_users table
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Error hashing password' });
        }

        const sql = 'INSERT INTO pending_users (email, password, role) VALUES (?, ?, ?)';
        db.query(sql, [email, hash, role], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
          }
          res.status(201).json({ message: 'Registration request submitted successfully. Please wait for admin approval.' });
        });
      });
    });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Error comparing passwords' });
      }
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
      res.json({ token, role: user.role });
    });
  });
});

module.exports = router;
