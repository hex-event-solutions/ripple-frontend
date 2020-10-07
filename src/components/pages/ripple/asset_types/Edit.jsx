import React from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import { useAlert } from 'react-alert'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Heading from '../../../elements/Heading'
import RippleSpinner from '../../../elements/RippleSpinner'
import { useMutation } from '../../../../helpers/GraphQL'
import AssetTypeForm from './AssetTypeForm'
import Specifications from './specifications/Specifications'
import RateMultipliers from './rate_multipliers/RateMultipliers'
import Accessories from './accessories/Accessories'
import Categories from './categories/Categories'
import Documents from './documents/Documents'
import Images from './images/Images'
import MaintenanceSchedules from './maintenance_schedules/MaintenanceSchedules'

const getQuery = loader('./get.gql')
const updateMutation = loader('./update.gql')

const Edit = () => {
  const { id } = useParams()
  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const alert = useAlert()

  const [sendUpdate] = useMutation(updateMutation, alert)

  if (loading ) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  console.log(data.assetType)

  return (
    <Container fluid>
      <Heading title={ data.assetType.name } subject='AssetType' subjectId={id} />
      <Row>
        <Col sm={12} xl={8}><AssetTypeForm assetType={data.assetType} mutation={sendUpdate} refetch={refetch} /></Col>
        <Col sm={12} xl={4}><Images id={id} /></Col>
      </Row>
      <Row>
        <Col className='pr-xl-5' sm={12} xl={6}><Specifications id={id} /></Col>
        <Col className='pl-xl-5' sm={12} xl={6}><Accessories id={id} /></Col>
        <Col className='pr-xl-5' sm={12} xl={6}><Categories id={id} /></Col>
        <Col className='pl-xl-5' sm={12} xl={6}><RateMultipliers id={id} /></Col>
      </Row>
      <Row><Col><Documents id={id}/></Col></Row>
      <Row><Col><MaintenanceSchedules id={id}/></Col></Row>
    </Container>
  )
}

export default Edit
