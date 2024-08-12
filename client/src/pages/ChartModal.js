//import React from 'react';
//import { Modal, Button } from 'semantic-ui-react';
//import ChartComponent from './ChartComponent';
//
//const ChartModal = ({ open, onClose, config }) => (
//  <Modal open={open} onClose={onClose} size='large'>
//    <Modal.Header>Expanded Chart View</Modal.Header>
//    <Modal.Content>
//      <ChartComponent config={config} />
//    </Modal.Content>
//    <Modal.Actions>
//      <Button onClick={onClose}>Close</Button>
//    </Modal.Actions>
//  </Modal>
//);
//
//export default ChartModal;

import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import ChartComponent from './ChartComponent';

const ChartModal = ({ open, onClose, config }) => (
  <Modal open={open} onClose={onClose} size='large'>
    <Modal.Header>Expanded Chart View</Modal.Header>
    <Modal.Content>
      <div style={{ height: '80vh' }}>
        <ChartComponent config={config} />
      </div>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose}>Close</Button>
    </Modal.Actions>
  </Modal>
);

export default ChartModal;
