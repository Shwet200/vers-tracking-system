require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../index');
const auth = require('../middleware/auth');
const multer = require('multer');
const xlsx = require('xlsx');
const axios = require('axios');  // Import axios

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

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

// Fetch anode data from Excel
const fetchAnodeData = async (anode) => {
  const workbook = xlsx.readFile('C:/Users/DB_User/Desktop/vers_db_system/server/Anode Electrode_PN_2023.xlsx'); // Update the path to the "anode pn guide" workbook
  const anodeRecordSheet = workbook.Sheets['Anode Record'];
  const anodeRange = xlsx.utils.decode_range(anodeRecordSheet['!ref']);
  for (let row = anodeRange.s.r + 1; row <= anodeRange.e.r; row++) {
    const cellAddressB = xlsx.utils.encode_cell({ r: row, c: 1 });
    const cellValueB = anodeRecordSheet[cellAddressB] ? anodeRecordSheet[cellAddressB].v : null;
    if (cellValueB === anode) {
      const e3_n_at_20mAcm2 = anodeRecordSheet[xlsx.utils.encode_cell({ r: row, c: 18 })] ? anodeRecordSheet[xlsx.utils.encode_cell({ r: row, c: 18 })].v : null;
      const e3_tafel_slope = anodeRecordSheet[xlsx.utils.encode_cell({ r: row, c: 19 })] ? anodeRecordSheet[xlsx.utils.encode_cell({ r: row, c: 19 })].v : null;
      return { e3_n_at_20mAcm2, e3_tafel_slope };
    }
  }
  return { e3_n_at_20mAcm2: null, e3_tafel_slope: null };
};

// Fetch anode IL loading and anode Fe:Ni from Excel
const fetchAnodeILLoading = async (anode) => {
  const workbook = xlsx.readFile('C:/Users/DB_User/Desktop/vers_db_system/server/Anode PN guide-2024.xlsx'); // Update the path to the "Anode IL Loading" workbook
  const anodePnSheet = workbook.Sheets['Anode PN'];
  const anodePnRange = xlsx.utils.decode_range(anodePnSheet['!ref']);
  for (let row = anodePnRange.s.r + 1; row <= anodePnRange.e.r; row++) {
    const cellAddressB = xlsx.utils.encode_cell({ r: row, c: 1 });
    const cellValueB = anodePnSheet[cellAddressB] ? anodePnSheet[cellAddressB].v : null;
    if (cellValueB === anode) {
      const anode_il_loading = anodePnSheet[xlsx.utils.encode_cell({ r: row, c: 17 })] ? anodePnSheet[xlsx.utils.encode_cell({ r: row, c: 17 })].v : null;
      const anode_fe_ni = anodePnSheet[xlsx.utils.encode_cell({ r: row, c: 27 })] ? anodePnSheet[xlsx.utils.encode_cell({ r: row, c: 27 })].v : null;
      return { anode_il_loading, anode_fe_ni };
    }
  }
  return { anode_il_loading: null, anode_fe_ni: null };
};

// Fetch cathode data from Excel
const fetchCathodeData = async (cathode) => {
  const workbook = xlsx.readFile('C:/Users/DB_User/Desktop/vers_db_system/server/1. EL team GDE log.xlsx'); // Update the path to the "Cathode IL Loading" workbook
  const cathodeSheet = workbook.Sheets['BenchGDE'];
  const cathodeRange = xlsx.utils.decode_range(cathodeSheet['!ref']);
  for (let row = cathodeRange.s.r + 1; row <= cathodeRange.e.r; row++) {
    const cellAddressA = xlsx.utils.encode_cell({ r: row, c: 0 });
    const cellValueA = cathodeSheet[cellAddressA] ? cathodeSheet[cellAddressA].v : null;
    if (cellValueA === cathode) {
      const cathode_il_loading = cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 21 })] ? cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 21 })].v : null;
      const cathode_xrf_pt_loading = cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 20 })] ? cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 20 })].v : null;
      const cathode_xrf_ru_loading = cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 22 })] ? cathodeSheet[xlsx.utils.encode_cell({ r: row, c: 22 })].v : null;
      const cathode_ru_pt_mass = cathode_xrf_pt_loading && cathode_xrf_ru_loading ? (cathode_xrf_ru_loading / cathode_xrf_pt_loading) : null;
      return { cathode_il_loading, cathode_xrf_pt_loading, cathode_xrf_ru_loading, cathode_ru_pt_mass };
    }
  }
  return { cathode_il_loading: null, cathode_xrf_pt_loading: null, cathode_xrf_ru_loading: null, cathode_ru_pt_mass: null };
};

// Helper function to check if a value is within a range
const isWithinRange = (value, target, range) => {
  return value >= (target - range) && value <= (target + range);
};

// Log test results and mark test as completed
router.post('/log-results', auth, upload.single('excelFile'), async (req, res) => {
  const {
    testRequestId, testCompleted, bolPh, comments,
        hardwareNumber, testStandChannel, startDate, endDate,
        daysUnderTest, notes, scratch, membraneThickness,
        bolConductivity, kohConductivity, kohPh, test_codes,
        cathode_xrf_pt_loading, cathode_xrf_ru_loading, cathode_ru_pt_mass, anode_fe_ni,
        updateAnodeFeNi, updateCathodeXrfPtLoading, updateCathodeXrfRuLoading, updateCathodeRuPtMass,
        slowPolCurveTestPerformed, recombinationLayerThickness, recombinationLayerPtLoading
  } = req.body;
  const engineerEmail = req.user.email;

  console.log(req.body);
  console.log(cathode_xrf_pt_loading, cathode_xrf_ru_loading, cathode_ru_pt_mass, anode_fe_ni,
                  updateAnodeFeNi, updateCathodeXrfPtLoading, updateCathodeXrfRuLoading);

  // Ensuring slowPolCurveTestPerformed is interpreted as a boolean
    const isSlowPolCurveTestPerformed = (slowPolCurveTestPerformed === 'true' || slowPolCurveTestPerformed === true);
    console.log('isSlowPolCurveTestPerformed:', isSlowPolCurveTestPerformed);

  // Fetch anode and cathode numbers from test_requests table
  let anode, cathode;
  try {
    const result = await new Promise((resolve, reject) => {
      const sql = 'SELECT anode, cathode FROM test_requests WHERE id = ?';
      db.query(sql, [testRequestId], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });
    anode = result.anode;
    cathode = result.cathode;
  } catch (error) {
    console.error('Error fetching anode and cathode numbers:', error);
    return res.status(500).json({ message: 'Error fetching anode and cathode numbers', error });
  }

  // Fetch anode data from Excel
  const anodeData = await fetchAnodeData(anode);

  // Fetch anode IL loading data from Excel
  const anodeILLoadingData = await fetchAnodeILLoading(anode);

  // Fetch cathode IL loading data from Excel
  const cathodeData = await fetchCathodeData(cathode);

  // Initialize extracted data
  let extractedData = {};

  // Initialize variables for X_over_*
  let X_over_02, X_over_1, X_over_2, X_over_1_back, X_over_02_back;

  // Process the uploaded Excel file
  if (req.file) {
    console.log('Reading workbook');
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const ivSheet = workbook.Sheets['iV Summary'];
    const eisSheet = workbook.Sheets['EIS_HFR'];
    const h2CrossoverSheet = workbook.Sheets['H2 Crossover'];
    const eis1VSheet = workbook.Sheets['EIS_1 V'];
    const slowPolCurveSheet = workbook.Sheets['Slow pol curve'];

    if (!ivSheet || !eisSheet || !h2CrossoverSheet || !eis1VSheet || !slowPolCurveSheet) {
      return res.status(400).send('Required sheets not found');
    }

    const parseSharepointData = (ivSheet, eisSheet, h2CrossoverSheet, eis1VSheet, slowPolCurveSheet) => {
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

      const eisRange = xlsx.utils.decode_range(eisSheet['!ref']);
      for (let row = eisRange.s.r + 1; row <= eisRange.e.r; row++) {
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

      // Define the function to get average values
      const calculateAverage = (values) => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
      };

      // Define the function to find values in a column within a range
            const findNthValueInColumn = (sheet, column, targetValue, occurrence, range) => {
              const rangeDecoded = xlsx.utils.decode_range(sheet['!ref']);
              let count = 0;
              for (let row = rangeDecoded.s.r + 1; row <= rangeDecoded.e.r; row++) {
                const cellAddress = xlsx.utils.encode_cell({ r: row, c: column });
                const cellValue = sheet[cellAddress] ? parseFloat(sheet[cellAddress].v) : null;

                if (cellValue !== null && isWithinRange(cellValue, targetValue, range)) {
                  count++;
                  if (count === occurrence) {
                    console.log(`Found target value ${targetValue} within range for the ${occurrence} time in row ${row + 1}`);
                    return row;
                  }
                }
              }
              console.log(`Target value ${targetValue} not found ${occurrence} times within range in column ${xlsx.utils.encode_col(column)}`);
              return null;
            };

            if (isSlowPolCurveTestPerformed) {
              console.log('Executing Slow Pol Curve logic');
              // Logic for Slow pol curve sheet
              const rowFor0_2 = findNthValueInColumn(slowPolCurveSheet, 26, 0.2, 1, 0.01);
              const rowFor1 = findNthValueInColumn(slowPolCurveSheet, 26, 1, 1, 0.01);
              const rowFor2 = findNthValueInColumn(slowPolCurveSheet, 26, 2, 1, 0.01);
              const rowFor1_back = findNthValueInColumn(slowPolCurveSheet, 26, 1, 2, 0.01);
              const rowFor0_2_back = findNthValueInColumn(slowPolCurveSheet, 26, 0.2, 2, 0.01);

              X_over_02 = rowFor0_2 !== null ? getCellValue(slowPolCurveSheet, `AD${rowFor0_2 + 1}`) : null;
              X_over_1 = rowFor1 !== null ? getCellValue(slowPolCurveSheet, `AD${rowFor1 + 1}`) : null;
              X_over_2 = rowFor2 !== null ? getCellValue(slowPolCurveSheet, `AD${rowFor2 + 1}`) : null;
              X_over_1_back = rowFor1_back !== null ? getCellValue(slowPolCurveSheet, `AD${rowFor1_back + 1}`) : null;
              X_over_02_back = rowFor0_2_back !== null ? getCellValue(slowPolCurveSheet, `AD${rowFor0_2_back + 1}`) : null;
            }else {

            console.log('Executing H2 Crossover logic');
            // H2 Crossover Sheet Parsing Logic
            const columnEIdx = 4;  // 'Current Density(A/cm2)' corresponds to index 4
            const columnLIdx = 11;  // 'Crossover Current Density (mA/cm2)' corresponds to index 11

            const findValuesInRange = (sheet, startIdx, lowerBound, upperBound, stopBelow, stopAbove) => {
              const valuesInRange = [];
              const range = xlsx.utils.decode_range(sheet['!ref']);
              for (let idx = startIdx; idx <= range.e.r; idx++) {
                const cellAddressE = xlsx.utils.encode_cell({ r: idx, c: columnEIdx });
                const cellAddressF = xlsx.utils.encode_cell({ r: idx, c: columnLIdx });
                const valueE = sheet[cellAddressE] ? parseFloat(sheet[cellAddressE].v) : null;
                if (isNaN(valueE)) continue;
                if (lowerBound <= valueE && valueE <= upperBound) {
                  valuesInRange.push([sheet[cellAddressF] ? parseFloat(sheet[cellAddressF].v) : null, idx]);
                }
                if (valuesInRange.length >= 3 && (valueE < stopBelow || valueE > stopAbove)) {
                  break;
                }
              }
              return valuesInRange.slice(-3);
            };

            let rowNumbersFirst, rowNumbersSecond, rowNumbersThird, rowNumbersFourth, rowNumbersFinal;

            const search0_2 = () => {
              rowNumbersFirst = findValuesInRange(h2CrossoverSheet, 0, 0.195, 0.205, 0.195, 0.205);
              if (rowNumbersFirst.length < 3) {
                console.log("Less than 3 values found in the first search within the specified range");
              } else {
                const correspondingValuesFirst = rowNumbersFirst.map(val => val[0]);
                X_over_02 = calculateAverage(correspondingValuesFirst);
                rowNumbersFirst = rowNumbersFirst.map(val => val[1]);
                console.log("First search results:");
                console.log("Corresponding values:", correspondingValuesFirst);
                console.log("Row numbers:", rowNumbersFirst);
              }
            };

            const search1 = () => {
              if (rowNumbersFirst && rowNumbersFirst.length > 0) {
                const startIdx = rowNumbersFirst[rowNumbersFirst.length - 1] + 1;
                rowNumbersSecond = findValuesInRange(h2CrossoverSheet, startIdx, 0.975, 1.025, 0.975, 1.025);
                if (rowNumbersSecond.length < 3) {
                  console.log("Less than 3 values found for the second target value within the specified range");
                } else {
                  const correspondingValuesSecond = rowNumbersSecond.map(val => val[0]);
                  X_over_1 = calculateAverage(correspondingValuesSecond);
                  rowNumbersSecond = rowNumbersSecond.map(val => val[1]);
                  console.log("Second search results:");
                  console.log("Corresponding values:", correspondingValuesSecond);
                  console.log("Row numbers:", rowNumbersSecond);
                }
              }
            };

            const search2 = () => {
              if (rowNumbersSecond && rowNumbersSecond.length > 0) {
                const startIdx = rowNumbersSecond[rowNumbersSecond.length - 1] + 1;
                rowNumbersThird = findValuesInRange(h2CrossoverSheet, startIdx, 1.975, 2.025, 1.975, 2.025);
                if (rowNumbersThird.length < 3) {
                  console.log("Less than 3 values found in the third search within the specified range");
                } else {
                  const correspondingValuesThird = rowNumbersThird.map(val => val[0]);
                  X_over_2 = calculateAverage(correspondingValuesThird);
                  rowNumbersThird = rowNumbersThird.map(val => val[1]);
                  console.log("Third search results:");
                  console.log("Corresponding values:", correspondingValuesThird);
                  console.log("Row numbers:", rowNumbersThird);
                }
              }
            };

            const searchAgain = () => {
              if (rowNumbersThird && rowNumbersThird.length > 0) {
                const startIdx = rowNumbersThird[rowNumbersThird.length - 1] + 1;
                rowNumbersFourth = findValuesInRange(h2CrossoverSheet, startIdx, 0.975, 1.025, 0.975, 1.025);
                if (rowNumbersFourth.length < 3) {
                  console.log("Less than 3 values found in the fourth search within the specified range");
                } else {
                  const correspondingValuesFourth = rowNumbersFourth.map(val => val[0]);
                  X_over_1_back = calculateAverage(correspondingValuesFourth);
                  rowNumbersFourth = rowNumbersFourth.map(val => val[1]);
                  console.log("Fourth search results:");
                  console.log("Corresponding values:", correspondingValuesFourth);
                  console.log("Row numbers:", rowNumbersFourth);
                }
              }
            };

            const finalSearch = () => {
              if (rowNumbersFourth && rowNumbersFourth.length > 0) {
                const startIdx = rowNumbersFourth[rowNumbersFourth.length - 1] + 1;
                rowNumbersFinal = findValuesInRange(h2CrossoverSheet, startIdx, 0.195, 0.205, 0.195, 0.205);
                if (rowNumbersFinal.length < 3) {
                  console.log("Less than 3 values found in the final search within the specified range");
                } else {
                  const correspondingValuesFinal = rowNumbersFinal.map(val => val[0]);
                  X_over_02_back = calculateAverage(correspondingValuesFinal);
                  rowNumbersFinal = rowNumbersFinal.map(val => val[1]);
                  console.log("Final search results:");
                  console.log("Corresponding values:", correspondingValuesFinal);
                  console.log("Row numbers:", rowNumbersFinal);
                }
              }
            };

            // Execute the search functions
            search0_2();
            search1();
            search2();
            searchAgain();
            finalSearch();

            console.log("X_over_02:", X_over_02);
            console.log("X_over_1:", X_over_1);
            console.log("X_over_2:", X_over_2);
            console.log("X_over_1_back:", X_over_1_back);
            console.log("X_over_02_back:", X_over_02_back);
      }

      //Logic for E @ 1mA
      let closestToOneDIW = Infinity;
      let e_at_1_mA_DIW = null;

      let closestToOne10mM = Infinity;
      let e_at_1_mA_10mM = null;

      const ivRange = xlsx.utils.decode_range(ivSheet['!ref']);
      for (let row = ivRange.s.r + 1; row <= ivRange.e.r; row++) {
        const cellAddressC = xlsx.utils.encode_cell({ r: row, c: 2 });
        const cellAddressD = xlsx.utils.encode_cell({ r: row, c: 3 });
        const cellValueC = ivSheet[cellAddressC] ? ivSheet[cellAddressC].v * 1000 : null;

        if (cellValueC !== null && typeof cellValueC === 'number' && Math.abs(cellValueC - 1) < Math.abs(closestToOneDIW - 1)) {
          closestToOneDIW = cellValueC;
          e_at_1_mA_DIW = ivSheet[cellAddressD] ? ivSheet[cellAddressD].v : null;
        }

        const cellAddressJ = xlsx.utils.encode_cell({ r: row, c: 9 });
        const cellAddressK = xlsx.utils.encode_cell({ r: row, c: 10 });
        const cellValueJ = ivSheet[cellAddressJ] ? ivSheet[cellAddressJ].v * 1000 : null;

        if (cellValueJ !== null && typeof cellValueJ === 'number' && Math.abs(cellValueJ - 1) < Math.abs(closestToOne10mM - 1)) {
          closestToOne10mM = cellValueJ;
          e_at_1_mA_10mM = ivSheet[cellAddressK] ? ivSheet[cellAddressK].v : null;
        }
      }

      return {
        i_at_1_8_10mM: i8,
        i_at_1_8_DIW: b8,
        E100_DIW: b7,
        E100_10mM: i7,
        HFR_DIW: hfrDiwValue,
        HFR_10mM: hfr10mMValue,
        fraction_q_touching_membrane: getCellValue(eis1VSheet, 'H6'),
        q_int_frac_diw_10mM_koh: getCellValue(eis1VSheet, 'R6'),
        q: getCellValue(eis1VSheet, 'H4'),
        phi: getCellValue(eis1VSheet, 'H5'),
        eir: getCellValue(eis1VSheet, 'H3'),
        effective_ionic_conductivity: getCellValue(eis1VSheet, 'H9'),
        e_at_1_mA_DIW: e_at_1_mA_DIW,
        e_at_1_mA_10mM: e_at_1_mA_10mM,
        X_over_02: X_over_02,
        X_over_1: X_over_1,
        X_over_2: X_over_2,
        X_over_1_back: X_over_1_back,
        X_over_02_back: X_over_02_back
      };
    };

    extractedData = parseSharepointData(ivSheet, eisSheet, h2CrossoverSheet, eis1VSheet, slowPolCurveSheet);
  }

  // Calculate cathode_ru_pt_mass based on updated values
      const cathodePtLoading = updateCathodeXrfPtLoading === 'yes' ? parseFloat(cathode_xrf_pt_loading) : parseFloat(cathodeData.cathode_xrf_pt_loading);
      const cathodeRuLoading = updateCathodeXrfRuLoading === 'yes' ? parseFloat(cathode_xrf_ru_loading) : parseFloat(cathodeData.cathode_xrf_ru_loading);
      const calculatedCathodeRuPtMass = cathodeRuLoading / (cathodePtLoading || 1);

  // Combine form data, guide data and extracted data
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
    test_codes,
    recombinationLayerThickness: recombinationLayerThickness || 'N/A',
    recombinationLayerPtLoading: recombinationLayerPtLoading || 'N/A',
    e_at_1_mA_DIW: extractedData.e_at_1_mA_DIW,
    e_at_1_mA_10mM: extractedData.e_at_1_mA_10mM,
//    cathode_xrf_pt_loading: updateCathodeXrfPtLoading === 'no' ? cathodeData.cathode_xrf_pt_loading : cathode_xrf_pt_loading || cathodeData.cathode_xrf_pt_loading,
//    cathode_xrf_ru_loading: updateCathodeXrfRuLoading === 'no' ? cathodeData.cathode_xrf_ru_loading : cathode_xrf_ru_loading || cathodeData.cathode_xrf_ru_loading,
//    cathode_ru_pt_mass: updateCathodeXrfPtLoading === 'no' && updateCathodeXrfRuLoading === 'no' ? cathodeData.cathode_ru_pt_mass : cathode_ru_pt_mass || cathodeData.cathode_ru_pt_mass,
//    anode_fe_ni: updateAnodeFeNi === 'no' ? anodeILLoadingData.anode_fe_ni : anode_fe_ni || anodeILLoadingData.anode_fe_ni,
    cathode_xrf_pt_loading: updateCathodeXrfPtLoading === 'yes' ? parseFloat(cathode_xrf_pt_loading) : cathodeData.cathode_xrf_pt_loading,
    cathode_xrf_ru_loading: updateCathodeXrfRuLoading === 'yes' ? parseFloat(cathode_xrf_ru_loading) : cathodeData.cathode_xrf_ru_loading,
    cathode_ru_pt_mass: updateCathodeRuPtMass === 'yes' ? parseFloat(cathode_ru_pt_mass) : cathodeData.cathode_ru_pt_mass,
    anode_fe_ni: updateAnodeFeNi === 'yes' ? parseFloat(anode_fe_ni) : anodeILLoadingData.anode_fe_ni,
    X_over_02,
    X_over_1,
    X_over_2,
    X_over_1_back,
    X_over_02_back,
    ...extractedData,
    ...anodeData,
    ...anodeILLoadingData,
    ...cathodeData,
  };

  console.log("Data to be inserted into test_results:", data);

  // Insert test results
  const insertSql = `INSERT INTO test_results
  (testRequestId, engineerEmail, testCompleted, bolPh, comments, hardwareNumber,
  testStandChannel, startDate, endDate, daysUnderTest, notes, scratch, membraneThickness,
  bolConductivity, kohConductivity, kohPh, test_codes, cathode_xrf_pt_loading, cathode_xrf_ru_loading,
  cathode_ru_pt_mass, anode_fe_ni,
  i_at_1_8_v_diw, i_at_1_8_v_10mM_koh, e_at_100mAcm2_diw,
  e_at_100mAcm2_10mM_koh, hfr_diw, hfr_10mM_koh, eir, q, phi, fraction_q_touching_membrane,
  effective_ionic_conductivity, q_int_frac_diw_10mM_koh, anode_il_loading, cathode_il_loading,
  e_at_100mAcm2, e_at_1Acm2, e3_n_at_20mAcm2, e3_tafel_slope, X_over_02,
  X_over_1, X_over_2, X_over_1_back, X_over_02_back, recombinationLayerThickness, recombinationLayerPtLoading,
  e_at_1_mA_DIW, e_at_1_mA_10mM, loggedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

  const values = [
    data.testRequestId, data.engineerEmail, data.testCompleted, data.bolPh, data.comments, data.hardwareNumber,
    data.testStandChannel, data.startDate, data.endDate, data.daysUnderTest, data.notes, data.scratch, data.membraneThickness,
    data.bolConductivity, data.kohConductivity, data.kohPh, data.test_codes, data.cathode_xrf_pt_loading, data.cathode_xrf_ru_loading,
    data.cathode_ru_pt_mass, data.anode_fe_ni,
    data.i_at_1_8_DIW, data.i_at_1_8_10mM, data.E100_DIW,
    data.E100_10mM, data.HFR_DIW, data.HFR_10mM, data.eir, data.q, data.phi, data.fraction_q_touching_membrane,
    data.effective_ionic_conductivity, data.q_int_frac_diw_10mM_koh, data.anode_il_loading, data.cathode_il_loading,
    data.e_at_100mAcm2, data.e_at_1Acm2, data.e3_n_at_20mAcm2, data.e3_tafel_slope,
    data.X_over_02, data.X_over_1, data.X_over_2, data.X_over_1_back, data.X_over_02_back, data.recombinationLayerThickness, data.recombinationLayerPtLoading,
    data.e_at_1_mA_DIW, data.e_at_1_mA_10mM
  ];

  db.query(insertSql, values, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', err });
    }

    // After inserting into test_results, insert into display_data
    const displayDataSql = `
      INSERT INTO display_data (
        test_codes, anode, cathode, membrane, owner, hardwareNumber, testStandChannel, startDate, endDate,
        daysUnderTest, notes, baseline, scratch, membraneThickness, recombination_layer_thickness,
        recombination_layer_pt_loading, cathode_xrf_pt_loading, cathode_xrf_ru_loading, cathode_ru_pt_mass,
        anode_fe_ni, bolConductivity, bolPh, kohConductivity, kohPh, i_at_1_8_v_diw, i_at_1_8_v_10mM_koh,
        e3_n_at_20mAcm2, e3_tafel_slope, e_at_100mAcm2_diw, e_at_100mAcm2_10mM_koh,
        hfr_diw, hfr_10mM_koh, eir, q, phi, fraction_q_touching_membrane, effective_ionic_conductivity,
        q_int_frac_diw_10mM_koh, anode_il_loading, cathode_il_loading,
        e_at_100mAcm2, e_at_1Acm2, xover_cd_at_0A_0barg, xover_cd_at_1Acm2_0barg, xover_cd_at_0A_1_5barg, xover_cd_at_1Acm2_1_5barg
      )
      SELECT
        trr.test_codes, tr.anode, tr.cathode, tr.membrane, tr.owner, trr.hardwareNumber, trr.testStandChannel, trr.startDate, trr.endDate,
        trr.daysUnderTest, trr.notes, tr.baseline, trr.scratch, trr.membraneThickness, trr.recombination_layer_thickness,
        trr.recombination_layer_pt_loading, trr.cathode_xrf_pt_loading, trr.cathode_xrf_ru_loading, trr.cathode_ru_pt_mass,
        trr.anode_fe_ni, trr.bolConductivity, trr.bolPh, trr.kohConductivity, trr.kohPh, trr.i_at_1_8_v_diw, trr.i_at_1_8_v_10mM_koh,
        trr.e3_n_at_20mAcm2, trr.e3_tafel_slope, trr.e_at_100mAcm2_diw, trr.e_at_100mAcm2_10mM_koh,
        trr.hfr_diw, trr.hfr_10mM_koh, trr.eir, trr.q, trr.phi, trr.fraction_q_touching_membrane, trr.effective_ionic_conductivity,
        trr.q_int_frac_diw_10mM_koh, trr.anode_il_loading, trr.cathode_il_loading,
        trr.e_at_100mAcm2, trr.e_at_1Acm2, trr.xover_cd_at_0A_0barg, trr.xover_cd_at_1Acm2_0barg, trr.xover_cd_at_0A_1_5barg, trr.xover_cd_at_1Acm2_1_5barg
      FROM
        test_requests tr
      JOIN test_results trr ON tr.id = trr.testRequestId
      WHERE
        trr.testRequestId = ?;
      `;

    const displayDataValues = [data.testRequestId];

    db.query(displayDataSql, displayDataValues, (displayErr) => {
      if (displayErr) {
        console.error('Database error inserting into display_data:', displayErr);
        return res.status(500).json({ message: 'Database error inserting into display_data', displayErr });
      }

      // Update test_requests to mark as completed
      const updateSql = 'UPDATE test_requests SET status = "completed" WHERE id = ?';
      db.query(updateSql, [testRequestId], (updateErr) => {
        if (updateErr) {
          console.error('Database error updating test_requests:', updateErr);
          return res.status(500).json({ message: 'Database error updating test_requests', updateErr });
        }

        res.json({ message: 'Test results logged, test marked as completed, and data populated in display_data', id: result.insertId });
      });
    });
  });
});

router.get('/completed-tests', auth, (req, res) => {
  const sql = `
    SELECT
      test_codes,
      anode,
      cathode,
      membrane,
      owner,
      baseline,
      hardwareNumber,
      testStandChannel,
      startDate,
      endDate,
      daysUnderTest,
      notes,
      scratch,
      membraneThickness,
      bolConductivity,
      bolPh,
      kohConductivity,
      kohPh,
      recombination_layer_thickness,
      recombination_layer_pt_loading,
      cathode_xrf_pt_loading,
      cathode_xrf_ru_loading,
      cathode_ru_pt_mass,
      anode_fe_ni,
      e3_n_at_20mAcm2,
      e3_tafel_slope,
      i_at_1_8_v_diw,
      i_at_1_8_v_10mM_koh,
      e_at_100mAcm2_diw,
      e_at_100mAcm2_10mM_koh,
      hfr_diw,
      hfr_10mM_koh,
      eir,
      q,
      phi,
      fraction_q_touching_membrane,
      effective_ionic_conductivity,
      q_int_frac_diw_10mM_koh,
      anode_il_loading,
      cathode_il_loading,
      e_at_100mAcm2,
      e_at_1Acm2,
      xover_cd_at_0A_0barg,
      xover_cd_at_1Acm2_0barg,
      xover_cd_at_0A_1_5barg,
      xover_cd_at_1Acm2_1_5barg
    FROM display_data
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