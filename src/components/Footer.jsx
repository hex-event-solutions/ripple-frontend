import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

const Footer = () => {

  return (
    <Navbar as='footer' className='home-header mt-auto footer' variant='dark'>
      <Nav className='d-md-none flex-column'>
        <Nav.Link className='text-white' as={Link} to="/legal">Legal</Nav.Link>
        <Nav.Link className='text-white' as={Link} to="/privacy-policy">Privacy Policy</Nav.Link>
        <Nav.Link className='text-white' as={Link} to="/report-a-problem">Report a problem</Nav.Link>
        <Nav.Link className='text-white' href='https://docs.ripple.hexes.co.uk/'>Documentation and Support</Nav.Link>
      </Nav>

      <Nav className='d-none d-md-flex'>
        <Nav.Link className='text-white' as={Link} to="/legal">Legal</Nav.Link>
        <Nav.Link className='text-white' as={Link} to="/privacy-policy">Privacy Policy</Nav.Link>
        <Nav.Link className='text-white' as={Link} to="/report-a-problem">Report a problem</Nav.Link>
        <Nav.Link className='text-white' href='https://docs.ripple.hexes.co.uk/'>Documentation and Support</Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default Footer
