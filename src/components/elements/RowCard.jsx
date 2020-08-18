import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

const RowCard = props => {
  const { offset, span, transparent, right, heading, icon, children, ...others } = props

  var classes = ''
  classes += transparent ? 'bg-transparent ' : ''

  const iconSection = (
    <Col sm={2} className='my-auto'>
      <FontAwesomeIcon icon={ icon } size='5x' />
    </Col>
  )

  const bodySection = (
    <Col sm={10} className='my-auto'>
      <Card.Title>
        <h1>{ heading }</h1>
      </Card.Title>
      { children }
    </Col>
  )

  var content
  if (right) {
    classes += 'text-right'
    content = (
      <Row className='home-row'>
        { bodySection }
        { iconSection }
      </Row>
    )
  } else {
    content = (
      <Row className='home-row'>
        { iconSection }
        { bodySection }
      </Row>
    )
  }

  return (
    <Row className='home-row'>
      <Col sm={ {span: span, offset: offset} }>
        <Card border='light' className={ classes } { ...others }>
          <Card.Body>
            <Container fluid>
              { content }
            </Container>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

RowCard.defaultProps = {
  offset: 0,
  span: 12,
  right: false,
}

export default RowCard
