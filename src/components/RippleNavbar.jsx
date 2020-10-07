import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import NavbarUser from './NavbarUser'
import { AppContext } from '../state/AppContext'

const RippleNavbar = () => {

  const { getSetting } = useContext(AppContext)

  const langClient = getSetting('Language - Client')
  const langEvent = getSetting('Language - Event')
  const langAsset = getSetting('Language - Asset')

  return (
    <Navbar className='home-header' variant='dark' sticky='top' expand='xl' collapseOnSelect >
      <Navbar.Brand as={Link} to='/'>Ripple</Navbar.Brand>
      <Navbar.Toggle aria-controls="header-nav" />
      <Navbar.Collapse id="header-nav">
        <Nav>
          <Nav.Link eventKey={1} as={Link} to="/ripple">Dashboard</Nav.Link>
          <NavDropdown className='text-capitalize' title={langClient.plural}>
            <NavDropdown.Item eventKey={2} as={Link} to={`/ripple/clients`}>{langClient.plural}</NavDropdown.Item>
            <NavDropdown.Item eventKey={3} as={Link} to={`/ripple/client/new`}>New {langClient.value}</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown className='text-capitalize' title={langEvent.plural}>
            <NavDropdown.Item eventKey={4} as={Link} to={`/ripple/events/calendar`}>Calendar</NavDropdown.Item>
            <NavDropdown.Item eventKey={5} as={Link} to={`/ripple/events/new`}>New {langEvent.value}</NavDropdown.Item>
            <NavDropdown.Item eventKey={6} as={Link} to={`/ripple/events`}>All {langEvent.plural}</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown className='text-capitalize' title="Equipment">
            <NavDropdown.Item eventKey={7} as={Link} to={`/ripple/asset-types`}>{langAsset.value} Types</NavDropdown.Item>
            <NavDropdown.Item eventKey={8} as={Link} to={`/ripple/assets`}>{langAsset.plural}</NavDropdown.Item>
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
