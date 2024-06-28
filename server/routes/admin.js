//const express = require('express');
//const router = express.Router();
//const db = require('../index'); // Import db connection
//const auth = require('../middleware/auth');
//
//// Fetch pending requests
//router.get('/requests/pending', (req, res) => {
//  const sql = 'SELECT * FROM test_requests WHERE status = "pending"';
//  db.query(sql, (err, results) => {
//    if (err) return res.status(500).json({ message: 'Database error', err });
//    res.json(results);
//  });
//});
//
//// Fetch accepted requests
//router.get('/requests/accepted', (req, res) => {
//  const sql = 'SELECT * FROM test_requests WHERE status = "accepted"';
//  db.query(sql, (err, results) => {
//    if (err) return res.status(500).json({ message: 'Database error', err });
//    res.json(results);
//  });
//});
//
//// Fetch test engineers
//router.get('/test-engineers', (req, res) => {
//  const sql = 'SELECT email FROM users WHERE role = "testengineer"';
//  db.query(sql, (err, results) => {
//    if (err) return res.status(500).json({ message: 'Database error', err });
//    res.json(results);
//  });
//});
//
//// Assign test to engineer and update priority status
//router.post('/requests/assign', (req, res) => {
//  const { requestId, engineerEmail, priority } = req.body;
//  const sql = 'UPDATE test_requests SET assignedTo = ?, priority = ?, status = ? WHERE id = ?';
//  db.query(sql, [engineerEmail, priority, 'assigned', requestId], (err, result) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    res.json({ message: `You have assigned test ${requestId} to ${engineerEmail}.` });
//  });
//});
//
//// Accept test request
//router.post('/requests/accept', (req, res) => {
//  const { requestId } = req.body;
//  const sql = 'UPDATE test_requests SET status = "accepted" WHERE id = ?';
//  db.query(sql, [requestId], (err, result) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    res.json({ message: `Test request ${requestId} has been accepted.` });
//  });
//});
//
//// Reject test request
//router.post('/requests/reject', (req, res) => {
//  const { requestId } = req.body;
//  const sql = 'UPDATE test_requests SET status = "rejected" WHERE id = ?';
//  db.query(sql, [requestId], (err, result) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    res.json({ message: `Test request ${requestId} has been rejected.` });
//  });
//});
//
//// Fetch all test requests
//router.get('/all-requests', auth, (req, res) => {
//  const sql = 'SELECT id, ownerEmail, assignedTo, status FROM test_requests';
//  db.query(sql, (err, results) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    console.log('All requests:', results); // Debug log
//    res.json(results);
//  });
//});
//
////User registeration process:
//// Fetch pending user registrations
//router.get('/users/pending', auth, (req, res) => {
//  const sql = 'SELECT * FROM pending_users';
//  db.query(sql, (err, results) => {
//    if (err) return res.status(500).json({ message: 'Database error', err });
//    res.json(results);
//  });
//});
//
//// Approve user registration
//router.post('/users/approve', auth, (req, res) => {
//  const { userId } = req.body;
//
//  // Fetch the pending user
//  const sqlFetch = 'SELECT * FROM pending_users WHERE id = ?';
//  db.query(sqlFetch, [userId], (err, results) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    if (results.length === 0) {
//      return res.status(404).json({ message: 'Pending user not found' });
//    }
//
//    const pendingUser = results[0];
//
//    // Insert the user into the users table
//    const sqlInsert = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
//    db.query(sqlInsert, [pendingUser.email, pendingUser.password, pendingUser.role], (insertErr) => {
//      if (insertErr) {
//        console.error('Database error:', insertErr);
//        return res.status(500).json({ message: 'Database error', insertErr });
//      }
//
//      // Delete the user from the pending_users table
//      const sqlDelete = 'DELETE FROM pending_users WHERE id = ?';
//      db.query(sqlDelete, [userId], (deleteErr) => {
//        if (deleteErr) {
//          console.error('Database error:', deleteErr);
//          return res.status(500).json({ message: 'Database error', deleteErr });
//        }
//        res.json({ message: 'User registration approved successfully' });
//      });
//    });
//  });
//});
//
//// Reject user registration
//router.post('/users/reject', auth, (req, res) => {
//  const { userId } = req.body;
//
//  const sql = 'DELETE FROM pending_users WHERE id = ?';
//  db.query(sql, [userId], (err, result) => {
//    if (err) {
//      console.error('Database error:', err);
//      return res.status(500).json({ message: 'Database error', err });
//    }
//    res.json({ message: 'User registration rejected successfully' });
//  });
//});
//
//module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../index'); // Import db connection
const auth = require('../middleware/auth');

// Middleware to disable caching
router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Fetch pending requests
router.get('/requests/pending', auth, (req, res) => {
  const sql = 'SELECT * FROM test_requests WHERE status = "pending"';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    res.json(results);
  });
});

// Fetch accepted requests
router.get('/requests/accepted', auth, (req, res) => {
  const sql = 'SELECT * FROM test_requests WHERE status = "accepted"';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    res.json(results);
  });
});

// Fetch test engineers
router.get('/test-engineers', auth, (req, res) => {
  const sql = 'SELECT email FROM users WHERE role = "testengineer"';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    res.json(results);
  });
});

// Assign test to engineer and update priority status
router.post('/requests/assign', auth, (req, res) => {
  const { requestId, engineerEmail, priority } = req.body;
  const sql = 'UPDATE test_requests SET assignedTo = ?, priority = ?, status = ? WHERE id = ?';
  db.query(sql, [engineerEmail, priority, 'assigned', requestId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.json({ message: `You have assigned test ${requestId} to ${engineerEmail}.` });
  });
});

// Accept test request
router.post('/requests/accept', auth, (req, res) => {
  const { requestId } = req.body;
  const sql = 'UPDATE test_requests SET status = "accepted" WHERE id = ?';
  db.query(sql, [requestId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.json({ message: `Test request ${requestId} has been accepted.` });
  });
});

// Reject test request
router.post('/requests/reject', auth, (req, res) => {
  const { requestId } = req.body;
  const sql = 'UPDATE test_requests SET status = "rejected" WHERE id = ?';
  db.query(sql, [requestId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.json({ message: `Test request ${requestId} has been rejected.` });
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

// Fetch pending user registrations
router.get('/users/pending', auth, (req, res) => {
  const sql = 'SELECT * FROM pending_users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });
    res.json(results);
  });
});

// Approve user registration
router.post('/users/approve', auth, (req, res) => {
  const { userId } = req.body;

  // Fetch the pending user
  const sqlFetch = 'SELECT * FROM pending_users WHERE id = ?';
  db.query(sqlFetch, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pending user not found' });
    }

    const pendingUser = results[0];

    // Insert the user into the users table
    const sqlInsert = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
    db.query(sqlInsert, [pendingUser.email, pendingUser.password, pendingUser.role], (insertErr) => {
      if (insertErr) {
        console.error('Database error:', insertErr);
        return res.status(500).json({ message: 'Database error', insertErr });
      }

      // Delete the user from the pending_users table
      const sqlDelete = 'DELETE FROM pending_users WHERE id = ?';
      db.query(sqlDelete, [userId], (deleteErr) => {
        if (deleteErr) {
          console.error('Database error:', deleteErr);
          return res.status(500).json({ message: 'Database error', deleteErr });
        }
        res.json({ message: 'User registration approved successfully' });
      });
    });
  });
});

// Reject user registration
router.post('/users/reject', auth, (req, res) => {
  const { userId } = req.body;

  const sql = 'DELETE FROM pending_users WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }
    res.json({ message: 'User registration rejected successfully' });
  });
});

module.exports = router;
