import React from 'react'
import { loader } from 'graphql.macro'

import Container from 'react-bootstrap/Container'
import Heading from '../../../elements/Heading'
import { useMutation } from '../../../../helpers/GraphQL'
import AssetTypeForm from './AssetTypeForm'

const createMutation = loader('./create.gql')

const Create = () => {

  const [sendCreate] = useMutation(createMutation, alert)

  return (
    <Container fluid>
      <Heading title='Create an Asset Type' />
      <AssetTypeForm mutation={sendCreate} />
    </Container>
  )
}

export default Create
