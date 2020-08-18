import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import ClientType from './settings/client_type/ClientType'
import DocumentState from './settings/document_state/DocumentState'
import DocumentType from './settings/document_type/DocumentType'
import MaintenanceResolution from './settings/maintenance_resolution/MaintenanceResolution'
import MaintenanceType from './settings/maintenance_type/MaintenanceType'
import Heading from '../../elements/Heading'

const Settings = () => {
  return (
    <Container fluid>
      <Heading title='Global settings' />
      <Row>
        <Col>
          <p>Here you can customise all of the static parts of Ripple to suit your company needs</p>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <DocumentState />
        </Col>
        <Col sm={6}>
          <DocumentType />
        </Col>
        <Col sm={6}>
          <MaintenanceResolution />
        </Col>
        <Col sm={6}>
          <MaintenanceType />
        </Col>
        <Col sm={6}>
          <ClientType />
        </Col>
      </Row>
    </Container>
  )
}

export default Settings
