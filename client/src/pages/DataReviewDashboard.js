import React, { useState } from 'react';
import { Container, Input, Button, Table, Header, Grid, Dropdown, Message } from 'semantic-ui-react';
import axios from 'axios';
import ChartModal from './ChartModal';
import ChartComponent from './ChartComponent';

const DataReviewDashboard = () => {
  const [testCode, setTestCode] = useState('');
  const [testDetails, setTestDetails] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [messages, setMessages] = useState(['', '']);
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false); // New state to track file upload status
  const [dropdown1, setDropdown1] = useState('');
  const [dropdown2, setDropdown2] = useState('');
  const [trendMessages, setTrendMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [chartConfigs, setChartConfigs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [testCounts, setTestCounts] = useState({
    test1Count: 1,
    test2Count: 1,
    test3Count: 0,
    test4Count: 2,
  });

  // Added for performance snapshot
  const [performanceMessages, setPerformanceMessages] = useState(['', '']);
  const [performanceChartConfigs, setPerformanceChartConfigs] = useState([]);

  const handleSubmit = async () => {
    try {
      console.log('Fetching data for test code:', testCode);
      const response = await axios.get(`/api/engineer/test-details/${testCode}`);
      console.log('Fetched test details:', response.data);
      setTestDetails(response.data);
    } catch (error) {
      console.error('Error fetching test details:', error);
    }
  };

  const handleTestClick = (testNumber) => {
    console.log(`Test ${testNumber} clicked`);
    if (selectedTests.includes(testNumber)) {
      setSelectedTests(selectedTests.filter((test) => test !== testNumber));
    } else {
      if (selectedTests.length < 2) {
        setSelectedTests([...selectedTests, testNumber]);
      } else {
        alert('You can only select up to two tests.');
      }
    }
  };

  const handlePlotPerformanceTests = async () => {
    if (!fileUploaded) {
      setErrorMessage('Please upload analysis file to view graphs');
      return;
    }

    console.log('Plotting performance tests:', selectedTests);

    const newPerformanceConfigs = [];

    for (const testNumber of selectedTests) {
      let endpoint = '';

      switch (testNumber) {
        case 2:
          endpoint = '/api/engineer/polcurve-diw';
          break;
        case 3:
          endpoint = '/api/engineer/polcurve-10mm';
          break;
        case 4:
          endpoint = '/api/engineer/test4';
          break;
        default:
          break;
      }

      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          newPerformanceConfigs.push(response.data);
        } catch (error) {
          console.error(`Error fetching chart config for Test ${testNumber}:`, error);
        }
      }
    }

    setPerformanceChartConfigs(newPerformanceConfigs);

    const updatedPerformanceMessages = selectedTests.map(
      (testNumber) => `Performance graph for Test ${testNumber}`
    );
    setPerformanceMessages(updatedPerformanceMessages);
  };

  const handlePlotTrend = async () => {
    if (!fileUploaded) {
      setErrorMessage('Please upload analysis file to view graphs');
      return;
    }

    if (trendMessages.length >= 2) {
      setErrorMessage('Only two trends can be plotted, please refresh to plot more.');
      return;
    }

    if (dropdown1 && dropdown2) {
      let endpoint = '';
      let xAxisLabel = '';
      let yAxisLabel = '';

      if (dropdown1 === 'Pol Curve' && dropdown2 === 'DIW') {
        endpoint = '/api/engineer/polcurve-diw';
        xAxisLabel = 'Current Density (A/cm²)';
        yAxisLabel = 'Voltage (V)';
      } else if (dropdown1 === 'Pol Curve' && dropdown2 === '10mM') {
        endpoint = '/api/engineer/polcurve-10mm';
        xAxisLabel = 'Current Density (A/cm²)';
        yAxisLabel = 'Voltage (V)';
      } else if (dropdown1 === 'Steady State' && dropdown2 === 'DIW') {
        endpoint = '/api/engineer/steadystate-diw';
        xAxisLabel = 'Time (hr)';
        yAxisLabel = 'Cell Potential (V)';
      } else if (dropdown1 === 'Steady State' && dropdown2 === '10mM') {
        endpoint = '/api/engineer/steadystate-10mm';
        xAxisLabel = 'Time (hr)';
        yAxisLabel = 'Cell Potential (V)';
      }

      if (endpoint) {
        try {
          const response = await axios.get(endpoint);
          const config = response.data;
          setChartConfigs((prevConfigs) => {
            const newConfigs = [...prevConfigs];
            newConfigs[trendMessages.length] = config;
            return newConfigs;
          });
          setTrendMessages([...trendMessages, `Plotting trend for ${dropdown1} with ${dropdown2}`]);
          setErrorMessage('');
        } catch (error) {
          console.error('Error fetching chart config:', error);
          setErrorMessage('Error fetching chart config.');
        }
      } else {
        setErrorMessage('Invalid combination');
      }
    } else {
      setErrorMessage('Please select both options to plot a trend.');
    }
  };

  const handleRefresh = () => {
    setSelectedTests([]);
    setMessages(['', '']);
    setPerformanceChartConfigs([]);  // Discard the performance charts
    setPerformanceMessages(['', '']);  // Clear performance messages
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('/api/engineer/excel-analyzer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token'),
        },
      });
      console.log('File uploaded successfully:', response.data);
      setTestCounts(response.data.counts);
      setFileUploaded(true);// Set file upload status to true
      setErrorMessage('');  // Clear the error message
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleDropdown1Change = (e, { value }) => {
    setDropdown1(value);
  };

  const handleDropdown2Change = (e, { value }) => {
    setDropdown2(value);
  };

  const handleRefreshTrend = () => {
    setDropdown1('');
    setDropdown2('');
    setTrendMessages([]);
    setChartConfigs([]);
    setErrorMessage('');
  };

  const handleChartClick = (config) => {
    setModalConfig(config);
    setModalOpen(true);
  };

  const options1 = [
    { key: 'steady', text: 'Steady State', value: 'Steady State' },
    { key: 'polcurve', text: 'Pol Curve', value: 'Pol Curve' },
  ];

  const options2 = [
    { key: 'diw', text: 'DIW', value: 'DIW' },
    { key: '10mm', text: '10mM', value: '10mM' },
  ];

  return (
    <Container style={{ width: '100%', maxWidth: '1200px', margin: 'auto' }}>
      <Header as='h3'>Data Review Dashboard</Header>
      <Grid columns={3} stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Input type='file' onChange={handleFileChange} />
            <Button onClick={handleFileUpload}>Upload Excel</Button>
          </Grid.Column>
          {/* Error Message Display */}
            {errorMessage && (
              <Grid.Column width={16}>
                <Message negative>
                  <Message.Header>Error</Message.Header>
                  <p>{errorMessage}</p>
                </Message>
              </Grid.Column>
            )}
        </Grid.Row>

        <Grid.Row>
          {/* First Section: Cell # and Test Table */}
          <Grid.Column width={5}>
            <Header as='h3'>Cell #</Header>
            <Input
              placeholder='Enter Test Code'
              value={testCode}
              onChange={(e) => setTestCode(e.target.value)}
              fluid
            />
            <Button onClick={handleSubmit} fluid style={{ marginBottom: '10px' }}>
              Submit
            </Button>

            {testDetails && (
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Owner:</strong> {testDetails.owner}</p>
                <p><strong>Anode:</strong> {testDetails.anode}</p>
                <p><strong>Cathode:</strong> {testDetails.cathode}</p>
                <p><strong>Membrane:</strong> {testDetails.membrane}</p>
                <p><strong>Hardware Number:</strong> {testDetails.hardwareNumber}</p>
                <p><strong>Test Stand Channel:</strong> {testDetails.testStandChannel}</p>
              </div>
            )}

            <Header as='h3'>Test Table</Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Test#</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Count</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row
                                  onClick={() => handleTestClick(1)}
                                  className={selectedTests.includes(1) ? 'selected-row' : ''}
                                >
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>Break-in</Table.Cell>
                  <Table.Cell>{testCounts.test1Count}</Table.Cell>
                </Table.Row>
                <Table.Row
                                  onClick={() => handleTestClick(2)}
                                  className={selectedTests.includes(2) ? 'selected-row' : ''}
                                >
                  <Table.Cell>2</Table.Cell>
                  <Table.Cell>1 mM Pol-Curve</Table.Cell>
                  <Table.Cell>{testCounts.test2Count}</Table.Cell>
                </Table.Row>
                <Table.Row
                                  onClick={() => handleTestClick(3)}
                                  className={selectedTests.includes(3) ? 'selected-row' : ''}
                                >
                  <Table.Cell>3</Table.Cell>
                  <Table.Cell>10 mM PolCurve</Table.Cell>
                  <Table.Cell>{testCounts.test3Count}</Table.Cell>
                </Table.Row>
                <Table.Row
                                  onClick={() => handleTestClick(4)}
                                  className={selectedTests.includes(4) ? 'selected-row' : ''}
                                >
                  <Table.Cell>4</Table.Cell>
                  <Table.Cell>1 mM - EIS</Table.Cell>
                  <Table.Cell>{testCounts.test4Count}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
            <Button onClick={handlePlotPerformanceTests} disabled={selectedTests.length === 0} fluid>
              Plot Tests
            </Button>
            <Button onClick={handleRefresh} style={{ marginTop: '10px' }} fluid>
              Refresh
            </Button>
          </Grid.Column>

          {/* Second Section: Performance Snapshot */}
          <Grid.Column width={5}>
            <Header as='h3'>Performance Snapshot</Header>
            {performanceChartConfigs.map((config, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <ChartComponent
                  config={config}
                  onExpand={() => handleChartClick(config)}
                />
                <p>{performanceMessages[index]}</p>
              </div>
            ))}
          </Grid.Column>

          {/* Third Section: Durability Trends */}
          <Grid.Column width={6}>
            <Header as='h3'>Durability Trends</Header>
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Dropdown
                    placeholder='Select state'
                    fluid
                    selection
                    options={options1}
                    value={dropdown1}
                    onChange={handleDropdown1Change}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Dropdown
                    placeholder='Select Electrolyte'
                    fluid
                    selection
                    options={options2}
                    value={dropdown2}
                    onChange={handleDropdown2Change}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Button.Group fluid>
                    <Button onClick={handlePlotTrend}>Plot Trend</Button>
                    <Button onClick={handleRefreshTrend}>Refresh</Button>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                {chartConfigs.map((config, index) => (
                  <Grid.Column key={index}>
                    <ChartComponent
                      config={config}
                      onExpand={() => handleChartClick(config)}
                    />
                    <p>{trendMessages[index]}</p>
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <ChartModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        config={modalConfig}
      />
    </Container>
  );
};

export default DataReviewDashboard;