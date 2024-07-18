const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3005;

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // update with your MySQL user
  password: '@WebPassVers12', // update with your MySQL password
  database: 'organization_db' // update with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL Database.');
});

app.use(bodyParser.json());

// Function to convert Excel date to JavaScript date string
function excelDateToJSDate(excelDate) {
  if (!excelDate || typeof excelDate !== 'number') {
    return null;
  }
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  const dateString = date.toISOString().split('T')[0];
  return dateString;
}

// Endpoint to upload and process Excel file
app.post('/upload-excel', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Remove the header row
  rows.shift();

  const values = rows.map(row => [
    row[0] ? row[0].toString() : null, // test_codes
    row[1] ? row[1].toString() : null, // anode
    row[2] ? row[2].toString() : null, // cathode
    row[3] ? row[3].toString() : null, // membrane
    row[4] ? row[4].toString() : null, // owner
    row[5] ? row[5].toString() : null, // hardwareNumber
    row[6] ? row[6].toString() : null, // testStandChannel
    row[7] ? excelDateToJSDate(row[7]).toString() : null, // startDate
    row[8] ? excelDateToJSDate(row[8]).toString() : null, // endDate
    row[9] ? row[9].toString() : null, // daysUnderTest
    row[10] ? row[10].toString() : null, // notes
    row[11] ? row[11].toString() : null, // baseline
    row[12] ? row[12].toString() : null, // scratch
    row[13] ? row[13].toString() : null, // membraneThickness
    row[14] ? row[14].toString() : null, // recombination_layer_thickness
    row[15] ? row[15].toString() : null, // recombination_layer_pt_loading
    row[16] ? row[16].toString() : null, // cathode_xrf_pt_loading
    row[17] ? row[17].toString() : null, // cathode_xrf_ru_loading
    row[18] ? row[18].toString() : null, // cathode_ru_pt_mass
    row[19] ? row[19].toString() : null, // anode_fe_ni
    row[20] ? row[20].toString() : null, // bolConductivity
    row[21] ? row[21].toString() : null, // bolPh
    row[22] ? row[22].toString() : null, // kohConductivity
    row[23] ? row[23].toString() : null, // kohPh
    row[24] ? row[24].toString() : null, // i_at_1_8_v_diw
    row[25] ? row[25].toString() : null, // i_at_1_8_v_10mM_koh
    row[26] ? row[26].toString() : null, // h2_xover_current_density
    row[27] ? row[27].toString() : null, // e3_n_at_20mAcm2
    row[28] ? row[28].toString() : null, // e3_tafel_slope
    row[29] ? row[29].toString() : null, // e_at_100mAcm2_diw
    row[30] ? row[30].toString() : null, // e_at_100mAcm2_10mM_koh
    row[31] ? row[31].toString() : null, // anode_icr
    row[32] ? row[32].toString() : null, // hfr_diw
    row[33] ? row[33].toString() : null, // hfr_10mM_koh
    row[34] ? row[34].toString() : null, // eir
    row[35] ? row[35].toString() : null, // q
    row[36] ? row[36].toString() : null, // phi
    row[37] ? row[37].toString() : null, // fraction_q_touching_membrane
    row[38] ? row[38].toString() : null, // effective_ionic_conductivity
    row[39] ? row[39].toString() : null, // fitting_cost_function
    row[40] ? row[40].toString() : null, // fit_approved_by_data_processor
    row[41] ? row[41].toString() : null, // column1
    row[42] ? row[42].toString() : null, // ionic_resistance_10mM_koh
    row[43] ? row[43].toString() : null, // q_int_frac_diw_10mM_koh
    row[44] ? row[44].toString() : null, // diw_conductivity
    row[45] ? row[45].toString() : null, // cell_conditions
    row[46] ? row[46].toString() : null, // anode_il_loading
    row[47] ? row[47].toString() : null, // cathode_il_loading
    row[48] ? row[48].toString() : null, // e_at_100mAcm2
    row[49] ? row[49].toString() : null, // e_at_1Acm2
    row[50] ? row[50].toString() : null, // xover_cd_at_0A_0barg
    row[51] ? row[51].toString() : null, // xover_cd_at_1Acm2_0barg
    row[52] ? row[52].toString() : null, // xover_cd_at_0A_1_5barg
    row[53] ? row[53].toString() : null // xover_cd_at_1Acm2_1_5barg
  ]);

  const insertSql = `
    INSERT INTO display_data (
      test_codes, anode, cathode, membrane, owner, hardwareNumber, testStandChannel, startDate, endDate, daysUnderTest,
      notes, baseline, scratch, membraneThickness, recombination_layer_thickness, recombination_layer_pt_loading,
      cathode_xrf_pt_loading, cathode_xrf_ru_loading, cathode_ru_pt_mass, anode_fe_ni, bolConductivity, bolPh,
      kohConductivity, kohPh, i_at_1_8_v_diw, i_at_1_8_v_10mM_koh, h2_xover_current_density, e3_n_at_20mAcm2, e3_tafel_slope,
      e_at_100mAcm2_diw, e_at_100mAcm2_10mM_koh, anode_icr, hfr_diw, hfr_10mM_koh, eir, q, phi, fraction_q_touching_membrane,
      effective_ionic_conductivity, fitting_cost_function, fit_approved_by_data_processor, column1, ionic_resistance_10mM_koh,
      q_int_frac_diw_10mM_koh, diw_conductivity, cell_conditions, anode_il_loading, cathode_il_loading, e_at_100mAcm2,
      e_at_1Acm2, xover_cd_at_0A_0barg, xover_cd_at_1Acm2_0barg, xover_cd_at_0A_1_5barg, xover_cd_at_1Acm2_1_5barg
    ) VALUES ?`;

  db.query(insertSql, [values], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ message: 'Database insertion error', err });
    }
    res.status(200).json({ message: 'Data successfully inserted', insertedRows: result.affectedRows });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
