import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavbarUser from './NavbarUser'

const RippleNavbar = () => {
  return (
    <Navbar className='home-header' variant='dark' sticky='top' expand='xl'>
      <Navbar.Brand as={Link} to='/'>Ripple</Navbar.Brand>
      <Navbar.Toggle aria-controls="header-nav" />
      <Navbar.Collapse id="header-nav">
        <Nav>
          <Nav.Link as={Link} to="/features">Features</Nav.Link>
          <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
          <NavDropdown text='white' title="Contact Us">
            <NavDropdown.Item as={Link} to="/contact-us">Contact Us</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/faqs">FAQs</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/support">Support</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav className='ml-auto'>
          <NavbarUser />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default RippleNavbar
