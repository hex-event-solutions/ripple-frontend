import React from 'react'
import { loader } from 'graphql.macro'

import { useAlert } from 'react-alert'
import Container from 'react-bootstrap/Container'
import Heading from '../../../elements/Heading'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import RippleSpinner from '../../../elements/RippleSpinner'
import Button from 'react-bootstrap/Button'
import TableButton from '../../../elements/TableButton'
import { useQuery } from '@apollo/react-hooks'
import { Link } from 'react-router-dom'

const readQuery = loader('./read.gql')

const Index = () => {
  const { loading, data } = useQuery(readQuery)

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title='Events'>
        <Button variant='primary' as={Link} to='/ripple/events/new'>New</Button>
      </Heading>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Description</th>
                <th>Location</th>
                <th>Out</th>
                <th>Start</th>
                <th>End</th>
                <th>Return</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.events.map((event) => {
                  return (
                  <tr key={event.id}>
                    <td>{ event.client.organisationName }</td>
                    <td>{ event.description }</td>
                    <td>{ event.location }</td>
                    <td>{ event.dateOut }</td>
                    <td>{ event.dateStart }</td>
                    <td>{ event.dateEnd }</td>
                    <td>{ event.dateReturn }</td>
                    <td className='text-right'>
                      <TableButton route='event' subject='Event' id={event.id} />
                    </td>
                  </tr>
                )})
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default Index
