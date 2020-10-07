import React, { useContext } from 'react'
import { loader } from 'graphql.macro'

import { useAlert } from 'react-alert'
import Container from 'react-bootstrap/Container'
import { useMutation } from '../../../../helpers/GraphQL'
import Heading from '../../../elements/Heading'
import AssetForm from './AssetForm'
import { AppContext } from '../../../../state/AppContext'

const createMutation = loader('./create.gql')

const Create = () => {
  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)

  const { getSetting } = useContext(AppContext)

  const langAsset = getSetting('Language - Asset')

  return (
    <Container fluid>
      <Heading title={`Create a ${langAsset.value}`} />
      <AssetForm mutation={sendCreate} />
    </Container>
  )
}

export default Create
