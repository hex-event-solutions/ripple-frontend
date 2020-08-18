import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Pricing = () => {
  return (
    <Container fluid>
      <Row>
        <Col sm={{span: 10, offset: 1}}>
          <h1>We're currently running an open beta, completely free of charge</h1>
          <br />
          <h1>If you'd like to get involved and try out the platform, please contact <a href='mailto:ripple@hexes.co.uk'>ripple@hexes.co.uk</a> to get started</h1>
        </Col>
      </Row>
    </Container>
  )
}

export default Pricing
