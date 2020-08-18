import React, { useContext, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../state/AppContext'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'

const NavbarUser = () => {
  const { loginUrl, logoutUrl, loggedIn, name, accountUrl, logout } = useContext(AppContext)

  const handleLogout = () => {
    logout()
    window.location.replace(logoutUrl)
  }

  var content

  if (loggedIn) {
    content = (
      <Fragment>
        <NavDropdown title={name}>
          <NavDropdown.Item href={accountUrl}>My Account</NavDropdown.Item>
          <NavDropdown.Item eventKey={1} onClick={handleLogout}>Logout</NavDropdown.Item>
        </NavDropdown>
        <Navbar.Text className='text-muted d-none d-xl-inline-block'>|</Navbar.Text>
        <Nav.Link eventKey={2} as={Link} to='/ripple'>Go to your dashboard</Nav.Link>
      </Fragment>
    )
  } else {
    content = <Nav.Link eventKey={2} href={loginUrl}>Login</Nav.Link>
  }

  return (
    content
  )
}

export default NavbarUser
