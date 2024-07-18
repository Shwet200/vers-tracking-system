const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@WebPassVers12',
  database: 'sharepoint_app'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Endpoint to upload and process Excel file
app.post('/uploadfromexcel', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    console.log('Reading workbook');
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ivSheet = workbook.Sheets['iV Summary'];
    const eisSheet = workbook.Sheets['EIS_HFR'];

    if (!ivSheet || !eisSheet) {
      return res.status(400).send('Required sheets not found');
    }

    const parseSharepointData = (ivSheet, eisSheet) => {
      const getCellValue = (sheet, cell) => {
        const cellValue = sheet[cell];
        return cellValue ? cellValue.v : null;
      };

      const b8 = getCellValue(ivSheet, 'B8');
      const i8 = getCellValue(ivSheet, 'I8');
      const b7 = getCellValue(ivSheet, 'B7');
      const i7 = getCellValue(ivSheet, 'I7');

      let closestToZeroValueDIW = Infinity;
      let closestToZeroValue10mM = Infinity;
      let hfrDiwValue = null;
      let hfr10mMValue = null;

      const range = xlsx.utils.decode_range(eisSheet['!ref']);
      for (let row = range.s.r + 1; row <= range.e.r; row++) {
        // For HFR_DIW
        const cellAddressE = xlsx.utils.encode_cell({ r: row, c: 4 });
        const cellAddressD = xlsx.utils.encode_cell({ r: row, c: 3 });
        const cellValueE = eisSheet[cellAddressE] ? eisSheet[cellAddressE].v : null;

        if (cellValueE !== null && typeof cellValueE === 'number' && Math.abs(cellValueE) < Math.abs(closestToZeroValueDIW)) {
          closestToZeroValueDIW = cellValueE;
          hfrDiwValue = eisSheet[cellAddressD] ? eisSheet[cellAddressD].v * 1000 : null;
        }

        // For HFR_10mM
        const cellAddressO = xlsx.utils.encode_cell({ r: row, c: 14 });
        const cellAddressN = xlsx.utils.encode_cell({ r: row, c: 13 });
        const cellValueO = eisSheet[cellAddressO] ? eisSheet[cellAddressO].v : null;

        if (cellValueO !== null && typeof cellValueO === 'number' && Math.abs(cellValueO) < Math.abs(closestToZeroValue10mM)) {
          closestToZeroValue10mM = cellValueO;
          hfr10mMValue = eisSheet[cellAddressN] ? eisSheet[cellAddressN].v * 1000 : null;
        }
      }

      return { i_at_1_8_10mM: i8, i_at_1_8_DIW: b8, E100_DIW: b7, E100_10mM: i7, HFR_DIW: hfrDiwValue, HFR_10mM: hfr10mMValue };
    };

    const data = parseSharepointData(ivSheet, eisSheet);

    const insertDataIntoDB = (data) => {
      const query = `INSERT INTO test_excel
                    (i_at_1_8_10mM, i_at_1_8_DIW, E100_DIW, E100_10mM, HFR_DIW, HFR_10mM)
                    VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
        data.i_at_1_8_10mM,
        data.i_at_1_8_DIW,
        data.E100_DIW,
        data.E100_10mM,
        data.HFR_DIW,
        data.HFR_10mM,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Database insertion error:', err);
          throw err;
        }
        console.log('Data inserted into DB');
      });
    };

    insertDataIntoDB(data);

    res.status(200).send('File processed and data inserted');
  } catch (err) {
    console.error('Error processing file:', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
