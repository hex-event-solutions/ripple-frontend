import React from 'react'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'

const RippleSpinner = (props) => {
  const { inline } = props

  const content = <Spinner animation='border' size='sm' />

  if (inline) return content

  return (
    <Container fluid>
      <Row>
        <Col>
          { content }
        </Col>
      </Row>
    </Container>
  )
}

export default RippleSpinner
