const xlsx = require('xlsx');
const _ = require('lodash');

// Function to determine the data type of a value
function getDataType(value) {
  if (_.isDate(value)) {
    return 'date';
  } else if (_.isNumber(value)) {
    return 'float';
  } else if (_.isBoolean(value)) {
    return 'boolean';
  } else {
    return 'string';
  }
}

// Function to read and analyze an Excel file
function analyzeExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  // Initialize a map to store column data types
  const columnDataTypes = {};

  // Iterate through each row
  rows.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      // Initialize the columns
      row.forEach((colName, colIndex) => {
        columnDataTypes[colIndex] = { name: colName, types: [] };
      });
    } else {
      // Determine the data type of each cell
      row.forEach((cell, colIndex) => {
        const dataType = getDataType(cell);
        columnDataTypes[colIndex].types.push(dataType);
      });
    }
  });

  // Determine the most common data type for each column
  Object.keys(columnDataTypes).forEach(colIndex => {
    const types = columnDataTypes[colIndex].types;
    const mostCommonType = _.chain(types)
      .countBy()
      .toPairs()
      .sortBy(1)
      .last()
      .head()
      .value();
    columnDataTypes[colIndex].mostCommonType = mostCommonType;
  });

  // Print the result
  Object.values(columnDataTypes).forEach(col => {
    console.log(`Column: ${col.name}, Most Common Type: ${col.mostCommonType}`);
  });
}

// Analyze the provided Excel file
analyzeExcel('./testing_upload.xlsx');
