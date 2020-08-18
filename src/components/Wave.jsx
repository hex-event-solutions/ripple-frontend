import React from 'react'

const Wave = (props) => {
  const { classes } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={classes} viewBox="0 0 500 40">
      <path fillOpacity="1" d="M0,21.20 C130.07,60.69 295.43,-44.89 500.84,31.08 L500.00,0.00 L0.00,0.00 Z"></path>
    </svg>
  )
}

export default Wave
