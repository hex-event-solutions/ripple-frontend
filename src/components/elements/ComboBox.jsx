import React, { Fragment } from 'react'

import Form from 'react-bootstrap/Form'

const ComboBox = (props) => {
  const { children, list, ...others } = props

  return (
    <Fragment>
      <Form.Control list={list} {...others} />
      <datalist id={list}>
        { children }
      </datalist>
    </Fragment>
  )
}

export default ComboBox
