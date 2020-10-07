import React from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import { useAlert } from 'react-alert'
import { useMutation } from '../../../../helpers/GraphQL'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import AssetForm from './AssetForm'
import MaintenanceEvents from './maintenance_events/MaintenanceEvents'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import UpcomingMaintenance from './upcoming_maintenance/UpcomingMaintenance'

const getQuery = loader('./get.gql')

const updateMutation = loader('./update.gql')

const Edit = () => {
  const { id } = useParams()
  const { data, loading } = useQuery(getQuery, { variables: { id } })

  const alert = useAlert()

  const [sendUpdate] = useMutation(updateMutation, alert)

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title={data.asset.barcode} />
      <AssetForm asset={data.asset} mutation={sendUpdate} />
      <Row>
        <Col sm={12}><UpcomingMaintenance id={id} /></Col>
        <Col sm={12}><MaintenanceEvents id={id} /></Col>
      </Row>
    </Container>
  )
}

export default Edit
