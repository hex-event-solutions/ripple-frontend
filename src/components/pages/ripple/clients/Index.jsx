import React from 'react'
import { Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import TableButton from '../../../elements/TableButton'

const readQuery = loader('./read.gql')

const Index = () => {
  const { loading, error, data } = useQuery(readQuery)

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title='Clients'>
        <Button variant='primary' as={Link} to='/ripple/clients/new'>New</Button>
      </Heading>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Organisation Name</th>
                <th>Address</th>
                <th>Type</th>
                <th>Discount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.clients.map((client) => {
                  return (
                  <tr>
                    <td>{ client.organisationName }</td>
                    <td style={{whiteSpace: 'pre-wrap'}}>{ client.address }</td>
                    <td>{ client.clientType.name }</td>
                    <td>{ client.discount }</td>
                    <td className='text-right'>
                      <TableButton route='client' subject='Client' id={client.id} />
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
