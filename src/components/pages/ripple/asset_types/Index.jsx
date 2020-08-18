import React from 'react'
import { Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

import { formatCurrency } from '../../../../helpers/Currency'
import Heading from '../../../elements/Heading'
import RippleSpinner from '../../../elements/RippleSpinner'
import BlurImage from '../../../elements/BlurImage'
import TableButton from '../../../elements/TableButton'

const readQuery = loader('./read.gql')

const Index = () => {
  const { loading, error, data } = useQuery(readQuery)

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title='Asset types'>
        <Button variant='primary' as={Link} to='/ripple/asset-types/new'>New</Button>
      </Heading>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th width="12%">Image</th>
                <th>Name</th>
                <th className='d-none d-lg-table-cell'>Categories</th>
                <th>Cost</th>
                <th>Rate</th>
                <th className='d-none d-lg-table-cell'>Multipliers</th>
                <th className='d-none d-md-table-cell'>Weight</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                data.assetTypes.map((assetType) => {
                  return (
                  <tr key={assetType.id}>
                    <td>{ assetType.primaryImage ? <BlurImage image={assetType.primaryImage} /> : '' }</td>
                    <td>{ assetType.name }</td>
                    <td className='d-none d-lg-table-cell'>
                      { assetType.assetTypeCategories.map((category) => (
                        <span key={ category.category.fullname }>{ category.category.fullname }<br /></span>
                      )) }
                    </td>
                    <td>{ formatCurrency(assetType.cost) }</td>
                    <td>{ formatCurrency(assetType.rate) }</td>
                    <td className='d-none d-lg-table-cell'>{ assetType.assetTypeMultiplierTypes.map((multiplierType) => (
                      <span key={ multiplierType.multiplierType.summary }>{ multiplierType.multiplierType.summary }<br /></span>
                    )) }</td>
                    <td className='d-none d-md-table-cell'>{ assetType.weight }kg</td>
                    <td className='text-right'>
                      <TableButton route='asset-type' subject='AssetType' id={assetType.id} breakpoint='xl' />
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
