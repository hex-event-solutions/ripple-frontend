import React from 'react'
import { loader } from 'graphql.macro'

import { useAlert } from 'react-alert'
import Container from 'react-bootstrap/Container'
import { useMutation } from '../../../../helpers/GraphQL'
import Heading from '../../../elements/Heading'
import EventForm from './EventForm'

const createMutation = loader('./create.gql')

const Create = () => {
  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)

  return (
    <Container fluid>
      <Heading title='Create a new event' />
      <EventForm mutation={sendCreate} />
    </Container>
  )
}

export default Create
