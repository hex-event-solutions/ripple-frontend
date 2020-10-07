import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import BlurImage from '../../../elements/BlurImage'
import TableButton from '../../../elements/TableButton'
import { AppContext } from '../../../../state/AppContext'

const readQuery = loader('./read.gql')

const Index = () => {
  const { loading, error, data } = useQuery(readQuery)

  const { getSetting } = useContext(AppContext)

  const langAsset = getSetting('Language - Asset')

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading className='text-capitalize' title={langAsset.plural}>
        <Button variant='primary' as={Link} to='/ripple/assets/new'>New</Button>
      </Heading>
      <Row>
        <Col>
          <Table responsive>
            <thead>
              <tr>
                <th width="12%">Image</th>
                <th>Name</th>
                <th>Barcode</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.assets.map((asset) => {
                  return (
                  <tr>
                    <td>{ asset.assetType.primaryImage ? <BlurImage image={asset.assetType.primaryImage} /> : '' }</td>
                    <td>{ asset.assetType.name }</td>
                    <td>{ asset.barcode }</td>
                    <td className='text-right'>
                      <TableButton route='asset' subject='Asset' id={asset.id} />
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
