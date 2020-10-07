import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import { useAlert } from 'react-alert'
import { useMutation } from '../../../../helpers/GraphQL'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import EventForm from './EventForm'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import BlurImage from '../../../elements/BlurImage'
import RippleButton from '../../../elements/RippleButton'
import Form from 'react-bootstrap/Form'
import { useInput } from '../../../../hooks/InputHook'
import { formatCurrency } from '../../../../helpers/Currency'
import ComboBox from '../../../elements/ComboBox'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'

const getQuery = loader('./get.gql')
const getRowItemPrices = loader('./getRowItemPrices.gql')
const updateMutation = loader('./update.gql')
const createEventItemMutation = loader('./createEventItem.gql')
const deleteEventItemMutation = loader('./deleteEventItem.gql')

const Edit = () => {
  const { id } = useParams()
  const { data, loading, refetch } = useQuery(getQuery, { variables: { id } })

  const { value: assetType, reset: resetAssetType, bind: bindAssetType } = useInput('')
  const { value: assetTypeQuantity, reset: resetAssetTypeQuantity, bind: bindAssetTypeQuantity } = useInput('1')
  const { value: assetTypeDiscount, reset: resetAssetTypeDiscount, bind: bindAssetTypeDiscount } = useInput('0')

  const { value: rowItem, reset: resetRowItem, bind: bindRowItem } = useInput('')
  const { value: rowItemPrice, reset: resetRowItemPrice, bind:  bindRowItemPrice } = useInput('')
  const { value: rowItemQuantity, reset: resetRowItemQuantity, bind: bindRowItemQuantity } = useInput('1')
  const { value: rowItemDiscount, reset: resetRowItemDiscount, bind: bindRowItemDiscount } = useInput('0')

  const { data: dataRowItemPrices, refetch: refetchRowItemPrices } = useQuery(getRowItemPrices, { variables: { description: rowItem } })

  const [rowItemPrices, setRowItemPrices] = useState([])

  const alert = useAlert()

  const [sendUpdate] = useMutation(updateMutation, alert)
  const [sendCreateEventItem] = useMutation(createEventItemMutation, alert)
  const [sendDeleteEventItem] = useMutation(deleteEventItemMutation, alert)

  useEffect(() => {
    if (rowItem) {
      refetchRowItemPrices()
    }
  }, [rowItem])

  useEffect(() => {
    if (dataRowItemPrices) {
      setRowItemPrices(dataRowItemPrices.rowItemPrices)
    }
  }, [dataRowItemPrices])

  const handleAssetType = () => {
    if (!assetType) {
      alert.show('Please select an asset type to add', { type: 'error' })
      return
    }
    if (!assetTypeQuantity) {
      alert.show('Please set a quantity to add', { type: 'error' })
      return
    }
    if (!assetTypeDiscount) {
      alert.show('Please set a discount to apply', { type: 'error' })
      return
    }
    const params = {
      assetTypeId : assetType,
      eventId : id,
      quantity : parseInt(assetTypeQuantity),
      discount : parseInt(assetTypeDiscount)
    }
    sendCreateEventItem({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Successfully saved event item', { type: 'success'})
        resetAssetType()
        resetAssetTypeQuantity()
        resetAssetTypeDiscount()
        refetch()
      }
    })
  }

  const handleRowItem = () => {
    if (!rowItem) {
      alert.show('Please select or set an item to add', { type: 'error' })
      return
    }
    if (!rowItemPrice) {
      alert.show('Please set a price for the item', { type: 'error' })
      return
    }
    if (!rowItemQuantity) {
      alert.show('Please set a quantity to add', { type: 'error' })
      return
    }
    if (!rowItemDiscount) {
      alert.show('Please set a discount to apply', { type: 'error' })
      return
    }
    const params = {
      rowItem,
      rowItemPrice : parseFloat(rowItemPrice),
      eventId : id,
      quantity : parseInt(rowItemQuantity),
      discount : parseInt(rowItemDiscount)
    }
    sendCreateEventItem({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Successfully saved event item', { type: 'success'})
        resetRowItem()
        resetRowItemPrice()
        resetRowItemQuantity()
        resetRowItemDiscount()
        refetch()
      }
    })
  }

  const handleDeleteEventItem = (id) => {
    sendDeleteEventItem({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted event item', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title={data.event.description} subject='Event' subjectId={id}>
        <Button as={Link} to='/ripple/events/calendar'>Calendar</Button>
      </Heading>
      <EventForm mutation={sendUpdate} event={data.event} refetch={refetch} />
      <Row>
        <Col sm={12}>
          <p>Event value: <b>{ formatCurrency(data.event.totalValue) }</b></p>
        </Col>
        <Col sm={12} xl={6}>
          <h2>Asset types</h2>
          <Table responsive>
            <thead>
              <tr>
                <th width='12%'>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <Form.Control as='select' {...bindAssetType} >
                    <option hidden disabled value=''></option>
                    { data.assetTypes.map((assetType) => (
                      <option key={assetType.id} value={assetType.id}>{ assetType.name }</option>
                    ))}
                  </Form.Control>
                </td>
                <td><Form.Control type='number' {...bindAssetTypeQuantity} /></td>
                <td>
                  <InputGroup>
                    <Form.Control type='number' {...bindAssetTypeDiscount}/>
                    <InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleAssetType} /></td>
              </tr>
              { data.event.eventItems.map((eventItem) => {
                if (eventItem.item.__typename != 'AssetType') return ''
                return (
                  <tr key={ eventItem.id }>
                    <td width='12%'>{ eventItem.item.primaryImage ? <BlurImage image={eventItem.item.primaryImage} /> : '' }</td>
                    <td>{ eventItem.item.name }</td>
                    <td>{ eventItem.quantity }</td>
                    <td>{ eventItem.discount }</td>
                    <td className='text-right'><RippleButton variant='danger' onClick={() => handleDeleteEventItem(eventItem.id)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
        <Col sm={12} xl={6}>
          <h2>Additional Items</h2>
          <Table responsive>
            <thead>
              <tr>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ComboBox list='rowItems' {...bindRowItem}>
                    { data.rowItemDescriptions.map((description) => (
                      <option key={description} value={description}>{ description }</option>
                    ))}
                  </ComboBox>
                </td>
                <td>
                  <InputGroup>
                    <InputGroup.Prepend><InputGroup.Text>£</InputGroup.Text></InputGroup.Prepend>
                    <ComboBox list='rowItemPrices' {...bindRowItemPrice}>
                      { rowItemPrices.map((price) => (
                        <option key={price} value={price}>{ price }</option>
                      ))}
                    </ComboBox>
                  </InputGroup>

                </td>
                <td><Form.Control type='number' {...bindRowItemQuantity} /></td>
                <td>
                  <InputGroup>
                    <Form.Control type='number' {...bindRowItemDiscount}/>
                    <InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleRowItem} /></td>
              </tr>
              { data.event.eventItems.map((eventItem) => {
                if (eventItem.item.__typename != 'RowItem') return ''
                return (
                  <tr key={ eventItem.id }>
                    <td>{ eventItem.item.description }</td>
                    <td>{ formatCurrency(eventItem.item.price) }</td>
                    <td>{ eventItem.quantity }</td>
                    <td>{ eventItem.discount }</td>
                    <td className='text-right'><RippleButton variant='danger' onClick={() => handleDeleteEventItem(eventItem.id)} /></td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

export default Edit
