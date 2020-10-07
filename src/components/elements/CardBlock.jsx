import React from 'react'
import Card from 'react-bootstrap/Card'

const CardBlock = (props) => {

  const { message, variant, text, ...others } = props

  return (
    <Card bg={variant} text={text} {...others} >
      <Card.Body>
        { message }
      </Card.Body>
    </Card>
  )
}

export default CardBlock

CardBlock.defaultProps = {
  variant: 'danger',
  text: 'white'
}
