import React from 'react'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

const ButtonToggle = (props) => {
  const { value, callback } = props

  return (
    <ButtonGroup>
      <Button onClick={() => callback(true)} variant={ value ? 'success' : 'secondary' }>Yes</Button>
      <Button onClick={() => callback(false)} variant={ value ? 'secondary' : 'success' }>No</Button>
    </ButtonGroup>
  )
}

export default ButtonToggle
