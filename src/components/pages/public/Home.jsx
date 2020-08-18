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
              <h1 className='display-1'>Ripple</h1>
              <hr />
              <h4>The automated solution to event management</h4>
            </Col>
            <Col sm={6}>
              <Image className='border border-white' src='screenshot.png' fluid />
            </Col>
          </Row>
        </Container>
      </Jumbotron>
      <Wave classes='home-header-wave' />
      <Container fluid className='pt-5'>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <h1 className='display-3'>What is Ripple?</h1>
          </Col>
        </Row>
        <Features />
        <Row className='home-row'><Col sm={ { offset: 4, span: 4 } }><hr/></Col></Row>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <h1 className='display-4'>How do I get started?</h1>
          </Col>
        </Row>
        <Row className='home-row'>
          <Col sm={{span: 10, offset: 1}}>
            <h1>We're currently running an open beta, completely free of charge</h1>
            <br />
            <h1>If you'd like to get involved and try out the platform, please contact <a href='mailto:ripple@hexes.co.uk'>ripple@hexes.co.uk</a> to get started</h1>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default Home
