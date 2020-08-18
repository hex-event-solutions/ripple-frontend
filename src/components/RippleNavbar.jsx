import React from 'react'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavbarUser from './NavbarUser'

const RippleNavbar = () => {
  return (
    <Navbar className='home-header' variant='dark' sticky='top' expand='xl' collapseOnSelect >
      <Navbar.Brand as={Link} to='/'>Ripple</Navbar.Brand>
      <Navbar.Toggle aria-controls="header-nav" />
      <Navbar.Collapse id="header-nav">
        <Nav>
          <Nav.Link eventKey={1} as={Link} to="/ripple">Dashboard</Nav.Link>
          <NavDropdown title="Clients">
            <NavDropdown.Item eventKey={2} as={Link} to="/ripple/clients">Clients</NavDropdown.Item>
            <NavDropdown.Item eventKey={3} as={Link} to="/ripple/clients/new">New client</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Events">
            <NavDropdown.Item eventKey={4} as={Link} to="/ripple/events/calendar">Calendar</NavDropdown.Item>
            <NavDropdown.Item eventKey={5} as={Link} to="/ripple/events/new">New event</NavDropdown.Item>
            <NavDropdown.Item eventKey={6} as={Link} to="/ripple/events">All events</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Equipment">
            <NavDropdown.Item eventKey={7} as={Link} to="/ripple/asset-types">Asset Types</NavDropdown.Item>
            <NavDropdown.Item eventKey={8} as={Link} to="/ripple/assets">Assets</NavDropdown.Item>
            <NavDropdown.Item eventKey={9} as={Link} to="/ripple/cases">Cases</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Maintenance">
            <NavDropdown.Item eventKey={10} as={Link} to="/ripple/maintenance/schedules">Schedules</NavDropdown.Item>
            <NavDropdown.Item eventKey={11} as={Link} to="/ripple/maintenance">Tasks</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item eventKey={12} as={Link} to="/ripple/maintenance/new">Fix a thing</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Website">
            <NavDropdown.Item eventKey={13} as={Link} to="#">Live site</NavDropdown.Item>
            <NavDropdown.Item eventKey={14} as={Link} to="/ripple/website/templates">Templates</NavDropdown.Item>
            <NavDropdown.Item eventKey={15} as={Link} to="/ripple/website/content">Content</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link eventKey={16} as={Link} to="/ripple/settings">Organisation Settings</Nav.Link>
        </Nav>
        <Nav className='ml-auto'>
          <NavbarUser />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default RippleNavbar
