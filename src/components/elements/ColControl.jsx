import React, { Fragment } from 'react'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'

const ColControl = (props) => {
  const { label, append, prepend, children, sm, md, lg, xl, ...others } = props

  const prependText = <InputGroup.Prepend><InputGroup.Text>{ prepend }</InputGroup.Text></InputGroup.Prepend>
  const appendText = <InputGroup.Append><InputGroup.Text>{ append }</InputGroup.Text></InputGroup.Append>

  var content = <Form.Control {...others} ></Form.Control>

  if (prepend) {
    content = <Fragment>{ prependText }{ content }</Fragment>
  }
  if (append) {
    content = <Fragment>{ content }{ appendText }</Fragment>
  }
  if (prepend || append) {
    content = <InputGroup>{ content }</InputGroup>
  }

  return (
    <Form.Group as={Col} sm={sm} md={md} lg={lg} xl={xl}>
      <Form.Label as='p'>{ label }</Form.Label>
      { children || content }
    </Form.Group>
  )
}

export default ColControl
