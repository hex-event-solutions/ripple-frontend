import React, { useContext } from 'react'
import { loader } from 'graphql.macro'

import Container from 'react-bootstrap/Container'
import Heading from '../../../elements/Heading'
import { useMutation } from '../../../../helpers/GraphQL'
import AssetTypeForm from './AssetTypeForm'
import { AppContext } from '../../../../state/AppContext'

const createMutation = loader('./create.gql')

const Create = () => {

  const [sendCreate] = useMutation(createMutation, alert)

  const { getSetting } = useContext(AppContext)

  const langAsset = getSetting('Language - Asset')

  return (
    <Container fluid>
      <Heading title={`Create a ${langAsset.singular} Type`} />
      <AssetTypeForm mutation={sendCreate} />
    </Container>
  )
}

export default Create
