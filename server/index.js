const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const xlsx = require('xlsx');
const config = require('./config');
const auth = require('./middleware/auth');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS
app.use(express.json()); // If using JSON bodies //recently added this during tests/results glitch

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

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


app.use('/api/protected', auth, (req, res) => {
  res.json({ message: `Hello ${req.userRole}! You are authenticated.` });
});

// Endpoint to upload and process Excel file and log test results
app.post('/api/engineer/log-results', auth, upload.single('excelFile'), (req, res) => {
  const {
    testRequestId, testCompleted, bolPh, comments,
    hardwareNumber, testStandChannel, startDate, endDate,
    daysUnderTest, notes, scratch, membraneThickness,
    bolConductivity, kohConductivity, kohPh
  } = req.body;
  const engineerEmail = req.user.email;

  // Initialize extracted data
  let extractedData = {};

  // Process the uploaded Excel file
  if (req.file) {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ivSheet = workbook.Sheets['iV Summary'];
    const eisSheet = workbook.Sheets['EIS_HFR'];

    if (ivSheet && eisSheet) {
      const getCellValue = (sheet, cell) => {
        const cellValue = sheet[cell];
        return cellValue ? cellValue.v : null;
      };

      extractedData = {
        i_at_1_8_v_diw: getCellValue(ivSheet, 'B8'),
        i_at_1_8_v_10mM_koh: getCellValue(ivSheet, 'I8'),
        h2_xover_current_density: getCellValue(ivSheet, 'B7'),
        e_at_100mAcm2_diw: getCellValue(ivSheet, 'B6'),
        e_at_100mAcm2_10mM_koh: getCellValue(ivSheet, 'I6'),
        hfr_diw: getCellValue(eisSheet, 'D6') * 1000,
        hfr_10mM_koh: getCellValue(eisSheet, 'N6') * 1000,
        eir: getCellValue(eisSheet, 'E6'),
        q: getCellValue(eisSheet, 'F6'),
        phi: getCellValue(eisSheet, 'G6'),
        fraction_q_touching_membrane: getCellValue(eisSheet, 'H6'),
        effective_ionic_conductivity: getCellValue(eisSheet, 'I6'),
        fitting_cost_function: getCellValue(eisSheet, 'J6'),
        fit_approved_by_data_processor: getCellValue(eisSheet, 'K6'),
        column1: getCellValue(eisSheet, 'L6'),
        ionic_resistance_10mM_koh: getCellValue(eisSheet, 'M6'),
        q_int_frac_diw_10mM_koh: getCellValue(eisSheet, 'O6'),
        diw_conductivity: getCellValue(eisSheet, 'P6'),
        cell_conditions: getCellValue(eisSheet, 'Q6'),
        anode_il_loading: getCellValue(eisSheet, 'R6'),
        cathode_il_loading: getCellValue(eisSheet, 'S6'),
        e_at_100mAcm2: getCellValue(eisSheet, 'T6'),
        e_at_1Acm2: getCellValue(eisSheet, 'U6')
      };
    } else {
      return res.status(400).send('Required sheets not found');
    }
  }

  // Combine form data and extracted data
  const data = {
    testRequestId,
    engineerEmail,
    testCompleted: testCompleted ? 1 : 0,
    bolPh,
    comments,
    hardwareNumber,
    testStandChannel,
    startDate,
    endDate,
    daysUnderTest,
    notes,
    scratch,
    membraneThickness,
    bolConductivity,
    kohConductivity,
    kohPh,
    ...extractedData
  };

  // Insert test results
  const insertSql = `INSERT INTO test_results
  (testRequestId, engineerEmail, testCompleted, bolPh, comments, hardwareNumber,
  testStandChannel, startDate, endDate, daysUnderTest, notes, scratch, membraneThickness,
  bolConductivity, kohConductivity, kohPh,
  i_at_1_8_v_diw, i_at_1_8_v_10mM_koh, h2_xover_current_density, e_at_100mAcm2_diw,
  e_at_100mAcm2_10mM_koh, hfr_diw, hfr_10mM_koh, eir, q, phi, fraction_q_touching_membrane,
  effective_ionic_conductivity, fitting_cost_function, fit_approved_by_data_processor,
  column1, ionic_resistance_10mM_koh, q_int_frac_diw_10mM_koh, diw_conductivity,
  cell_conditions, anode_il_loading, cathode_il_loading, e_at_100mAcm2, e_at_1Acm2)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    data.testRequestId, data.engineerEmail, data.testCompleted, data.bolPh, data.comments, data.hardwareNumber,
    data.testStandChannel, data.startDate, data.endDate, data.daysUnderTest, data.notes, data.scratch, data.membraneThickness,
    data.bolConductivity, data.kohConductivity, data.kohPh,
    data.i_at_1_8_v_diw, data.i_at_1_8_v_10mM_koh, data.h2_xover_current_density, data.e_at_100mAcm2_diw,
    data.e_at_100mAcm2_10mM_koh, data.hfr_diw, data.hfr_10mM_koh, data.eir, data.q, data.phi, data.fraction_q_touching_membrane,
    data.effective_ionic_conductivity, data.fitting_cost_function, data.fit_approved_by_data_processor,
    data.column1, data.ionic_resistance_10mM_koh, data.q_int_frac_diw_10mM_koh, data.diw_conductivity,
    data.cell_conditions, data.anode_il_loading, data.cathode_il_loading, data.e_at_100mAcm2, data.e_at_1Acm2
  ];

  db.query(insertSql, values, (err, result) => {
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

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

