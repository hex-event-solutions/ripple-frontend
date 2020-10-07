import React, {Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import RippleButton from '../../../../elements/RippleButton'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../../elements/RippleSpinner'
import { useQuery } from '@apollo/react-hooks'
import CardBlock from '../../../../elements/CardBlock'

const getQuery = loader('./get.gql')

const MaintenanceEvents = (props) => {

  const { id } = props

  const { loading, error, data } = useQuery(getQuery, { variables: { id } })

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Maintenance History</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Outcome</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          { data.asset.maintenanceEvents.map((maintenanceEvent) => (
            <tr key={maintenanceEvent.id}>
              <td>{ (new Date(maintenanceEvent.updatedAt)).toLocaleString('en-GB') }</td>
              <td>{ maintenanceEvent.maintenanceSchedule.maintenanceType.name }</td>
              <td>{ maintenanceEvent.maintenanceResolution.name }</td>
              <td>{ maintenanceEvent.details }</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default MaintenanceEvents
