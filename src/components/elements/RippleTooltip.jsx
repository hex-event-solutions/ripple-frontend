import React from 'react'

import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const RippleTooltip = (props) => {
  const { title, trigger, placement, children } = props

  const popover = (
    <Popover animation={false}>
      <Popover.Content>
        { children }
      </Popover.Content>
    </Popover>
  )

  return (
    <OverlayTrigger trigger={trigger} placement={placement} overlay={popover}>
      <a className='small text-nowrap' href='#'>{ title }</a>
    </OverlayTrigger>
  )
}

export default RippleTooltip

RippleTooltip.defaultProps = {
  trigger : ['hover', 'focus'],
  placement : 'bottom'
}
