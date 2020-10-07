import React from 'react'
import { Link } from 'react-router-dom'
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

const readQuery = loader('./read.gql')

const Index = () => {
  const { loading, error, data } = useQuery(readQuery)

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title='Asset Cases' />
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                <th>Barcode</th>
                <th>Assets count</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.assetCases.map((assetCase) => {
                  return (
                  <tr key={assetCase.id}>
                    <td>{ assetCase.barcode }</td>
                    <td>{ assetCase.assets.length }</td>
                    <td className='text-right'>
                      <ButtonGroup>
                        <Button as={Link} to={`/ripple/case/${assetCase.id}`} variant='secondary'>Edit</Button>
                        <GenerateDocument as={ButtonGroup} subject='AssetCase' subjectId={assetCase.id} />
                      </ButtonGroup>
                    </td>
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

export default Index
