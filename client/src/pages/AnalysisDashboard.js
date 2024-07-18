//import React, { useState, useEffect } from 'react';
//import { Container, Table, Header, Message } from 'semantic-ui-react';
//import axios from 'axios';
//
//const AnalysisDashboard = () => {
//  const [completedTests, setCompletedTests] = useState([]);
//  const [message, setMessage] = useState('');
//
//  useEffect(() => {
//    const fetchCompletedTests = async () => {
//      try {
//        const response = await axios.get('/api/engineer/completed-tests', {
//          headers: { Authorization: localStorage.getItem('token') }
//        });
//        setCompletedTests(response.data);
//      } catch (error) {
//        console.error('Error fetching completed tests:', error);
//        setMessage('Error fetching completed tests. Please try again.');
//      }
//    };
//
//    fetchCompletedTests();
//  }, []);
//
//  return (
//    <Container fluid>
//      <Header as='h2' textAlign="center" className="h2headers">Completed Tests Analysis</Header>
//      {message && <Message negative>{message}</Message>}
//      <div style={{ overflowX: 'auto' }}>
//        <Table celled compact selectable>
//          <Table.Header>
//            <Table.Row>
//              <Table.HeaderCell>Test ID</Table.HeaderCell>
//              <Table.HeaderCell>Owner</Table.HeaderCell>
//              <Table.HeaderCell>Test Engineer Email</Table.HeaderCell>
//              <Table.HeaderCell>Anode</Table.HeaderCell>
//              <Table.HeaderCell>Cathode</Table.HeaderCell>
//              <Table.HeaderCell>Membrane</Table.HeaderCell>
//              <Table.HeaderCell>Baseline</Table.HeaderCell>
//              <Table.HeaderCell>Hardware Number</Table.HeaderCell>
//              <Table.HeaderCell>Test Stand Channel</Table.HeaderCell>
//              <Table.HeaderCell>Days Under Test</Table.HeaderCell>
//              <Table.HeaderCell>Start Date</Table.HeaderCell>
//              <Table.HeaderCell>End Date</Table.HeaderCell>
//              <Table.HeaderCell>Scratch</Table.HeaderCell>
//              <Table.HeaderCell>Membrane Thickness (µm)</Table.HeaderCell>
//              <Table.HeaderCell>Notes</Table.HeaderCell>
//              <Table.HeaderCell>BoL Conductivity (µS/cm)</Table.HeaderCell>
//              <Table.HeaderCell>BoL pH</Table.HeaderCell>
//              <Table.HeaderCell>10 mM KOH Conductivity (µS/cm)</Table.HeaderCell>
//              <Table.HeaderCell>10 mM KOH pH</Table.HeaderCell>
//              <Table.HeaderCell>Recombination Layer Thickness (µm)</Table.HeaderCell>
//              <Table.HeaderCell>Recombination Layer Pt Loading (mg/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Cathode XRF Pt Loading (mg/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Cathode XRF Ru Loading (mg/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Cathode Ru:Pt (mass)</Table.HeaderCell>
//              <Table.HeaderCell>Anode Fe:Ni</Table.HeaderCell>
//              <Table.HeaderCell>Anode ICR (mOhm)</Table.HeaderCell>
//              <Table.HeaderCell>3-E ƞ at 20mAcm-2 (mV)</Table.HeaderCell>
//              <Table.HeaderCell>3-E Tafel Slope (mV/dec)</Table.HeaderCell>
//              <Table.HeaderCell>i @ 1.8 V DIW (A/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>i @ 1.8 V 10 mM KOH (A/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>H2 X-over Current Density at 1A/cm2 hold during breakin (mA/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>E @ 100 mA/cm2 DIW/V</Table.HeaderCell>
//              <Table.HeaderCell>E @ 100 mA/cm2 10 mM KOH/V</Table.HeaderCell>
//              <Table.HeaderCell>HFR DIW (mOhm cm2)</Table.HeaderCell>
//              <Table.HeaderCell>HFR 10 mM KOH (mOhm cm2)</Table.HeaderCell>
//              <Table.HeaderCell>EIR (Ohm-cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Q (F/cm2-s^(1-phi))</Table.HeaderCell>
//              <Table.HeaderCell>phi</Table.HeaderCell>
//              <Table.HeaderCell>Fraction Q Touching Membrane</Table.HeaderCell>
//              <Table.HeaderCell>Effective Ionic Conductivity (mS/cm)</Table.HeaderCell>
//              <Table.HeaderCell>Fitting Cost Function (units vary)</Table.HeaderCell>
//              <Table.HeaderCell>Fit Approved by Data Processor</Table.HeaderCell>
//              <Table.HeaderCell>Column1</Table.HeaderCell>
//              <Table.HeaderCell>Ionic Resistance 10 mM KOH (Ohm cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Q_int_frac DIW 10 mM KOH</Table.HeaderCell>
//              <Table.HeaderCell>DIW Conductivity (µS/cm)</Table.HeaderCell>
//              <Table.HeaderCell>Cell Conditions</Table.HeaderCell>
//              <Table.HeaderCell>Anode IL Loading (mg/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>Cathode IL Loading (mg/cm2)</Table.HeaderCell>
//              <Table.HeaderCell>E @ 100 mA/cm2</Table.HeaderCell>
//              <Table.HeaderCell>E @ 1A/cm2</Table.HeaderCell>
//              <Table.HeaderCell>X-over CD at 0A (0 barg)</Table.HeaderCell>
//              <Table.HeaderCell>X-over CD at 1A/cm2 (0 barg)</Table.HeaderCell>
//              <Table.HeaderCell>X-over CD at 0A (1.5 barg)</Table.HeaderCell>
//              <Table.HeaderCell>X-over CD at 1A/cm2 (1.5 barg)</Table.HeaderCell>
//            </Table.Row>
//          </Table.Header>
//          <Table.Body>
//            {completedTests.map(test => (
//              <Table.Row key={test.id}>
//                <Table.Cell>{test.id}</Table.Cell>
//                <Table.Cell>{test.owner}</Table.Cell>
//                <Table.Cell>{test.engineerEmail}</Table.Cell>
//                <Table.Cell>{test.anode}</Table.Cell>
//                <Table.Cell>{test.cathode}</Table.Cell>
//                <Table.Cell>{test.membrane}</Table.Cell>
//                <Table.Cell>{test.baseline}</Table.Cell>
//                <Table.Cell>{test.hardwareNumber}</Table.Cell>
//                <Table.Cell>{test.testStandChannel}</Table.Cell>
//                <Table.Cell>{test.daysUnderTest}</Table.Cell>
//                <Table.Cell>{new Date(test.startDate).toLocaleDateString()}</Table.Cell>
//                <Table.Cell>{new Date(test.endDate).toLocaleDateString()}</Table.Cell>
//                <Table.Cell>{test.scratch}</Table.Cell>
//                <Table.Cell>{test.membraneThickness}</Table.Cell>
//                <Table.Cell>{test.notes}</Table.Cell>
//                <Table.Cell>{test.bolConductivity}</Table.Cell>
//                <Table.Cell>{test.bolPh}</Table.Cell>
//                <Table.Cell>{test.kohConductivity}</Table.Cell>
//                <Table.Cell>{test.kohPh}</Table.Cell>
//                <Table.Cell>{test.recombination_layer_thickness}</Table.Cell>
//                <Table.Cell>{test.recombination_layer_pt_loading}</Table.Cell>
//                <Table.Cell>{test.cathode_xrf_pt_loading}</Table.Cell>
//                <Table.Cell>{test.cathode_xrf_ru_loading}</Table.Cell>
//                <Table.Cell>{test.cathode_ru_pt_mass}</Table.Cell>
//                <Table.Cell>{test.anode_fe_ni}</Table.Cell>
//                <Table.Cell>{test.anode_icr}</Table.Cell>
//                <Table.Cell>{test.e3_n_at_20mAcm2}</Table.Cell>
//                <Table.Cell>{test.e3_tafel_slope}</Table.Cell>
//                <Table.Cell>{test.i_at_1_8_v_diw}</Table.Cell>
//                <Table.Cell>{test.i_at_1_8_v_10mM_koh}</Table.Cell>
//                <Table.Cell>{test.h2_xover_current_density}</Table.Cell>
//                <Table.Cell>{test.e_at_100mAcm2_diw}</Table.Cell>
//                <Table.Cell>{test.e_at_100mAcm2_10mM_koh}</Table.Cell>
//                <Table.Cell>{test.hfr_diw}</Table.Cell>
//                <Table.Cell>{test.hfr_10mM_koh}</Table.Cell>
//                <Table.Cell>{test.eir}</Table.Cell>
//                <Table.Cell>{test.q}</Table.Cell>
//                <Table.Cell>{test.phi}</Table.Cell>
//                <Table.Cell>{test.fraction_q_touching_membrane}</Table.Cell>
//                <Table.Cell>{test.effective_ionic_conductivity}</Table.Cell>
//                <Table.Cell>{test.fitting_cost_function}</Table.Cell>
//                <Table.Cell>{test.fit_approved_by_data_processor}</Table.Cell>
//                <Table.Cell>{test.column1}</Table.Cell>
//                <Table.Cell>{test.ionic_resistance_10mM_koh}</Table.Cell>
//                <Table.Cell>{test.q_int_frac_diw_10mM_koh}</Table.Cell>
//                <Table.Cell>{test.diw_conductivity}</Table.Cell>
//                <Table.Cell>{test.cell_conditions}</Table.Cell>
//                <Table.Cell>{test.anode_il_loading}</Table.Cell>
//                <Table.Cell>{test.cathode_il_loading}</Table.Cell>
//                <Table.Cell>{test.e_at_100mAcm2}</Table.Cell>
//                <Table.Cell>{test.e_at_1Acm2}</Table.Cell>
//                <Table.Cell>{test.xover_cd_at_0A_0barg}</Table.Cell>
//                <Table.Cell>{test.xover_cd_at_1Acm2_0barg}</Table.Cell>
//                <Table.Cell>{test.xover_cd_at_0A_1_5barg}</Table.Cell>
//                <Table.Cell>{test.xover_cd_at_1Acm2_1_5barg}</Table.Cell>
//              </Table.Row>
//            ))}
//          </Table.Body>
//        </Table>
//      </div>
//    </Container>
//  );
//};
//
//export default AnalysisDashboard;

import React, { useState, useEffect } from 'react';
import { Container, Table, Header, Message } from 'semantic-ui-react';
import axios from 'axios';

const AnalysisDashboard = () => {
  const [completedTests, setCompletedTests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        const response = await axios.get('/api/engineer/completed-tests', {
          headers: { Authorization: localStorage.getItem('token') }
        });
        setCompletedTests(response.data);
      } catch (error) {
        console.error('Error fetching completed tests:', error);
        setMessage('Error fetching completed tests. Please try again.');
      }
    };

    fetchCompletedTests();
  }, []);

  return (
    <Container fluid>
      <Header as='h2' textAlign="center" className="h2headers">Completed Tests Analysis</Header>
      {message && <Message negative>{message}</Message>}
      <div style={{ overflowX: 'auto' }}>
        <Table celled compact selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Test Codes</Table.HeaderCell>
              <Table.HeaderCell>Anode</Table.HeaderCell>
              <Table.HeaderCell>Cathode</Table.HeaderCell>
              <Table.HeaderCell>Membrane</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
              <Table.HeaderCell>Baseline</Table.HeaderCell>
              <Table.HeaderCell>Hardware Number</Table.HeaderCell>
              <Table.HeaderCell>Test Stand Channel</Table.HeaderCell>
              <Table.HeaderCell>Days Under Test</Table.HeaderCell>
              <Table.HeaderCell>Start Date</Table.HeaderCell>
              <Table.HeaderCell>End Date</Table.HeaderCell>
              <Table.HeaderCell>Scratch</Table.HeaderCell>
              <Table.HeaderCell>Membrane Thickness (µm)</Table.HeaderCell>
              <Table.HeaderCell>Notes</Table.HeaderCell>
              <Table.HeaderCell>BoL Conductivity (µS/cm)</Table.HeaderCell>
              <Table.HeaderCell>BoL pH</Table.HeaderCell>
              <Table.HeaderCell>10 mM KOH Conductivity (µS/cm)</Table.HeaderCell>
              <Table.HeaderCell>10 mM KOH pH</Table.HeaderCell>
              <Table.HeaderCell>Recombination Layer Thickness (µm)</Table.HeaderCell>
              <Table.HeaderCell>Recombination Layer Pt Loading (mg/cm2)</Table.HeaderCell>
              <Table.HeaderCell>Cathode XRF Pt Loading (mg/cm2)</Table.HeaderCell>
              <Table.HeaderCell>Cathode XRF Ru Loading (mg/cm2)</Table.HeaderCell>
              <Table.HeaderCell>Cathode Ru:Pt (mass)</Table.HeaderCell>
              <Table.HeaderCell>Anode Fe:Ni</Table.HeaderCell>
              <Table.HeaderCell>Anode ICR (mOhm)</Table.HeaderCell>
              <Table.HeaderCell>3-E ƞ at 20mAcm-2 (mV)</Table.HeaderCell>
              <Table.HeaderCell>3-E Tafel Slope (mV/dec)</Table.HeaderCell>
              <Table.HeaderCell>i @ 1.8 V DIW (A/cm2)</Table.HeaderCell>
              <Table.HeaderCell>i @ 1.8 V 10 mM KOH (A/cm2)</Table.HeaderCell>
              <Table.HeaderCell>H2 X-over Current Density at 1A/cm2 hold during breakin (mA/cm2)</Table.HeaderCell>
              <Table.HeaderCell>E @ 100 mA/cm2 DIW/V</Table.HeaderCell>
              <Table.HeaderCell>E @ 100 mA/cm2 10 mM KOH/V</Table.HeaderCell>
              <Table.HeaderCell>HFR DIW (mOhm cm2)</Table.HeaderCell>
              <Table.HeaderCell>HFR 10 mM KOH (mOhm cm2)</Table.HeaderCell>
              <Table.HeaderCell>EIR (Ohm-cm2)</Table.HeaderCell>
              <Table.HeaderCell>Q (F/cm2-s^(1-phi))</Table.HeaderCell>
              <Table.HeaderCell>phi</Table.HeaderCell>
              <Table.HeaderCell>Fraction Q Touching Membrane</Table.HeaderCell>
              <Table.HeaderCell>Effective Ionic Conductivity (mS/cm)</Table.HeaderCell>
              <Table.HeaderCell>Fitting Cost Function (units vary)</Table.HeaderCell>
              <Table.HeaderCell>Fit Approved by Data Processor</Table.HeaderCell>
              <Table.HeaderCell>Ionic Resistance 10 mM KOH (Ohm cm2)</Table.HeaderCell>
              <Table.HeaderCell>Q_int_frac DIW 10 mM KOH</Table.HeaderCell>
              <Table.HeaderCell>DIW Conductivity (µS/cm)</Table.HeaderCell>
              <Table.HeaderCell>Cell Conditions</Table.HeaderCell>
              <Table.HeaderCell>Anode IL Loading (mg/cm2)</Table.HeaderCell>
              <Table.HeaderCell>Cathode IL Loading (mg/cm2)</Table.HeaderCell>
              <Table.HeaderCell>E @ 100 mA/cm2</Table.HeaderCell>
              <Table.HeaderCell>E @ 1A/cm2</Table.HeaderCell>
              <Table.HeaderCell>X-over CD at 0A (0 barg)</Table.HeaderCell>
              <Table.HeaderCell>X-over CD at 1A/cm2 (0 barg)</Table.HeaderCell>
              <Table.HeaderCell>X-over CD at 0A (1.5 barg)</Table.HeaderCell>
              <Table.HeaderCell>X-over CD at 1A/cm2 (1.5 barg)</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {completedTests.map(test => (
              <Table.Row>
                <Table.Cell>{test.test_codes}</Table.Cell>
                <Table.Cell>{test.anode}</Table.Cell>
                <Table.Cell>{test.cathode}</Table.Cell>
                <Table.Cell>{test.membrane}</Table.Cell>
                <Table.Cell>{test.owner}</Table.Cell>
                <Table.Cell>{test.baseline}</Table.Cell>
                <Table.Cell>{test.hardwareNumber}</Table.Cell>
                <Table.Cell>{test.testStandChannel}</Table.Cell>
                <Table.Cell>{test.daysUnderTest}</Table.Cell>
                <Table.Cell>{test.startDate}</Table.Cell>
                <Table.Cell>{test.endDate}</Table.Cell>
                <Table.Cell>{test.scratch}</Table.Cell>
                <Table.Cell>{test.membraneThickness}</Table.Cell>
                <Table.Cell>{test.notes}</Table.Cell>
                <Table.Cell>{test.bolConductivity}</Table.Cell>
                <Table.Cell>{test.bolPh}</Table.Cell>
                <Table.Cell>{test.kohConductivity}</Table.Cell>
                <Table.Cell>{test.kohPh}</Table.Cell>
                <Table.Cell>{test.recombination_layer_thickness}</Table.Cell>
                <Table.Cell>{test.recombination_layer_pt_loading}</Table.Cell>
                <Table.Cell>{test.cathode_xrf_pt_loading}</Table.Cell>
                <Table.Cell>{test.cathode_xrf_ru_loading}</Table.Cell>
                <Table.Cell>{test.cathode_ru_pt_mass}</Table.Cell>
                <Table.Cell>{test.anode_fe_ni}</Table.Cell>
                <Table.Cell>{test.anode_icr}</Table.Cell>
                <Table.Cell>{test.e3_n_at_20mAcm2}</Table.Cell>
                <Table.Cell>{test.e3_tafel_slope}</Table.Cell>
                <Table.Cell>{test.i_at_1_8_v_diw}</Table.Cell>
                <Table.Cell>{test.i_at_1_8_v_10mM_koh}</Table.Cell>
                <Table.Cell>{test.h2_xover_current_density}</Table.Cell>
                <Table.Cell>{test.e_at_100mAcm2_diw}</Table.Cell>
                <Table.Cell>{test.e_at_100mAcm2_10mM_koh}</Table.Cell>
                <Table.Cell>{test.hfr_diw}</Table.Cell>
                <Table.Cell>{test.hfr_10mM_koh}</Table.Cell>
                <Table.Cell>{test.eir}</Table.Cell>
                <Table.Cell>{test.q}</Table.Cell>
                <Table.Cell>{test.phi}</Table.Cell>
                <Table.Cell>{test.fraction_q_touching_membrane}</Table.Cell>
                <Table.Cell>{test.effective_ionic_conductivity}</Table.Cell>
                <Table.Cell>{test.fitting_cost_function}</Table.Cell>
                <Table.Cell>{test.fit_approved_by_data_processor}</Table.Cell>
                <Table.Cell>{test.ionic_resistance_10mM_koh}</Table.Cell>
                <Table.Cell>{test.q_int_frac_diw_10mM_koh}</Table.Cell>
                <Table.Cell>{test.diw_conductivity}</Table.Cell>
                <Table.Cell>{test.cell_conditions}</Table.Cell>
                <Table.Cell>{test.anode_il_loading}</Table.Cell>
                <Table.Cell>{test.cathode_il_loading}</Table.Cell>
                <Table.Cell>{test.e_at_100mAcm2}</Table.Cell>
                <Table.Cell>{test.e_at_1Acm2}</Table.Cell>
                <Table.Cell>{test.xover_cd_at_0A_0barg}</Table.Cell>
                <Table.Cell>{test.xover_cd_at_1Acm2_0barg}</Table.Cell>
                <Table.Cell>{test.xover_cd_at_0A_1_5barg}</Table.Cell>
                <Table.Cell>{test.xover_cd_at_1Acm2_1_5barg}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    </Container>
  );
};

export default AnalysisDashboard;

