const express = require('express');
const router = express.Router();
const db = require('../index');
const auth = require('../middleware/auth');

// Fetch tests assigned to the logged-in test engineer
router.get('/tests', auth, (req, res) => {
  const email = req.user.email;
  console.log('Fetching tests for:', email); // Debug log
  const sql = 'SELECT * FROM test_requests WHERE assignedTo = ? AND status = "assigned"';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    console.log('Assigned tests:', results); // Debug log
    res.json(results);
  });
});

// Fetch specific test details
router.get('/tests/:id', auth, (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM test_requests WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Test request not found' });
    }
    res.json(result[0]);
  });
});

// Log test results and mark test as completed
router.post('/log-results', auth, (req, res) => {
  const { testRequestId, testCompleted, bolPh, comments } = req.body;
  const engineerEmail = req.user.email;

  // Insert test results
  const insertSql = 'INSERT INTO test_results (testRequestId, engineerEmail, testCompleted, bolPh, comments) VALUES (?, ?, ?, ?, ?)';
  db.query(insertSql, [testRequestId, engineerEmail, testCompleted, bolPh, comments], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }

    // Update test_requests to mark as completed
    const updateSql = 'UPDATE test_requests SET status = "completed" WHERE id = ?';
    db.query(updateSql, [testRequestId], (updateErr) => {
      if (updateErr) {
        console.error('Database error:', updateErr);
        return res.status(500).json({ message: 'Database error', updateErr });
      }

      res.json({ message: 'Test results logged and test marked as completed', id: result.insertId });
    });
  });
});

// Fetch completed tests with joined data
router.get('/completed-tests', auth, (req, res) => {
  const sql = `
    SELECT
      tr.id,
      tr.owner,
      tr.cellCount,
      tr.activeArea,
      tr.projectArea,
      tr.testType,
      tr.cathode,
      tr.anode,
      tr.membrane,
      tr.comments as requestComments,
      tr.purpose,
      tr.status,
      tr.created_at,
      tr.assignedTo,
      tr.priority,
      ts.engineerEmail,
      ts.testCompleted,
      ts.bolPh,
      ts.comments as resultComments,
      ts.loggedAt
    FROM test_requests tr
    JOIN test_results ts ON tr.id = ts.testRequestId
    WHERE tr.status = 'completed';
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.setHeader('Cache-Control', 'no-store'); // Add this line to disable caching
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
