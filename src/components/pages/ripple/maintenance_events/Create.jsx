import React from 'react'
import Heading from '../../../elements/Heading'
import Container from 'react-bootstrap/Container'
import { useParams } from 'react-router-dom'
import MaintenanceEventForm from './MaintenanceEventForm'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import RippleSpinner from '../../../elements/RippleSpinner'

const getAssociationsQuery = loader('./getAssociations.gql')

const Create = () => {

  const { assetId, scheduleId } = useParams()

  const { data, loading } = useQuery(getAssociationsQuery, { variables: { assetId, scheduleId }})

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title={`${data.maintenanceSchedule.maintenanceType.name} - for ${data.asset.assetType.name} (${data.asset.barcode})`} />
      <MaintenanceEventForm assetId={assetId} scheduleId={scheduleId} tasks={data.maintenanceSchedule.maintenanceType.tasks} />
    </Container>
  )
}

export default Create
