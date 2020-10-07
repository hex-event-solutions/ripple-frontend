import React, {Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../../elements/RippleSpinner'
import { useQuery } from '@apollo/react-hooks'
import CardBlock from '../../../../elements/CardBlock'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const getQuery = loader('./get.gql')

const UpcomingMaintenance = (props) => {

  const { id } = props

  const { loading, error, data } = useQuery(getQuery, { variables: { id } })

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Upcoming maintenance</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date due</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { data.asset.nextMaintenanceDue.map((maintenanceEvent) => (
            <tr key={maintenanceEvent.id}>
              <td>{ maintenanceEvent.maintenanceSchedule.maintenanceType.name }</td>
              <td>{ (new Date(maintenanceEvent.due)).toLocaleString('en-GB') }</td>
              <td className='text-right'>
                <Button variant='success' as={Link} to={`/ripple/asset/${id}/maintenance/new/${maintenanceEvent.maintenanceSchedule.id}`}>
                  Start
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default UpcomingMaintenance
