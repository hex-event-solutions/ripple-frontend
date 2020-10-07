import React from 'react'
import { Helmet } from 'react-helmet-async'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import GenerateDocument from './generate_document/GenerateDocument'
import Button from 'react-bootstrap/Button'

const Heading = (props) => {
  const { title, children, width, subject, subjectId } = props

  return (
    <Row>
      <Helmet>
        <title>{ title } - Ripple</title>
      </Helmet>
      <Col sm={12} lg={width} className='pb-3'>
        <div className='border-bottom border-primary'>
          <h1 className='text-primary text-capitalize'><b>{ title }</b></h1>
        </div>
      </Col>
      <Col sm={12} lg={12 - width} className='text-right'>
        <div className='d-inline-block'>
          { children }
        </div>
        <div className='d-inline-block'>
          { (subject && subjectId) ? <GenerateDocument className='pl-3' subject={subject} subjectId={subjectId} /> : '' }
        </div>
      </Col>
    </Row>
  )
}

export default Heading

Heading.defaultProps = {
  width: 8
}
