import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import GenerateDocument from '../../../elements/generate_document/GenerateDocument'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import BlurImage from '../../../elements/BlurImage'

const getQuery = loader('./get.gql')

const Show = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(getQuery, { variables: { id } })

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title={`Case ${data.assetCase.barcode}`} />
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                <th width="12%">Image</th>
                <th>Barcode</th>
              </tr>
            </thead>
            <tbody>
              {
                data.assetCase.assets.map((asset) => {
                  return (
                  <tr key={asset.id}>
                    <td>{ asset.assetType.primaryImage ? <BlurImage image={asset.assetType.primaryImage} /> : '' }</td>
                    <td>{ asset.barcode }</td>
                  </tr>
                )})
              }
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default Show
