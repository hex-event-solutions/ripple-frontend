import React from 'react'

import './Home.scss'

import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'

import Wave from '../../Wave'
import Features from '../../elements/Features'

const Home = () => {
  return (
    <div>
      <Jumbotron fluid className='mb-0 home-header'>
        <Container fluid>
          <Row className='home-row'>
            <Col sm={{span: 4, offset: 1}} className='my-auto text-center text-light'>
              <p className='h1 display-1'>Ripple</p>
              <hr />
              <p className='h4'>The automated solution to event management</p>
            </Col>
            <Col sm={6}>
              <Image className='border border-white' src='screenshot.png' alt="Screenshot of Ripple's dashboard" fluid />
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Wave classes='home-header-wave' />
      <Container fluid className='pt-5'>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <p className='h1 display-3'>What is Ripple?</p>
          </Col>
        </Row>
        <Features />
        <Row className='home-row'><Col sm={ { offset: 4, span: 4 } }><hr/></Col></Row>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <p className='h1 display-4'>How do I get started?</p>
          </Col>
        </Row>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <p className='h2'>We're currently running an open beta, completely free of charge</p>
            <br />
            <p className='h2'>If you'd like to get involved and try out the platform, please contact <a href='mailto:ripple@hexes.co.uk'>ripple@hexes.co.uk</a> to get started</p>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default Home
