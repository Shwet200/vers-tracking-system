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
//        console.log('Fetching test results...');
//        const token = localStorage.getItem('token');
//        console.log('Token:', token);
//        const response = await axios.get('/api/engineer/tests/results', {
//          headers: { Authorization: localStorage.getItem('token') },
//        });
//
//        const data = response.data.map(test => ({
//          ...test,
//          updateCathodeXrfPtLoading: test?.cathode_xrf_pt_loading != null,
//          updateCathodeXrfRuLoading: test?.cathode_xrf_ru_loading != null,
//          updateAnodeFeNi: test?.anode_fe_ni != null,
//        }));
//
//        setTestResults(data);
//        console.log('Fetched test results:', data);
//      } catch (error) {
//        console.error('Error fetching test results:', error);
//        setMessage('Error fetching test results. Please try again.');
//      }
//    };
//
//    fetchTests();
//  }, []);
//
//  const calculateDaysUnderTest = (startDate, endDate) => {
//    const start = startDate ? new Date(startDate) : null;
//    const end = endDate ? new Date(endDate) : null;
//    if (start && end && !isNaN(start) && !isNaN(end)) {
//      const diffTime = Math.abs(end - start);
//      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//      return diffDays;
//    }
//    return '';
//  };
//
//  const handleInputChange = (e, index, columnId) => {
//    const { value } = e.target;
//
//    setTestResults((prevResults) => {
//      const updatedResults = [...prevResults];
//
//      // Directly update the value as a string
//      updatedResults[index] = {
//        ...updatedResults[index],
//        [columnId]: value,
//        daysUnderTest: calculateDaysUnderTest(
//          columnId === 'startDate' ? value : updatedResults[index].startDate,
//          columnId === 'endDate' ? value : updatedResults[index].endDate
//        ),
//      };
//
//      // Calculate related values only when necessary
//      if (columnId === 'cathode_xrf_pt_loading' || columnId === 'cathode_xrf_ru_loading') {
//        const cathodePtLoading = parseFloat(updatedResults[index].cathode_xrf_pt_loading) || 0;
//        const cathodeRuLoading = parseFloat(updatedResults[index].cathode_xrf_ru_loading) || 0;
//        updatedResults[index].cathode_ru_pt_mass =
//          cathodePtLoading > 0 ? cathodeRuLoading / cathodePtLoading : '';
//      }
//
//      return updatedResults;
//    });
//  };
//
//  const formatDate = (dateString) => {
//    const date = new Date(dateString);
//    return isNaN(date) ? '' : date.toISOString().split('T')[0];
//  };
//
//  const handleCheckboxChange = (value, index, columnId) => {
//    setTestResults((prevResults) => {
//      const updatedResults = [...prevResults];
//      updatedResults[index] = {
//        ...updatedResults[index],
//        [columnId]: value,
//      };
//      console.log('Updated testResults:', updatedResults);
//      return updatedResults;
//    });
//  };
//
//  const handleFileChange = (e, index) => {
//    const file = e.target.files[0];
//    setTestResults((prevResults) => {
//      const updatedResults = [...prevResults];
//      updatedResults[index] = {
//        ...updatedResults[index],
//        excelFile: file,
//      };
//      console.log('Updated testResults:', updatedResults);
//      return updatedResults;
//    });
//  };
//
//  const fetchTestDetails = async (id, event) => {
//    try {
//      const response = await axios.get(`/api/engineer/tests/${id}`, {
//        headers: { Authorization: localStorage.getItem('token') },
//      });
//      console.log('Fetched test details for ID:', id, response.data);
//      setTestDetails((prevDetails) => ({ ...prevDetails, [id]: response.data }));
//      setSelectedTestDetails(response.data);
//
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
//  const sendTestResult = async (payload) => {
//    try {
//      const formData = new FormData();
//
//      // Ensure all the fields are correctly serialized and added to FormData
//      formData.append('testResults', JSON.stringify(payload.testResults));
//      formData.append('action', payload.action);
//
//      // Log the exact testResults being sent
//      console.log('Final testResults to be sent:', JSON.stringify(payload.testResults));
//
//      if (payload.testResults[0].excelFile) {
//        formData.append('excelFile', payload.testResults[0].excelFile);
//      }
//
//      console.log('FormData to be sent:');
//      for (let pair of formData.entries()) {
//        console.log(`${pair[0]}: ${pair[1]}`);
//      }
//
//      const response = await axios.post('http://localhost:5000/api/engineer/log-results', formData, {
//        headers: {
//          'Content-Type': 'multipart/form-data',
//          Authorization: localStorage.getItem('token'),
//        },
//      });
//
//      console.log('Response:', response.data);
//      setMessage(response.data.message || 'Operation successful');
//    } catch (error) {
//      console.error('Error:', error);
//      setMessage('Error logging results. Please try again.');
//    }
//  };
//
//  const handleSave = (index) => {
//    setTestResults((prevResults) => {
//      const testResult = prevResults[index];
//      if (!testResult) return prevResults;
//
//      const mappedTestResult = {
//        testRequestId: testResult.testRequestId,
//        testCompleted: false,
//        bolPh: parseFloat(testResult.bolPh) || null,
//        comments: testResult.comments || '',
//        hardwareNumber: testResult.hardwareNumber || '',
//        testStandChannel: testResult.testStandChannel || '',
//        startDate: testResult.startDate || '',
//        endDate: testResult.endDate || 'N/A',
//        daysUnderTest: parseInt(testResult.daysUnderTest) || null,
//        notes: testResult.notes || '',
//        scratch: testResult.scratch || '',
//        membraneThickness: parseFloat(testResult.membraneThickness) || null,
//        bolConductivity: parseFloat(testResult.bolConductivity) || null,
//        kohConductivity: parseFloat(testResult.kohConductivity) || null,
//        kohPh: parseFloat(testResult.kohPh) || null,
//        test_codes: testResult.test_codes || '',
//        recombinationLayerThickness: parseFloat(testResult.recombinationLayerThickness) || null,
//        recombinationLayerPtLoading: parseFloat(testResult.recombinationLayerPtLoading) || null,
//        cathode_xrf_pt_loading: parseFloat(testResult.cathode_xrf_pt_loading) || null,
//        cathode_xrf_ru_loading: parseFloat(testResult.cathode_xrf_ru_loading) || null,
//        cathode_ru_pt_mass: parseFloat(testResult.cathode_ru_pt_mass) || null,
//        anode_fe_ni: parseFloat(testResult.anode_fe_ni) || null,
//        updateAnodeFeNi: testResult.updateAnodeFeNi || '',
//        updateCathodeXrfPtLoading: testResult.updateCathodeXrfPtLoading || '',
//        updateCathodeXrfRuLoading: testResult.updateCathodeXrfRuLoading || '',
//        updateCathodeRuPtMass: testResult.updateCathodeRuPtMass || '',
//        slowPolCurveTestPerformed: testResult.slowPolCurveTestPerformed || false,
//        excelFile: testResult.excelFile || null,
//      };
//
//      const payload = {
//        testResults: [mappedTestResult],
//        action: 'save',
//      };
//
//      sendTestResult(payload);
//
//      return prevResults;
//    });
//  };
//
//  const handleComplete = (index) => {
//    setTestResults((prevResults) => {
//      const testResult = prevResults[index];
//      if (!testResult) return prevResults;
//
//      // Log before mapping the test result
//      console.log('Test result before mapping:', testResult);
//
//      const mappedTestResult = {
//        testRequestId: testResult.testRequestId,
//        testCompleted: true,
//        bolPh: parseFloat(testResult.bolPh) || null,
//        comments: testResult.comments || '',
//        hardwareNumber: testResult.hardwareNumber || '',
//        testStandChannel: testResult.testStandChannel || '',
//        startDate: testResult.startDate || '',
//        endDate: testResult.endDate || '',
//        daysUnderTest: parseInt(testResult.daysUnderTest) || null,
//        notes: testResult.notes || '',
//        scratch: testResult.scratch || '',
//        membraneThickness: parseFloat(testResult.membraneThickness) || null,
//        bolConductivity: parseFloat(testResult.bolConductivity) || null,
//        kohConductivity: parseFloat(testResult.kohConductivity) || null,
//        kohPh: parseFloat(testResult.kohPh) || null,
//        test_codes: testResult.test_codes || '',
//        recombinationLayerThickness: parseFloat(testResult.recombinationLayerThickness) || null,
//        recombinationLayerPtLoading: parseFloat(testResult.recombinationLayerPtLoading) || null,
//        cathode_xrf_pt_loading: testResult.updateCathodeXrfPtLoading ? parseFloat(testResult.cathode_xrf_pt_loading) || null : null,
//        cathode_xrf_ru_loading: testResult.updateCathodeXrfRuLoading ? parseFloat(testResult.cathode_xrf_ru_loading) || null : null,
//        cathode_ru_pt_mass: testResult.updateCathodeRuPtMass ? parseFloat(testResult.cathode_ru_pt_mass) || null : null,
//        anode_fe_ni: testResult.updateAnodeFeNi ? parseFloat(testResult.anode_fe_ni) || null : null,
//        updateAnodeFeNi: testResult.updateAnodeFeNi || '',
//        updateCathodeXrfPtLoading: testResult.updateCathodeXrfPtLoading || '',
//        updateCathodeXrfRuLoading: testResult.updateCathodeXrfRuLoading || '',
//        updateCathodeRuPtMass: testResult.updateCathodeRuPtMass || '',
//        slowPolCurveTestPerformed: testResult.slowPolCurveTestPerformed || false,
//        excelFile: testResult.excelFile || null,
//      };
//
//      // Log the final mapped test result
//      console.log('Mapped test result:', mappedTestResult);
//
//      const payload = {
//        testResults: [mappedTestResult],
//        action: 'complete',
//      };
//
//      sendTestResult(payload);
//
//      return prevResults;
//    });
//  };
//
//  const columns = React.useMemo(
//    () => [
//      {
//        Header: 'Test ID',
//        accessor: 'testRequestId',
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
//            value={value || ''}
//            onChange={(e) => handleInputChange(e, index, 'test_codes')}
//          />
//        ),
//      },
//      {
//        Header: 'Hardware Number',
//        accessor: 'hardwareNumber',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value || ''}
//            onChange={(e) => handleInputChange(e, index, 'hardwareNumber')}
//          />
//        ),
//      },
//      {
//        Header: 'Test Stand Channel',
//        accessor: 'testStandChannel',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value || ''}
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
//            value={formatDate(value) || ''}
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
//            value={formatDate(value) || ''}
//            onChange={(e) => handleInputChange(e, index, 'endDate')}
//          />
//        ),
//      },
//      {
//        Header: 'Scratch',
//        accessor: 'scratch',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value || ''}
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
//            value={value || ''}
//            onChange={(e) => handleInputChange(e, index, 'membraneThickness')}
//          />
//        ),
//      },
//      {
//        Header: 'Notes',
//        accessor: 'notes',
//        Cell: ({ value, row: { index } }) => (
//          <Input
//            value={value || ''}
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
//            value={value || ''}
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
//            value={value || ''}
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
//            value={value || ''}
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
//            value={value || ''}
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
//            value={value || ''}
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
//            value={value || ''}
//            onChange={(e) => handleInputChange(e, index, 'recombinationLayerPtLoading')}
//          />
//        ),
//      },
//      {
//        Header: 'Do you have an updated Cathode XRF Pt loading to report?',
//        accessor: 'updateCathodeXrfPtLoading',
//        Cell: ({ value, row: { index } }) => (
//          <div>
//            <Checkbox
//              checked={value || false}
//              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfPtLoading')}
//            />
//            {value && (
//              <Input
//                type="number"
//                placeholder="Pt Loading (mg/cm2)"
//                value={testResults[index]?.cathode_xrf_pt_loading || ''}
//                onChange={(e) => handleInputChange(e, index, 'cathode_xrf_pt_loading')}
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
//              checked={value || false}
//              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfRuLoading')}
//            />
//            {value && (
//              <Input
//                type="number"
//                placeholder="Ru Loading (mg/cm2)"
//                value={testResults[index]?.cathode_xrf_ru_loading || ''}
//                onChange={(e) => handleInputChange(e, index, 'cathode_xrf_ru_loading')}
//              />
//            )}
//          </div>
//        ),
//      },
//      {
//        Header: 'Do you have an updated Anode Fe:Ni to report?',
//        accessor: 'updateAnodeFeNi',
//        Cell: ({ value, row: { index } }) => (
//          <div>
//            <Checkbox
//              checked={value || false}
//              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateAnodeFeNi')}
//            />
//            {value && (
//              <Input
//                type="number"
//                placeholder="Anode Fe:Ni"
//                value={testResults[index]?.anode_fe_ni || ''}
//                onChange={(e) => handleInputChange(e, index, 'anode_fe_ni')}
//              />
//            )}
//          </div>
//        ),
//      },
//      {
//        Header: 'Was slow pol curve test performed',
//        accessor: 'slowPolCurveTestPerformed',
//        Cell: ({ value, row: { index } }) => (
//          <Checkbox
//            checked={value || false}
//            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurveTestPerformed')}
//          />
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
//          width: '500px',
//          maxHeight: '600px',
//          overflowY: 'auto',
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTable, useRowSelect } from 'react-table';
import axios from 'axios';
import { Button, Input, Checkbox, Modal } from 'semantic-ui-react';

const EditableInput = ({ value, onChange, placeholder, type = 'text' }) => {
  const inputRef = useRef();

  return (
    <Input
      ref={inputRef}
      type={type}
      value={value || ''}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

const EditableCheckbox = ({ checked, onChange }) => {
  return <Checkbox checked={checked || false} onChange={onChange} />;
};

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
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/engineer/tests/results', {
          headers: { Authorization: token },
        });

        const data = response.data.map(test => ({
          ...test,
          updateCathodeXrfPtLoading: test?.cathode_xrf_pt_loading != null,
          updateCathodeXrfRuLoading: test?.cathode_xrf_ru_loading != null,
          updateAnodeFeNi: test?.anode_fe_ni != null,
        }));

        setTestResults(data);
      } catch (error) {
        setMessage('Error fetching test results. Please try again.');
      }
    };

    fetchTests();
  }, []);

  const calculateDaysUnderTest = useCallback((startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end && !isNaN(start) && !isNaN(end)) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return '';
  }, []);

  const handleInputChange = useCallback((e, index, columnId) => {
    const { value } = e.target;

    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];

      updatedResults[index] = {
        ...updatedResults[index],
        [columnId]: value,
        daysUnderTest: calculateDaysUnderTest(
          columnId === 'startDate' ? value : updatedResults[index].startDate,
          columnId === 'endDate' ? value : updatedResults[index].endDate
        ),
      };

      return updatedResults;
    });
  }, [calculateDaysUnderTest]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  const handleCheckboxChange = useCallback((value, index, columnId) => {
    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = {
        ...updatedResults[index],
        [columnId]: value,
      };
      return updatedResults;
    });
  }, []);

  const handleFileChange = useCallback((e, index) => {
    const file = e.target.files[0];

    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = {
        ...updatedResults[index],
        excelFile: file,
      };
      return updatedResults;
    });
  }, []);

  const fetchTestDetails = useCallback(async (id, event) => {
    try {
      const response = await axios.get(`/api/engineer/tests/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setTestDetails((prevDetails) => ({ ...prevDetails, [id]: response.data }));
      setSelectedTestDetails(response.data);

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
  }, []);

  const sendTestResult = useCallback(async (payload) => {
    try {
      const formData = new FormData();

      formData.append('testResults', JSON.stringify(payload.testResults));
      formData.append('action', payload.action);

      if (payload.testResults[0].excelFile) {
        formData.append('excelFile', payload.testResults[0].excelFile);
      }

      const response = await axios.post('http://localhost:5000/api/engineer/log-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });

      setMessage(response.data.message || 'Operation successful');
    } catch (error) {
      setMessage('Error logging results. Please try again.');
    }
  }, []);

  const handleSave = useCallback((index) => {
    setTestResults((prevResults) => {
      const testResult = prevResults[index];
      if (!testResult) return prevResults;

      const mappedTestResult = {
        testRequestId: testResult.testRequestId,
        testCompleted: false,
        bolPh: parseFloat(testResult.bolPh) || null,
        comments: testResult.comments || '',
        hardwareNumber: testResult.hardwareNumber || '',
        testStandChannel: testResult.testStandChannel || '',
        startDate: testResult.startDate || '',
        endDate: testResult.endDate || 'N/A',
        daysUnderTest: parseInt(testResult.daysUnderTest) || null,
        notes: testResult.notes || '',
        scratch: testResult.scratch || '',
        membraneThickness: parseFloat(testResult.membraneThickness) || null,
        bolConductivity: parseFloat(testResult.bolConductivity) || null,
        kohConductivity: parseFloat(testResult.kohConductivity) || null,
        kohPh: parseFloat(testResult.kohPh) || null,
        test_codes: testResult.test_codes || '',
        recombinationLayerThickness: parseFloat(testResult.recombinationLayerThickness) || null,
        recombinationLayerPtLoading: parseFloat(testResult.recombinationLayerPtLoading) || null,
        cathode_xrf_pt_loading: parseFloat(testResult.cathode_xrf_pt_loading) || null,
        cathode_xrf_ru_loading: parseFloat(testResult.cathode_xrf_ru_loading) || null,
        cathode_ru_pt_mass: parseFloat(testResult.cathode_ru_pt_mass) || null,
        anode_fe_ni: parseFloat(testResult.anode_fe_ni) || null,
        updateAnodeFeNi: testResult.updateAnodeFeNi || '',
        updateCathodeXrfPtLoading: testResult.updateCathodeXrfPtLoading || '',
        updateCathodeXrfRuLoading: testResult.updateCathodeXrfRuLoading || '',
        updateCathodeRuPtMass: testResult.updateCathodeRuPtMass || '',
        slowPolCurveTestPerformed: testResult.slowPolCurveTestPerformed || false,
        excelFile: testResult.excelFile || null,
      };

      const payload = {
        testResults: [mappedTestResult],
        action: 'save',
      };

      sendTestResult(payload);

      return prevResults;
    });
  }, [sendTestResult]);

  const handleComplete = useCallback((index) => {
    setTestResults((prevResults) => {
      const testResult = prevResults[index];
      if (!testResult) return prevResults;

      const mappedTestResult = {
        testRequestId: testResult.testRequestId,
        testCompleted: true,
        bolPh: parseFloat(testResult.bolPh) || null,
        comments: testResult.comments || '',
        hardwareNumber: testResult.hardwareNumber || '',
        testStandChannel: testResult.testStandChannel || '',
        startDate: testResult.startDate || '',
        endDate: testResult.endDate || '',
        daysUnderTest: parseInt(testResult.daysUnderTest) || null,
        notes: testResult.notes || '',
        scratch: testResult.scratch || '',
        membraneThickness: parseFloat(testResult.membraneThickness) || null,
        bolConductivity: parseFloat(testResult.bolConductivity) || null,
        kohConductivity: parseFloat(testResult.kohConductivity) || null,
        kohPh: parseFloat(testResult.kohPh) || null,
        test_codes: testResult.test_codes || '',
        recombinationLayerThickness: parseFloat(testResult.recombinationLayerThickness) || null,
        recombinationLayerPtLoading: parseFloat(testResult.recombinationLayerPtLoading) || null,
        cathode_xrf_pt_loading: testResult.updateCathodeXrfPtLoading ? parseFloat(testResult.cathode_xrf_pt_loading) || null : null,
        cathode_xrf_ru_loading: testResult.updateCathodeXrfRuLoading ? parseFloat(testResult.cathode_xrf_ru_loading) || null : null,
        cathode_ru_pt_mass: testResult.updateCathodeRuPtMass ? parseFloat(testResult.cathode_ru_pt_mass) || null : null,
        anode_fe_ni: testResult.updateAnodeFeNi ? parseFloat(testResult.anode_fe_ni) || null : null,
        updateAnodeFeNi: testResult.updateAnodeFeNi || '',
        updateCathodeXrfPtLoading: testResult.updateCathodeXrfPtLoading || '',
        updateCathodeXrfRuLoading: testResult.updateCathodeXrfRuLoading || '',
        updateCathodeRuPtMass: testResult.updateCathodeRuPtMass || '',
        slowPolCurveTestPerformed: testResult.slowPolCurveTestPerformed || false,
        excelFile: testResult.excelFile || null,
      };

      const payload = {
        testResults: [mappedTestResult],
        action: 'complete',
      };

      sendTestResult(payload);

      return prevResults;
    });
  }, [sendTestResult]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Test ID',
        accessor: 'testRequestId',
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
          <EditableInput
            value={value}
            onChange={(e) => handleInputChange(e, index, 'test_codes')}
          />
        ),
      },
      {
        Header: 'Hardware Number',
        accessor: 'hardwareNumber',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={value}
            onChange={(e) => handleInputChange(e, index, 'hardwareNumber')}
          />
        ),
      },
      {
        Header: 'Test Stand Channel',
        accessor: 'testStandChannel',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={value}
            onChange={(e) => handleInputChange(e, index, 'testStandChannel')}
          />
        ),
      },
      {
        Header: 'Days Under Test',
        accessor: 'daysUnderTest',
        Cell: ({ value }) => <span>{value}</span>,
      },
      {
        Header: 'Start Date',
        accessor: 'startDate',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={formatDate(value)}
            onChange={(e) => handleInputChange(e, index, 'startDate')}
            type="date"
          />
        ),
      },
      {
        Header: 'End Date',
        accessor: 'endDate',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={formatDate(value)}
            onChange={(e) => handleInputChange(e, index, 'endDate')}
            type="date"
          />
        ),
      },
      {
        Header: 'Scratch',
        accessor: 'scratch',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={value}
            onChange={(e) => handleInputChange(e, index, 'scratch')}
          />
        ),
      },
      {
        Header: 'Membrane Thickness (µm)',
        accessor: 'membraneThickness',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'membraneThickness')}
            type="number"
          />
        ),
      },
      {
        Header: 'Notes',
        accessor: 'notes',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={value}
            onChange={(e) => handleInputChange(e, index, 'notes')}
          />
        ),
      },
      {
        Header: 'BoL Conductivity (µS/cm)',
        accessor: 'bolConductivity',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'bolConductivity')}
            type="number"
          />
        ),
      },
      {
        Header: 'BoL pH',
        accessor: 'bolPh',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'bolPh')}
            type="number"
          />
        ),
      },
      {
        Header: '10 mM KOH Conductivity (µS/cm)',
        accessor: 'kohConductivity',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'kohConductivity')}
            type="number"
          />
        ),
      },
      {
        Header: '10 mM KOH pH',
        accessor: 'kohPh',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'kohPh')}
            type="number"
          />
        ),
      },
      {
        Header: 'Recombination Layer Thickness (µm)',
        accessor: 'recombinationLayerThickness',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'recombinationLayerThickness')}
            type="number"
          />
        ),
      },
      {
        Header: 'Recombination Layer Pt Loading (mg/cm2)',
        accessor: 'recombinationLayerPtLoading',
        Cell: ({ value, row: { index } }) => (
          <EditableInput
            value={parseFloat(value)}
            onChange={(e) => handleInputChange(e, index, 'recombinationLayerPtLoading')}
            type="number"
          />
        ),
      },
      {
        Header: 'Do you have an updated Cathode XRF Pt loading to report?',
        accessor: 'updateCathodeXrfPtLoading',
        Cell: ({ value, row: { index } }) => (
          <div>
            <EditableCheckbox
              checked={value}
              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfPtLoading')}
            />
            {value && (
              <EditableInput
                value={parseFloat(testResults[index]?.cathode_xrf_pt_loading)}
                onChange={(e) => handleInputChange(e, index, 'cathode_xrf_pt_loading')}
                type="number"
                placeholder="Pt Loading (mg/cm2)"
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
            <EditableCheckbox
              checked={value}
              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateCathodeXrfRuLoading')}
            />
            {value && (
              <EditableInput
                value={parseFloat(testResults[index]?.cathode_xrf_ru_loading)}
                onChange={(e) => handleInputChange(e, index, 'cathode_xrf_ru_loading')}
                type="number"
                placeholder="Ru Loading (mg/cm2)"
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Do you have an updated Anode Fe:Ni to report?',
        accessor: 'updateAnodeFeNi',
        Cell: ({ value, row: { index } }) => (
          <div>
            <EditableCheckbox
              checked={value}
              onChange={(e, data) => handleCheckboxChange(data.checked, index, 'updateAnodeFeNi')}
            />
            {value && (
              <EditableInput
                value={parseFloat(testResults[index]?.anode_fe_ni)}
                onChange={(e) => handleInputChange(e, index, 'anode_fe_ni')}
                type="number"
                placeholder="Anode Fe:Ni"
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Was slow pol curve test performed',
        accessor: 'slowPolCurveTestPerformed',
        Cell: ({ value, row: { index } }) => (
          <EditableCheckbox
            checked={value}
            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurveTestPerformed')}
          />
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
    [testResults, handleInputChange, handleCheckboxChange, fetchTestDetails]
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        style={{
          position: 'fixed',
          top: `${modalPosition.top}px`,
          left: `${modalPosition.left}px`,
          width: '500px',
          maxHeight: '600px',
          overflowY: 'auto',
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

export default React.memo(LogResultsGrid);