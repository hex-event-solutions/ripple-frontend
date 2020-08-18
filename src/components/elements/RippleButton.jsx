import React from 'react'

import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const RippleButton = (props) => {
  const { variant, icon, children, ...others } = props

  const icons = {
    'success': 'check',
    'danger': 'trash'
  }

  return (
    <Button variant={variant} {...others}>
      { children || <FontAwesomeIcon icon={icon || icons[variant]} /> }
    </Button>
  )
}

export default RippleButton
