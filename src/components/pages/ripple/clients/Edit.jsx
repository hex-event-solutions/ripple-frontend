import React from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import { useAlert } from 'react-alert'
import { useMutation } from '../../../../helpers/GraphQL'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import ClientForm from './ClientForm'

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
      <Heading title={`Edit ${data.client.organisationName}`} />
      <ClientForm client={data.client} mutation={sendUpdate} />
    </Container>
  )
}

export default Edit
