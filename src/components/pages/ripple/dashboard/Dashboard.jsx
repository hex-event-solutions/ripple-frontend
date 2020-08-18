import React from 'react'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Heading from '../../../elements/Heading'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RippleSpinner from '../../../elements/RippleSpinner'
import { Link } from 'react-router-dom'

const readQuery = loader('./read.gql')

const Dashboard = () => {
  const { data, loading } = useQuery(readQuery)

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title='Dashboard' />
      <Row>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='primary' text='white' className='text-center' as={Link} to='/ripple/events/calendar'>
            <Card.Body>
              <Card.Title><h1>{ data.upcomingEvents }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Upcoming events</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='info' text='white' className='text-center' as={Link} to='/ripple/events/calendar'>
            <Card.Body>
              <Card.Title><h1>{ data.eventsToday }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Events today</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='warning' text='white' className='text-center'>
            <Card.Body>
              <Card.Title><h1>{ data.unpaidInvoices }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Unpaid invoices</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='danger' text='white' className='text-center'>
          <Card.Body>
              <Card.Title><h1>{ data.overdueInvoices }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Overdue invoices</h3></Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='primary' text='white' className='text-center'>
            <Card.Body>
              <Card.Title><h1>{ data.upcomingReturns }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Upcoming returns</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='info' text='white' className='text-center'>
            <Card.Body>
              <Card.Title><h1>{ data.returnsToday }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Returns today</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='danger' text='white' className='text-center'>
          <Card.Body>
              <Card.Title><h1>{ data.overdueReturns }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Overdue returns</h3></Card.Footer>
          </Card>
        </Col>
        <Col sm={12} md={6} xl={3} className='p-3'>
          <Card bg='success' text='white' className='text-center'>
            <Card.Body>
              <Card.Title><h1>{ data.equipmentShortages }</h1></Card.Title>
            </Card.Body>
            <Card.Footer><h3>Equipment shortages</h3></Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
