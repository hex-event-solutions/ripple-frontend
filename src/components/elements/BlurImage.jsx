import React, { useState, useEffect } from 'react'

import BootstrapImage from 'react-bootstrap/Image'

const BlurImage = (props) => {
  const { image, className, ...others } = props

  const { small : smallImage, large : largeImage } = image

  const [imageSrc, setImageSrc] = useState(smallImage)
  const [loading, setLoading] = useState(true)

  const classes = `img-fluid ${className ? className : ''}`

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      setImageSrc(largeImage)
      setLoading(false)
    }
    image.src = largeImage
  })

  const styles = {
    transition: '0.2s filter linear',
    filter: `${loading ? 'blur(5px)' : ''}`
  }

  return (
    <span>
      <BootstrapImage {...others} src={imageSrc} style={styles} className={classes} />
    </span>
  )
}

export default BlurImage
