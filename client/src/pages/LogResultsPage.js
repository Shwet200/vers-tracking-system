import React, { useState, useEffect } from 'react';
import { Container, Form, TextArea, Button, Checkbox, Message, Header } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogResultsPage = () => {
  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [bolPh, setBolPh] = useState('');
  const [comments, setComments] = useState('');
  const [hardwareNumber, setHardwareNumber] = useState('');
  const [testStandChannel, setTestStandChannel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [daysUnderTest, setDaysUnderTest] = useState('');
  const [notes, setNotes] = useState('');
  const [scratch, setScratch] = useState('');
  const [membraneThickness, setMembraneThickness] = useState('');
  const [bolConductivity, setBolConductivity] = useState('');
  const [kohConductivity, setKohConductivity] = useState('');
  const [kohPh, setKohPh] = useState('');
  const [message, setMessage] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [testCode, setTestCode] = useState('');
  const [updateCathodeXrfPtLoading, setUpdateCathodeXrfPtLoading] = useState(false);
  const [cathodeXrfPtLoading, setCathodeXrfPtLoading] = useState('');
  const [updateCathodeXrfRuLoading, setUpdateCathodeXrfRuLoading] = useState(false);
  const [cathodeXrfRuLoading, setCathodeXrfRuLoading] = useState('');
  const [updateAnodeFeNi, setUpdateAnodeFeNi] = useState(false);
  const [anodeFeNi, setAnodeFeNi] = useState('');
  const [slowPolCurveTestPerformed, setSlowPolCurveTestPerformed] = useState(false);
  const [recombinationLayerThickness, setRecombinationLayerThickness] = useState('');
  const [recombinationLayerPtLoading, setRecombinationLayerPtLoading] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`/api/engineer/tests/${testId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setTestDetails(response.data);
      } catch (error) {
        console.error('Error fetching test details:', error);
        setMessage('Error fetching test details. Please try again.');
      }
    };

    fetchTestDetails();
  }, [testId]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUnderTest(diffDays);
    }
  }, [startDate, endDate]);

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('testRequestId', testId);
    formData.append('testCompleted', testCompleted);
    formData.append('bolPh', bolPh);
    formData.append('comments', comments);
    formData.append('hardwareNumber', hardwareNumber);
    formData.append('testStandChannel', testStandChannel);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('daysUnderTest', daysUnderTest);
    formData.append('notes', notes);
    formData.append('scratch', scratch);
    formData.append('membraneThickness', membraneThickness);
    formData.append('bolConductivity', bolConductivity);
    formData.append('kohConductivity', kohConductivity);
    formData.append('kohPh', kohPh);
    formData.append('test_codes', testCode);
    formData.append('slowPolCurveTestPerformed', slowPolCurveTestPerformed);
    formData.append('recombinationLayerThickness', recombinationLayerThickness || 'N/A');
    formData.append('recombinationLayerPtLoading', recombinationLayerPtLoading || 'N/A');
    if (updateCathodeXrfPtLoading) {
      formData.append('updateCathodeXrfPtLoading', 'yes');
      formData.append('cathode_xrf_pt_loading', cathodeXrfPtLoading);
    }
    if (updateCathodeXrfRuLoading) {
      formData.append('updateCathodeXrfRuLoading', 'yes');
      formData.append('cathode_xrf_ru_loading', cathodeXrfRuLoading);
    }
    if (updateAnodeFeNi) {
      formData.append('updateAnodeFeNi', 'yes');
      formData.append('anode_fe_ni', anodeFeNi);
    }
    if (excelFile) {
      formData.append('excelFile', excelFile);
    }

    // Calculate cathode_ru_pt_mass based on updated values
    if (updateCathodeXrfPtLoading && updateCathodeXrfRuLoading) {
      const ruPtMass = parseFloat(cathodeXrfRuLoading) / parseFloat(cathodeXrfPtLoading);
      formData.append('updateCathodeRuPtMass', 'yes');
      formData.append('cathode_ru_pt_mass', ruPtMass.toString());
    } else if (updateCathodeXrfRuLoading) {
      const ruPtMass = parseFloat(cathodeXrfRuLoading) / parseFloat(testDetails.cathode_xrf_pt_loading || 1);
      formData.append('updateCathodeRuPtMass', 'yes');
      formData.append('cathode_ru_pt_mass', ruPtMass.toString());
    } else if (updateCathodeXrfPtLoading) {
      const ruPtMass = parseFloat(testDetails.cathode_xrf_ru_loading || 1) / parseFloat(cathodeXrfPtLoading);
      formData.append('updateCathodeRuPtMass', 'yes');
      formData.append('cathode_ru_pt_mass', ruPtMass.toString());
    }


    try {
      const response = await axios.post('/api/engineer/log-results', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: localStorage.getItem('token')
        }
      });
      setMessage(response.data.message);
      setTestCompleted(false);
      setBolPh('');
      setComments('');
      setHardwareNumber('');
      setTestStandChannel('');
      setStartDate('');
      setEndDate('');
      setDaysUnderTest('');
      setNotes('');
      setScratch('');
      setMembraneThickness('');
      setBolConductivity('');
      setKohConductivity('');
      setKohPh('');
      setExcelFile(null);
      setTestCode('');
      setUpdateCathodeXrfPtLoading(false);
      setCathodeXrfPtLoading('');
      setUpdateCathodeXrfRuLoading(false);
      setCathodeXrfRuLoading('');
      setUpdateAnodeFeNi(false);
      setAnodeFeNi('');
      setSlowPolCurveTestPerformed(false);
      navigate('/dashboard/testengineer');
    } catch (error) {
      console.error('Error logging results:', error);
      setMessage('Error logging results. Please try again.');
    }
  };

  return (
    <Container>
      <Header as='h2' textAlign="center">Log Test Results for Request ID: {testId}</Header>
      {message && <Message positive={message.includes('successfully')} negative={!message.includes('successfully')}>{message}</Message>}
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Test Details</label>
          <pre>{JSON.stringify(testDetails, null, 2)}</pre>
        </Form.Field>
        <Form.Field>
          <label>Test Completed</label>
          <Checkbox
            checked={testCompleted}
            onChange={() => setTestCompleted(!testCompleted)}
          />
        </Form.Field>
        <Form.Field required>
          <label>BoL pH</label>
          <input
            type="number"
            value={bolPh}
            onChange={(e) => setBolPh(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field required>
          <label>Hardware Number</label>
          <input
            type="text"
            value={hardwareNumber}
            onChange={(e) => setHardwareNumber(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field required>
          <label>Test Stand Channel</label>
          <input
            type="text"
            value={testStandChannel}
            onChange={(e) => setTestStandChannel(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field required>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field required>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Days Under Test</label>
          <input
            type="number"
            value={daysUnderTest}
            readOnly
          />
        </Form.Field>
        <Form.Field>
          <label>Notes</label>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Scratch</label>
          <input
            type="text"
            value={scratch}
            onChange={(e) => setScratch(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Membrane Thickness (µm)</label>
          <input
            type="number"
            value={membraneThickness}
            onChange={(e) => setMembraneThickness(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>BoL Conductivity (µS/cm)</label>
          <input
            type="number"
            value={bolConductivity}
            onChange={(e) => setBolConductivity(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>10 mM KOH Conductivity (µS/cm)</label>
          <input
            type="number"
            value={kohConductivity}
            onChange={(e) => setKohConductivity(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>10 mM KOH pH</label>
          <input
            type="number"
            value={kohPh}
            onChange={(e) => setKohPh(e.target.value)}
          />
        </Form.Field>
        <Form.Field required>
          <label>Test Code</label>
          <input
            type="text"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            required
          />
        </Form.Field>
        <Form.Field>
          <label>Upload Excel</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Do you want to report an updated Cathode XRF Pt loading (mg/cm2)?</label>
          <Checkbox
            checked={updateCathodeXrfPtLoading}
            onChange={() => setUpdateCathodeXrfPtLoading(!updateCathodeXrfPtLoading)}
          />
          {updateCathodeXrfPtLoading && (
            <input
              type="number"
              value={cathodeXrfPtLoading}
              onChange={(e) => setCathodeXrfPtLoading(e.target.value)}
            />
          )}
        </Form.Field>
        <Form.Field>
          <label>Do you want to report an updated Cathode XRF Ru loading (mg/cm2)?</label>
          <Checkbox
            checked={updateCathodeXrfRuLoading}
            onChange={() => setUpdateCathodeXrfRuLoading(!updateCathodeXrfRuLoading)}
          />
          {updateCathodeXrfRuLoading && (
            <input
              type="number"
              value={cathodeXrfRuLoading}
              onChange={(e) => setCathodeXrfRuLoading(e.target.value)}
            />
          )}
        </Form.Field>
        <Form.Field>
          <label>Do you want to report an updated Anode Fe:Ni?</label>
          <Checkbox
            checked={updateAnodeFeNi}
            onChange={() => setUpdateAnodeFeNi(!updateAnodeFeNi)}
          />
          {updateAnodeFeNi && (
            <input
              type="number"
              value={anodeFeNi}
              onChange={(e) => setAnodeFeNi(e.target.value)}
            />
          )}
        </Form.Field>
        <Form.Field>
          <label>Do you have a Recombination layer thickness (µm) value to report?</label>
          <input
            type="number"
            value={recombinationLayerThickness}
            onChange={(e) => setRecombinationLayerThickness(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Do you have a Recombination layer Pt loading (mg/cm2) value to report?</label>
          <input
            type="number"
            value={recombinationLayerPtLoading}
            onChange={(e) => setRecombinationLayerPtLoading(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
                  <label>Was slow pol curve test performed?</label>
                  <Checkbox
                    checked={slowPolCurveTestPerformed}
                    onChange={() => setSlowPolCurveTestPerformed(!slowPolCurveTestPerformed)}
          />
        </Form.Field>
        <Form.Field>
          <label>Comments</label>
          <TextArea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Form.Field>
        <Button type='submit'>Submit Results</Button>
      </Form>
    </Container>
  );
};

export default LogResultsPage;
