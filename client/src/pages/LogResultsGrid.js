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
        console.log('Fetching test results...');
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await axios.get('/api/engineer/tests/results', {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setTestResults(response.data);
        console.log('Fetched test results:', response.data);
      } catch (error) {
        console.error('Error fetching test results:', error);
        setMessage('Error fetching test results. Please try again.');
      }
    };

    fetchTests();
  }, []);

  const calculateDaysUnderTest = (startDate, endDate) => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && end && !isNaN(start) && !isNaN(end)) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return '';
  };

  const handleInputChange = (e, index, columnId) => {
    const value = e.target.value;
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

      if (columnId === 'cathodeXrfPtLoading' || columnId === 'cathodeXrfRuLoading') {
        const cathodePtLoading = parseFloat(updatedResults[index].cathodeXrfPtLoading) || 0;
        const cathodeRuLoading = parseFloat(updatedResults[index].cathodeXrfRuLoading) || 0;
        updatedResults[index].cathode_ru_pt_mass =
          cathodePtLoading > 0 ? cathodeRuLoading / cathodePtLoading : null;
      }

      console.log('Updated testResults:', updatedResults);
      return updatedResults;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  const handleCheckboxChange = (value, index, columnId) => {
    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = {
        ...updatedResults[index],
        [columnId]: value,
      };
      console.log('Updated testResults:', updatedResults);
      return updatedResults;
    });
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    setTestResults((prevResults) => {
      const updatedResults = [...prevResults];
      updatedResults[index] = {
        ...updatedResults[index],
        excelFile: file,
      };
      console.log('Updated testResults:', updatedResults);
      return updatedResults;
    });
  };

  const fetchTestDetails = async (id, event) => {
    try {
      const response = await axios.get(`/api/engineer/tests/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      console.log('Fetched test details for ID:', id, response.data);
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
  };

  const sendTestResult = async (payload) => {
    try {
      const formData = new FormData();
      formData.append('testResults', JSON.stringify(payload.testResults));
      formData.append('action', payload.action);

      if (payload.testResults[0].excelFile) {
        formData.append('excelFile', payload.testResults[0].excelFile);
      }

      console.log('FormData to be sent:');
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post('http://localhost:5000/api/engineer/log-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });

      console.log('Response:', response.data);
      setMessage(response.data.message || 'Operation successful');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error logging results. Please try again.');
    }
  };

  const handleSave = (index) => {
    setTestResults((prevResults) => {
      const testResult = prevResults[index];
      if (!testResult) return prevResults;

      const mappedTestResult = {
        testRequestId: testResult.testRequestId,
        testCompleted: false, // Set to false for save action
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
        cathode_xrf_pt_loading: parseFloat(testResult.cathodeXrfPtLoading) || null,
        cathode_xrf_ru_loading: parseFloat(testResult.cathodeXrfRuLoading) || null,
        cathode_ru_pt_mass: parseFloat(testResult.cathodeRuPtMass) || null,
        anode_fe_ni: parseFloat(testResult.anodeFeNi) || null,
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
  };

  const handleComplete = (index) => {
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
        cathode_xrf_pt_loading: parseFloat(testResult.cathodeXrfPtLoading) || null,
        cathode_xrf_ru_loading: parseFloat(testResult.cathodeXrfRuLoading) || null,
        cathode_ru_pt_mass: parseFloat(testResult.cathodeRuPtMass) || null,
        anode_fe_ni: parseFloat(testResult.anodeFeNi) || null,
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
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Test ID',
        accessor: 'testRequestId', // Changed to testRequestId
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
      value={formatDate(value) || ''}
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
      value={formatDate(value) || ''}
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
        accessor: 'slowPolCurveTestPerformed',
        Cell: ({ value, row: { index } }) => (
          <Checkbox
            checked={value || false}
            onChange={(e, data) => handleCheckboxChange(data.checked, index, 'slowPolCurveTestPerformed')}
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

export default LogResultsGrid;