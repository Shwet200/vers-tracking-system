const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const config = require('./config');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Database Connection
const db = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Database.');
});

module.exports = db; // Export db connection for use in other files

// Routes
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');
const researcherRoutes = require('./routes/researcher');
const engineerRoutes = require('./routes/testengineer');
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/researcher', researcherRoutes);
app.use('/api/engineer', engineerRoutes);

const auth = require('./middleware/auth');
app.use('/api/protected', auth, (req, res) => {
  res.json({ message: `Hello ${req.userRole}! You are authenticated.` });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
