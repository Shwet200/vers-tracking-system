const express = require('express');
const router = express.Router();
const db = require('../index'); // Import db connection
const auth = require('../middleware/auth');

// Submit test request
router.post('/test-request', auth, (req, res) => {
  const { owner, cellCount, activeArea, projectArea, testType, cathode, anode, membrane, comments, purpose } = req.body;
  const ownerId = req.user.id; // Extracted from the token
  const ownerEmail = req.user.email; // Extracted from the token

  console.log('Test request data:', { owner, cellCount, activeArea, projectArea, testType, cathode, anode, membrane, comments, purpose, ownerId, ownerEmail }); // Debug log

  const sql = 'INSERT INTO test_requests (owner, cellCount, activeArea, projectArea, testType, cathode, anode, membrane, comments, purpose, status, created_at, ownerId, ownerEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "pending", NOW(), ?, ?)';
  db.query(sql, [owner, cellCount, activeArea, projectArea, testType, cathode, anode, membrane, comments, purpose, ownerId, ownerEmail], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.json({ id: result.insertId, message: 'Test request submitted successfully' });
  });
});

//Fetching test requests for the logged in user
router.get('/requests', auth, (req, res) => {
  const email = req.user.email;
  console.log('Fetching requests for researcher:', email); // Debug log
  const sql = 'SELECT id, status, priority, assignedTo FROM test_requests WHERE ownerEmail = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    console.log('Requests for researcher:', results); // Debug log
    res.json(results);
  });
});

// Fetch all test requests
router.get('/all-requests', auth, (req, res) => {
  const sql = 'SELECT id, ownerEmail, assignedTo, status FROM test_requests';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    console.log('All requests:', results); // Debug log
    res.json(results);
  });
});

module.exports = router;
