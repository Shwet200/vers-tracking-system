////import React, { useState, useEffect } from 'react';
////import { useTable, useRowSelect } from 'react-table';
////import axios from 'axios';
////import { Button, Input, Checkbox, Modal } from 'semantic-ui-react';
////
////const LogResultsGrid = () => {
////  const [testResults, setTestResults] = useState([]);
////  const [message, setMessage] = useState('');
////  const [testDetails, setTestDetails] = useState({});
////  const [modalOpen, setModalOpen] = useState(false);
////  const [selectedTestDetails, setSelectedTestDetails] = useState(null);
////  const [modalPosition, setModalPosition] = useState({});
////
////  useEffect(() => {
////    const fetchTests = async () => {
////      try {
////        const response = await axios.get('/api/engineer/tests', {
////          headers: { Authorization: localStorage.getItem('token') }
////        });
////        setTestResults(response.data);
////        console.log('Fetched in-progress or assigned test results:', response.data); // Debug log
////      } catch (error) {
////        console.error('Error fetching test details:', error);
////        setMessage('Error fetching test details. Please try again.');
////      }
////    };
////
////    fetchTests();
////  }, []);
////
////  useEffect(() => {
////    const calculateDaysUnderTest = () => {
////      const updatedResults = testResults.map(test => {
////        const startDate = new Date(test.startDate);
////        const endDate = new Date(test.endDate);
////        if (!isNaN(startDate) && !isNaN(endDate)) {
////          const diffTime = Math.abs(endDate - startDate);
////          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
////          return { ...test, daysUnderTest: diffDays };
////        }
////        return { ...test, daysUnderTest: '' };
////      });
////      setTestResults(updatedResults);
////    };
////
////    calculateDaysUnderTest();
////  }, [testResults]);
////
////  const fetchTestDetails = async (id, event) => {
////    try {
////      const response = await axios.get(`/api/engineer/tests/${id}`, {
////        headers: { Authorization: localStorage.getItem('token') }
////      });
////      console.log('Fetched test details for ID:', id, response.data); // Debug log
////      setTestDetails(prevDetails => ({ ...prevDetails, [id]: response.data }));
////      setSelectedTestDetails(response.data);
////
////      // Calculate modal position
////      const modalWidth = 300;
////      const modalHeight = 200;
////      const padding = 10;
////
////      let top = event.clientY;
////      let left = event.clientX;
////
////      if (top + modalHeight + padding > window.innerHeight) {
////        top = window.innerHeight - modalHeight - padding;
////      }
////      if (left + modalWidth + padding > window.innerWidth) {
////        left = window.innerWidth - modalWidth - padding;
////      }
////
////      setModalPosition({ top, left });
////      setModalOpen(true);
////    } catch (error) {
////      console.error('Error fetching test details:', error);
////    }
////  };
////
////  const handleInputChange = (e, index, columnId) => {
////    const updatedResults = [...testResults];
////    updatedResults[index] = { ...updatedResults[index], [columnId]: e.target.value };
////    setTestResults(updatedResults);
////  };
////
////  const handleCheckboxChange = (value, index, columnId) => {
////    const updatedResults = [...testResults];
////    updatedResults[index] = { ...updatedResults[index], [columnId]: value };
////    setTestResults(updatedResults);
////  };
////
////  const handleFileChange = (e, index) => {
////    const updatedResults = [...testResults];
////    updatedResults[index] = { ...updatedResults[index], excelFile: e.target.files[0] };
////    setTestResults(updatedResults);
////  };
////
////  const handleSave = async (index) => {
////    const testResult = testResults[index];
////    try {
////      await axios.post('/api/engineer/update-status', {
////        testRequestId: testResult.id,
////        status: 'in-progress',
////      }, {
////        headers: {
////          Authorization: localStorage.getItem('token'),
////        },
////      });
////      setMessage('Test status updated to in-progress');
////    } catch (error) {
////      console.error('Error updating test status:', error);
////      setMessage('Error updating test status. Please try again.');
////    }
////  };
////
////  const handleComplete = async (index) => {
////    const formData = new FormData();
////    const testResult = testResults[index];
////
////    Object.keys(testResult).forEach((key) => {
////      if (testResult[key] instanceof File) {
////        formData.append(key, testResult[key]);
////      } else {
////        formData.append(key, testResult[key] || 'N/A');
////      }
////    });
////
////    try {
////      const response = await axios.post('/api/engineer/log-results', formData, {
////        headers: {
////          'Content-Type': 'multipart/form-data',
////          Authorization: localStorage.getItem('token'),
////        },
////      });
////      setMessage(response.data.message);
////    } catch (error) {
////      console.error('Error logging results:', error);
////      setMessage('Error logging results. Please try again.');
////    }
////  };
////
////  const columns = React.useMemo(
////    () => [
////      {
////        Header: 'Test ID',
////        accessor: 'id',
////        Cell: ({ value }) => (
////          <div>
////            <span
////              onClick={(e) => fetchTestDetails(value, e)}
////              style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
////            >
////              {value}
////            </span>
////          </div>
////        ),
////      },
////      {
////        Header: 'Test Code',
////        accessor: 'test_codes',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'test_codes')}
////          />
////        ),
////      },
////      {
////        Header: 'Hardware Number',
////        accessor: 'hardwareNumber',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'hardwareNumber')}
////          />
////        ),
////      },
////      {
////        Header: 'Test Stand Channel',
////        accessor: 'testStandChannel',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'testStandChannel')}
////          />
////        ),
////      },
////      {
////        Header: 'Days Under Test',
////        accessor: 'daysUnderTest',
////        Cell: ({ value }) => (
////          <span>{value}</span>
////        ),
////      },
////      {
////        Header: 'Start Date',
////        accessor: 'startDate',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="date"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'startDate')}
////          />
////        ),
////      },
////      {
////        Header: 'End Date',
////        accessor: 'endDate',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="date"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'endDate')}
////          />
////        ),
////      },
////      {
////        Header: 'Scratch',
////        accessor: 'scratch',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'scratch')}
////          />
////        ),
////      },
////      {
////        Header: 'Membrane Thickness (µm)',
////        accessor: 'membraneThickness',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'membraneThickness')}
////          />
////        ),
////      },
////      {
////        Header: 'Notes',
////        accessor: 'notes',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'notes')}
////          />
////        ),
////      },
////      {
////        Header: 'BoL Conductivity (µS/cm)',
////        accessor: 'bolConductivity',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'bolConductivity')}
////          />
////        ),
////      },
////      {
////        Header: 'BoL pH',
////        accessor: 'bolPh',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'bolPh')}
////          />
////        ),
////      },
////      {
////        Header: '10 mM KOH Conductivity (µS/cm)',
////        accessor: 'kohConductivity',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'kohConductivity')}
////          />
////        ),
////      },
////      {
////        Header: '10 mM KOH pH',
////        accessor: 'kohPh',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'kohPh')}
////          />
////        ),
////      },
////      {
////        Header: 'Recombination Layer Thickness (µm)',
////        accessor: 'recombinationLayerThickness',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'recombinationLayerThickness')}
////          />
////        ),
////      },
////      {
////        Header: 'Recombination Layer Pt Loading (mg/cm2)',
////        accessor: 'recombinationLayerPtLoading',
////        Cell: ({ value, row: { index } }) => (
////          <Input
////            type="number"
////            value={value || ''}
////            onChange={(e) => handleInputChange(e, index, 'recombinationLayerPtLoading')}
////          />
////        ),
////      },
////      {
////        Header: 'Was slow pol curve test performed',
////        accessor: 'slowPolCurvePerformed',
////        Cell: ({ value, row: { index } }) => (
////          <Checkbox
////            checked={value}
////            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurvePerformed')}
////          />
////        ),
////      },
////      {
////        Header: 'Do you have an updated Cathode XRF Pt loading to report?',
////        accessor: 'updateCathodeXrfPtLoading',
////        Cell: ({ value, row: { index } }) => (
////          <div>
////            <Checkbox
////              checked={value}
////              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfPtLoading')}
////            />
////            {value && (
////              <Input
////                type="number"
////                placeholder="Pt Loading (mg/cm2)"
////                onChange={(e) => handleInputChange(e, index, 'cathodeXrfPtLoading')}
////              />
////            )}
////          </div>
////        ),
////      },
////      {
////        Header: 'Do you have an updated Cathode XRF Ru loading to report?',
////        accessor: 'updateCathodeXrfRuLoading',
////        Cell: ({ value, row: { index } }) => (
////          <div>
////            <Checkbox
////              checked={value}
////              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfRuLoading')}
////            />
////            {value && (
////              <Input
////                type="number"
////                placeholder="Ru Loading (mg/cm2)"
////                onChange={(e) => handleInputChange(e, index, 'cathodeXrfRuLoading')}
////              />
////            )}
////          </div>
////        ),
////      },
////      {
////        Header: 'Upload Excel',
////        accessor: 'excelFile',
////        Cell: ({ row: { index } }) => (
////          <Input
////            type="file"
////            accept=".xlsx, .xls, .xlsm"
////            onChange={(e) => handleFileChange(e, index)}
////          />
////        ),
////      },
////      {
////        Header: 'Save',
////        Cell: ({ row: { index } }) => (
////          <Button onClick={() => handleSave(index)}>Save</Button>
////        ),
////      },
////      {
////        Header: 'Complete',
////        Cell: ({ row: { index } }) => (
////          <Button onClick={() => handleComplete(index)}>Complete</Button>
////        ),
////      },
////    ],
////    [testDetails]
////  );
////
////  const {
////    getTableProps,
////    getTableBodyProps,
////    headerGroups,
////    rows,
////    prepareRow,
////  } = useTable({ columns, data: testResults }, useRowSelect);
////
////  return (
////    <div>
////      <h2>Log Test Results</h2>
////      {message && <div>{message}</div>}
////      <div style={{ overflowX: 'auto' }}>
////        <table {...getTableProps()}>
////          <thead>
////            {headerGroups.map((headerGroup) => (
////              <tr {...headerGroup.getHeaderGroupProps()}>
////                {headerGroup.headers.map((column) => (
////                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
////                ))}
////              </tr>
////            ))}
////          </thead>
////          <tbody {...getTableBodyProps()}>
////            {rows.map((row) => {
////              prepareRow(row);
////              return (
////                <tr {...row.getRowProps()}>
////                  {row.cells.map((cell) => (
////                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
////                  ))}
////                </tr>
////              );
////            })}
////          </tbody>
////        </table>
////      </div>
////
////      {/* Modal to display test details */}
////      <Modal
////        open={modalOpen}
////        onClose={() => setModalOpen(false)}
////        style={{
////          position: 'fixed',
////          top: `${modalPosition.top}px`,
////          left: `${modalPosition.left}px`,
////          width: '500px', // Adjust width as needed
////          maxHeight: '600px', // Adjust height as needed
////          overflowY: 'auto', // Enable vertical scrolling if content is too long
////        }}
////      >
////        <Modal.Header>Test Details</Modal.Header>
////        <Modal.Content>
////          {selectedTestDetails ? (
////            <pre>{JSON.stringify(selectedTestDetails, null, 2)}</pre>
////          ) : (
////            'Loading...'
////          )}
////        </Modal.Content>
////        <Modal.Actions>
////          <Button onClick={() => setModalOpen(false)}>Close</Button>
////        </Modal.Actions>
////      </Modal>
////    </div>
////  );
////};
////
////export default LogResultsGrid;
//
////almost works
//import React, { useState, useEffect } from 'react';
//import { useTable, useRowSelect } from 'react-table';
//import axios from 'axios';
//import { Button, Input, Checkbox, Modal } from 'semantic-ui-react';
//
//const LogResultsGrid = () => {
//  const [testResults, setTestResults] = useState([]);
//  const [message, setMessage] = useState('');
//  const [testDetails, setTestDetails] = useState({});
//  const [modalOpen, setModalOpen] = useState(false);
//  const [selectedTestDetails, setSelectedTestDetails] = useState(null);
//  const [modalPosition, setModalPosition] = useState({});
//
//  useEffect(() => {
//    const fetchTests = async () => {
//      try {
//        const response = await axios.get('/api/engineer/tests', {
//          headers: { Authorization: localStorage.getItem('token') }
//        });
//        setTestResults(response.data);
//        console.log('Fetched in-progress or assigned test results:', response.data); // Debug log
//      } catch (error) {
//        console.error('Error fetching test details:', error);
//        setMessage('Error fetching test details. Please try again.');
//      }
//    };
//
//    fetchTests();
//  }, []);
//
//  useEffect(() => {
//    const calculateDaysUnderTest = () => {
//      const updatedResults = testResults.map(test => {
//        const startDate = new Date(test.startDate);
//        const endDate = new Date(test.endDate);
//        if (!isNaN(startDate) && !isNaN(endDate)) {
//          const diffTime = Math.abs(endDate - startDate);
//          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//          return { ...test, daysUnderTest: diffDays };
//        }
//        return { ...test, daysUnderTest: '' };
//      });
//      setTestResults(updatedResults);
//    };
//
//    calculateDaysUnderTest();
//  }, [testResults]);
//
//  const fetchTestDetails = async (id, event) => {
//    try {
//      const response = await axios.get(`/api/engineer/tests/${id}`, {
//        headers: { Authorization: localStorage.getItem('token') }
//      });
//      console.log('Fetched test details for ID:', id, response.data); // Debug log
//      setTestDetails(prevDetails => ({ ...prevDetails, [id]: response.data }));
//      setSelectedTestDetails(response.data);
//
//      // Calculate modal position
//      const modalWidth = 300;
//      const modalHeight = 200;
//      const padding = 10;
//
//      let top = event.clientY;
//      let left = event.clientX;
//
//      if (top + modalHeight + padding > window.innerHeight) {
//        top = window.innerHeight - modalHeight - padding;
//      }
//      if (left + modalWidth + padding > window.innerWidth) {
//        left = window.innerWidth - modalWidth - padding;
//      }
//
//      setModalPosition({ top, left });
//      setModalOpen(true);
//    } catch (error) {
//      console.error('Error fetching test details:', error);
//    }
//  };
//
//  const columns = React.useMemo(
//    () => [
////      {
////        Header: 'Test ID',
////        accessor: 'id',
////        Cell: ({ value }) => (
////          <div>
////            <span
////              onClick={(e) => fetchTestDetails(value, e)}
////              style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
////            >
////              {value}
////            </span>
////          </div>
////        ),
////      },
//      {
//        Header: 'Test ID',
//        accessor: 'id',
//        Cell: ({ value }) => (
//          <div>
//            <span
//              onClick={(e) => fetchTestDetails(value, e)}
//              style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
//            >
//              {value}
//            </span>
//          </div>
//        ),
//      },
//      {
//        Header: 'Test Code',
//        accessor: 'test_codes',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'test_codes')}
//          />
//        ),
//      },
//      {
//        Header: 'Hardware Number',
//        accessor: 'hardwareNumber',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'hardwareNumber')}
//          />
//        ),
//      },
//      {
//        Header: 'Test Stand Channel',
//        accessor: 'testStandChannel',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'testStandChannel')}
//          />
//        ),
//      },
//      {
//        Header: 'Days Under Test',
//        accessor: 'daysUnderTest',
//        Cell: ({ value }) => (
//          <span>{value}</span>
//        ),
//      },
//      {
//        Header: 'Start Date',
//        accessor: 'startDate',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="date"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'startDate')}
//          />
//        ),
//      },
//      {
//        Header: 'End Date',
//        accessor: 'endDate',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="date"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'endDate')}
//          />
//        ),
//      },
//      {
//        Header: 'Scratch',
//        accessor: 'scratch',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'scratch')}
//          />
//        ),
//      },
//      {
//        Header: 'Membrane Thickness (µm)',
//        accessor: 'membraneThickness',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'membraneThickness')}
//          />
//        ),
//      },
//      {
//        Header: 'Notes',
//        accessor: 'notes',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'notes')}
//          />
//        ),
//      },
//      {
//        Header: 'BoL Conductivity (µS/cm)',
//        accessor: 'bolConductivity',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'bolConductivity')}
//          />
//        ),
//      },
//      {
//        Header: 'BoL pH',
//        accessor: 'bolPh',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'bolPh')}
//          />
//        ),
//      },
//      {
//        Header: '10 mM KOH Conductivity (µS/cm)',
//        accessor: 'kohConductivity',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'kohConductivity')}
//          />
//        ),
//      },
//      {
//        Header: '10 mM KOH pH',
//        accessor: 'kohPh',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'kohPh')}
//          />
//        ),
//      },
//      {
//        Header: 'Recombination Layer Thickness (µm)',
//        accessor: 'recombinationLayerThickness',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'recombinationLayerThickness')}
//          />
//        ),
//      },
//      {
//        Header: 'Recombination Layer Pt Loading (mg/cm2)',
//        accessor: 'recombinationLayerPtLoading',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            type="number"
//            value={value}
//            onChange={(e) => handleInputChange(e, index, 'recombinationLayerPtLoading')}
//          />
//        ),
//      },
//      {
//        Header: 'Was slow pol curve test performed',
//        accessor: 'slowPolCurvePerformed',
//        Cell: ({ value, row: { index } }) => (
//          <Checkbox
//            checked={value}
//            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurvePerformed')}
//          />
//        ),
//      },
//      {
//        Header: 'Do you have an updated Cathode XRF Pt loading to report?',
//        accessor: 'updateCathodeXrfPtLoading',
//        Cell: ({ value, row: { index } }) => (
//          <div>
//            <Checkbox
//              checked={value}
//              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfPtLoading')}
//            />
//            {value && (
//              <Input
//                type="number"
//                placeholder="Pt Loading (mg/cm2)"
//                onChange={(e) => handleInputChange(e, index, 'cathodeXrfPtLoading')}
//              />
//            )}
//          </div>
//        ),
//      },
//      {
//        Header: 'Do you have an updated Cathode XRF Ru loading to report?',
//        accessor: 'updateCathodeXrfRuLoading',
//        Cell: ({ value, row: { index } }) => (
//          <div>
//            <Checkbox
//              checked={value}
//              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfRuLoading')}
//            />
//            {value && (
//              <Input
//                type="number"
//                placeholder="Ru Loading (mg/cm2)"
//                onChange={(e) => handleInputChange(e, index, 'cathodeXrfRuLoading')}
//              />
//            )}
//          </div>
//        ),
//      },
//      {
//        Header: 'Upload Excel',
//        accessor: 'excelFile',
//        Cell: ({ row: { index } }) => (
//          <Input
//            type="file"
//            accept=".xlsx, .xls, .xlsm"
//            onChange={(e) => handleFileChange(e, index)}
//          />
//        ),
//      },
//      {
//        Header: 'Save',
//        Cell: ({ row: { index } }) => (
//          <Button onClick={() => handleSave(index)}>Save</Button>
//        ),
//      },
//      {
//        Header: 'Complete',
//        Cell: ({ row: { index } }) => (
//          <Button onClick={() => handleComplete(index)}>Complete</Button>
//        ),
//      },
//    ],
//    [testDetails]
//  );
//
////was working fine
////  const handleInputChange = (e, index, columnId) => {
////    const updatedResults = [...testResults];
////    if (!updatedResults[index]) {
////      updatedResults[index] = { id: testResults[index].id }; // Initialize if undefined
////    }
////    updatedResults[index][columnId] = e.target.value;
////    setTestResults(updatedResults);
////  };
////was working fine
//
//  const handleCheckboxChange = (value, index, columnId) => {
//    const updatedResults = [...testResults];
//    if (!updatedResults[index]) {
//      updatedResults[index] = { id: testResults[index].id }; // Initialize if undefined
//    }
//    updatedResults[index][columnId] = value;
//    setTestResults(updatedResults);
//  };
//
//  const handleFileChange = (e, index) => {
//    const updatedResults = [...testResults];
//    if (!updatedResults[index]) {
//      updatedResults[index] = { id: testResults[index].id }; // Initialize if undefined
//    }
//    updatedResults[index].excelFile = e.target.files[0];
//    setTestResults(updatedResults);
//  };
//
////  const handleComplete = async (index) => {
////    const formData = new FormData();
////    const testResult = testResults[index];
////
////    Object.keys(testResult).forEach((key) => {
////      if (testResult[key] instanceof File) {
////        formData.append(key, testResult[key]);
////      } else {
////        formData.append(key, testResult[key] || 'N/A');
////      }
////    });
////
////    try {
////      const response = await axios.post('/api/engineer/log-results', formData, {
////        headers: {
////          'Content-Type': 'multipart/form-data',
////          Authorization: localStorage.getItem('token'),
////        },
////        params: {
////          action: 'complete'
////        }
////      });
////      setMessage(response.data.message);
////    } catch (error) {
////      console.error('Error logging results:', error);
////      setMessage('Error logging results. Please try again.');
////    }
////  };
////
////  const handleSave = async (index) => {
////    const testResult = testResults[index];
////    const formData = new FormData();
////
////    Object.keys(testResult).forEach((key) => {
////      if (testResult[key] instanceof File) {
////        formData.append(key, testResult[key]);
////      } else {
////        formData.append(key, testResult[key] || 'N/A');
////      }
////    });
////
////    try {
////      // Save the test results
////      await axios.post('/api/engineer/log-results', formData, {
////        headers: {
////          'Content-Type': 'multipart/form-data',
////          Authorization: localStorage.getItem('token'),
////        },
////        params: {
////          action: 'save'
////        }
////      });
////
////      // Update the status to "in-progress"
////      const response = await axios.post('/api/engineer/update-status', {
////        testRequestId: testResult.id,
////        status: 'in-progress',
////      }, {
////        headers: { Authorization: localStorage.getItem('token') }
////      });
////
////      setMessage(response.data.message);
////    } catch (error) {
////      console.error('Error saving test results:', error);
////      setMessage('Error saving test results. Please try again.');
////    }
////  };
//
//const handleInputChange = (e, index, columnId) => {
//  const updatedResults = [...testResults];
//
//  // Ensure the result at the given index exists and initialize if not
//  if (!updatedResults[index]) {
//    updatedResults[index] = {};
//  }
//
//  // Update the relevant field
//  updatedResults[index][columnId] = e.target.value;
//
//  // Update the state
//  setTestResults(updatedResults);
//};
//
//const handleSave = async (index) => {
//  const testResult = { ...testResults[index] };
//  testResult.testRequestId = testResult.id;
//  delete testResult.id;
//
//  const formData = new FormData();
//
//  // Wrap the test result in an array
//  const testResultsArray = [testResult];
//
//  // Append the testResults array as a JSON object
//  formData.append('testResults', JSON.stringify(testResultsArray));
//  formData.append('action', 'save');
//
//  if (testResult.excelFile) {
//    formData.append('excelFile', testResult.excelFile);
//  }
//
//  // Log the formData
//  for (let pair of formData.entries()) {
//    console.log(pair[0]+ ', ' + pair[1]);
//  }
//
//  try {
//    const response = await axios.post('/api/engineer/log-results', formData, {
//      headers: {
//        'Content-Type': 'multipart/form-data',
//        Authorization: localStorage.getItem('token'),
//      }
//    });
//
//    // Update the status to "in-progress"
//    await axios.post('/api/engineer/update-status', {
//      testRequestId: testResult.testRequestId,
//      status: 'in-progress',
//    }, {
//      headers: { Authorization: localStorage.getItem('token') }
//    });
//
//    setMessage(response.data.message);
//  } catch (error) {
//    console.error('Error saving test results:', error);
//    setMessage('Error saving test results. Please try again.');
//  }
//};
//
//const handleComplete = async (index) => {
//  const testResult = { ...testResults[index] };
//  testResult.testRequestId = testResult.id;
//  delete testResult.id;
//
//  const formData = new FormData();
//
//  // Wrap the test result in an array
//  const testResultsArray = [testResult];
//
//  // Append the testResults array as a JSON object
//  formData.append('testResults', JSON.stringify(testResultsArray));
//  formData.append('action', 'complete');
//
//  if (testResult.excelFile) {
//    formData.append('excelFile', testResult.excelFile);
//  }
//
//  // Log the formData
//  for (let pair of formData.entries()) {
//    console.log(pair[0]+ ', ' + pair[1]);
//  }
//
//  try {
//    const response = await axios.post('/api/engineer/log-results', formData, {
//      headers: {
//        'Content-Type': 'multipart/form-data',
//        Authorization: localStorage.getItem('token'),
//      }
//    });
//    setMessage(response.data.message);
//  } catch (error) {
//    console.error('Error logging results:', error);
//    setMessage('Error logging results. Please try again.');
//  }
//};
//
//
//  const {
//    getTableProps,
//    getTableBodyProps,
//    headerGroups,
//    rows,
//    prepareRow,
//  } = useTable({ columns, data: testResults }, useRowSelect);
//
//  return (
//    <div>
//      <h2>Log Test Results</h2>
//      {message && <div>{message}</div>}
//      <div style={{ overflowX: 'auto' }}>
//        <table {...getTableProps()}>
//          <thead>
//            {headerGroups.map((headerGroup) => (
//              <tr {...headerGroup.getHeaderGroupProps()}>
//                {headerGroup.headers.map((column) => (
//                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
//                ))}
//              </tr>
//            ))}
//          </thead>
//          <tbody {...getTableBodyProps()}>
//            {rows.map((row) => {
//              prepareRow(row);
//              return (
//                <tr {...row.getRowProps()}>
//                  {row.cells.map((cell) => (
//                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
//                  ))}
//                </tr>
//              );
//            })}
//          </tbody>
//        </table>
//      </div>
//
//      {/* Modal to display test details */}
//      <Modal
//        open={modalOpen}
//        onClose={() => setModalOpen(false)}
//        style={{
//          position: 'fixed',
//          top: `${modalPosition.top}px`,
//          left: `${modalPosition.left}px`,
//          width: '500px', // Adjust width as needed
//          maxHeight: '600px', // Adjust height as needed
//          overflowY: 'auto', // Enable vertical scrolling if content is too long
//        }}
//      >
//        <Modal.Header>Test Details</Modal.Header>
//        <Modal.Content>
//          {selectedTestDetails ? (
//            <pre>{JSON.stringify(selectedTestDetails, null, 2)}</pre>
//          ) : (
//            'Loading...'
//          )}
//        </Modal.Content>
//        <Modal.Actions>
//          <Button onClick={() => setModalOpen(false)}>Close</Button>
//        </Modal.Actions>
//      </Modal>
//    </div>
//  );
//};
//
//export default LogResultsGrid;
////almost works

import React, { useState, useEffect } from 'react';
import { useTable, useRowSelect } from 'react-table';
import axios from 'axios';
import { Button, Input, Checkbox, Modal } from 'semantic-ui-react';

const LogResultsGrid = () => {
  const [testResults, setTestResults] = useState([]);
  const [message, setMessage] = useState('');
  const [testDetails, setTestDetails] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState(null);
  const [modalPosition, setModalPosition] = useState({});

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/api/engineer/tests', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setTestResults(response.data);
        console.log('Fetched in-progress or assigned test results:', response.data); // Debug log
      } catch (error) {
        console.error('Error fetching test details:', error);
        setMessage('Error fetching test details. Please try again.');
      }
    };

    fetchTests();
  }, []);

  const handleInputChange = (e, index, columnId) => {
    setTestResults(prevResults => {
      const updatedResults = [...prevResults];
      if (!updatedResults[index]) {
        updatedResults[index] = {}; // Initialize if undefined with a default value
      }
      updatedResults[index][columnId] = e.target.value;
      console.log('Updated testResults:', updatedResults); // Debug log
      return updatedResults;
    });
  };

  const handleCheckboxChange = (value, index, columnId) => {
    setTestResults(prevResults => {
      const updatedResults = [...prevResults];
      if (!updatedResults[index]) {
        updatedResults[index] = {}; // Initialize if undefined with a default value
      }
      updatedResults[index][columnId] = value;
      console.log('Updated testResults:', updatedResults); // Debug log
      return updatedResults;
    });
  };

  const handleFileChange = (e, index) => {
    setTestResults(prevResults => {
      const updatedResults = [...prevResults];
      if (!updatedResults[index]) {
        updatedResults[index] = {}; // Initialize if undefined with a default value
      }
      updatedResults[index].excelFile = e.target.files[0];
      console.log('Updated testResults:', updatedResults); // Debug log
      return updatedResults;
    });
  };

  const fetchTestDetails = async (id, event) => {
    try {
      const response = await axios.get(`/api/engineer/tests/${id}`, {
        headers: { Authorization: localStorage.getItem('token') }
      });
      console.log('Fetched test details for ID:', id, response.data); // Debug log
      setTestDetails(prevDetails => ({ ...prevDetails, [id]: response.data }));
      setSelectedTestDetails(response.data);

      // Calculate modal position
      const modalWidth = 300;
      const modalHeight = 200;
      const padding = 10;

      let top = event.clientY;
      let left = event.clientX;

      if (top + modalHeight + padding > window.innerHeight) {
        top = window.innerHeight - modalHeight - padding;
      }
      if (left + modalWidth + padding > window.innerWidth) {
        left = window.innerWidth - modalWidth - padding;
      }

      setModalPosition({ top, left });
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

const handleSave = async (index) => {
  console.log(`Handle Save called with index: ${index}`);

  // Check if index is valid and within bounds
  if (index < 0 || index >= testResults.length) {
    console.log(`No test result found at index: ${index}`);
    return;
  }

  // Retrieve the test result at the given index
  const testResult = testResults[index];
  console.log(`Test result at index: ${index}`, testResult);

  // Check if testResult exists
  if (!testResult) {
    console.log(`No test result found at index: ${index}`);
    return;
  }

  const payload = {
    testResults: [testResult],
    action: 'save'
  };

  console.log('Payload to be sent:', payload);

  // Create a FormData object to include the excelFile if it exists
  const formData = new FormData();
  formData.append('testResults', JSON.stringify(payload.testResults));
  formData.append('action', payload.action);

  if (testResult.excelFile) {
    formData.append('excelFile', testResult.excelFile);
  }

  console.log('FormData to be sent:', formData);

  try {
    const response = await axios.post('http://localhost:3002/api/engineer/log-results', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token') // Include the token in the headers
      },
    });

    console.log('Save successful:', response.data);
  } catch (error) {
    console.error('Error saving test results:', error);

    // Check if the error response has more details
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
  }
};

  const handleComplete = async (index) => {
    console.log('Handle Complete called with index:', index); // Debug log
    const testResult = testResults[index];
    console.log('Test result at index:', index, testResult); // Additional debug log
    if (!testResult) {
      console.error('No test result found at index:', index);
      setMessage(`No test result found at index: ${index}`);
      return;
    }

    const formData = new FormData();
    formData.append('testResults', JSON.stringify([testResult])); // Ensure testResults is an array
    if (testResult.excelFile instanceof File) {
      formData.append('excelFile', testResult.excelFile);
    }
    formData.append('action', 'complete');

    try {
      const response = await axios.post('/api/engineer/log-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });

      console.log('Complete response:', response.data); // Debug log
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error logging results:', error);
      setMessage('Error logging results. Please try again.');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Test ID',
        accessor: 'id',
        Cell: ({ value }) => (
          <div>
            <span
              onClick={(e) => fetchTestDetails(value, e)}
              style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
            >
              {value}
            </span>
          </div>
        ),
      },
      {
        Header: 'Test Code',
        accessor: 'test_codes',
        Cell: ({ value, row: { index } }) => (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'test_codes')}
          />
        ),
      },
      {
        Header: 'Hardware Number',
        accessor: 'hardwareNumber',
        Cell: ({ value, row: { index } }) => (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'hardwareNumber')}
          />
        ),
      },
      {
        Header: 'Test Stand Channel',
        accessor: 'testStandChannel',
        Cell: ({ value, row: { index } }) => (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'testStandChannel')}
          />
        ),
      },
      {
        Header: 'Days Under Test',
        accessor: 'daysUnderTest',
        Cell: ({ value }) => (
          <span>{value}</span>
        ),
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'startDate')}
          />
        ),
      },
      {
        Header: 'End Date',
        accessor: 'endDate',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'endDate')}
          />
        ),
      },
      {
        Header: 'Scratch',
        accessor: 'scratch',
        Cell: ({ value, row: { index } }) => (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'scratch')}
          />
        ),
      },
      {
        Header: 'Membrane Thickness (µm)',
        accessor: 'membraneThickness',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'membraneThickness')}
          />
        ),
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ value, row: { index } }) => (
          <Input
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'notes')}
          />
        ),
      },
      {
        Header: 'BoL Conductivity (µS/cm)',
        accessor: 'bolConductivity',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'bolConductivity')}
          />
        ),
      },
      {
        Header: 'BoL pH',
        accessor: 'bolPh',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'bolPh')}
          />
        ),
      },
      {
        Header: '10 mM KOH Conductivity (µS/cm)',
        accessor: 'kohConductivity',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'kohConductivity')}
          />
        ),
      },
      {
        Header: '10 mM KOH pH',
        accessor: 'kohPh',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'kohPh')}
          />
        ),
      },
      {
        Header: 'Recombination Layer Thickness (µm)',
        accessor: 'recombinationLayerThickness',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'recombinationLayerThickness')}
          />
        ),
      },
      {
        Header: 'Recombination Layer Pt Loading (mg/cm2)',
        accessor: 'recombinationLayerPtLoading',
        Cell: ({ value, row: { index } }) => (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => handleInputChange(e, index, 'recombinationLayerPtLoading')}
          />
        ),
      },
      {
        Header: 'Was slow pol curve test performed',
        accessor: 'slowPolCurvePerformed',
        Cell: ({ value, row: { index } }) => (
          <Checkbox
            checked={value || false}
            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurvePerformed')}
          />
        ),
      },
      {
        Header: 'Do you have an updated Cathode XRF Pt loading to report?',
        accessor: 'updateCathodeXrfPtLoading',
        Cell: ({ value, row: { index } }) => (
          <div>
            <Checkbox
              checked={value || false}
              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfPtLoading')}
            />
            {value && (
              <Input
                type="number"
                placeholder="Pt Loading (mg/cm2)"
                onChange={(e) => handleInputChange(e, index, 'cathodeXrfPtLoading')}
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Do you have an updated Cathode XRF Ru loading to report?',
        accessor: 'updateCathodeXrfRuLoading',
        Cell: ({ value, row: { index } }) => (
          <div>
            <Checkbox
              checked={value || false}
              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfRuLoading')}
            />
            {value && (
              <Input
                type="number"
                placeholder="Ru Loading (mg/cm2)"
                onChange={(e) => handleInputChange(e, index, 'cathodeXrfRuLoading')}
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Upload Excel',
        accessor: 'excelFile',
        Cell: ({ row: { index } }) => (
          <Input
            type="file"
            accept=".xlsx, .xls, .xlsm"
            onChange={(e) => handleFileChange(e, index)}
          />
        ),
      },
      {
        Header: 'Save',
        Cell: ({ row: { index } }) => (
          <Button onClick={() => handleSave(index)}>Save</Button>
        ),
      },
      {
        Header: 'Complete',
        Cell: ({ row: { index } }) => (
          <Button onClick={() => handleComplete(index)}>Complete</Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: testResults }, useRowSelect);

  return (
    <div>
      <h2>Log Test Results</h2>
      {message && <div>{message}</div>}
      <div style={{ overflowX: 'auto' }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal to display test details */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        style={{
          position: 'fixed',
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          width: '500px', // Adjust width as needed
          maxHeight: '600px', // Adjust height as needed
          overflowY: 'auto', // Enable vertical scrolling if content is too long
        }}
      >
        <Modal.Header>Test Details</Modal.Header>
        <Modal.Content>
          {selectedTestDetails ? (
            <pre>{JSON.stringify(selectedTestDetails, null, 2)}</pre>
          ) : (
            'Loading...'
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setModalOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default LogResultsGrid;
