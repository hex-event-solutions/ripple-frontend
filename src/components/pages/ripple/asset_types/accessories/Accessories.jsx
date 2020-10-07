import React, { useState, useEffect, Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import ComboBox from '../../../../elements/ComboBox'
import RippleButton from '../../../../elements/RippleButton'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../../elements/RippleSpinner'
import { useAlert } from 'react-alert'
import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '../../../../../helpers/GraphQL'
import { useInput } from '../../../../../hooks/InputHook'
import CardBlock from '../../../../elements/CardBlock'
import Form from 'react-bootstrap/Form'

const getQuery = loader('./get.gql')
const createMutation = loader('./create.gql')
const deleteMutation = loader('./delete.gql')

const Accessories = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: accessory, reset: resetAccessory, bind: bindAccessory } = useInput('')
  const {value: accessoryQuantity, reset: resetAccessoryQuantity, bind: bindAccessoryQuantity } = useInput('')

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)

  const handleCreate = () => {
    if (!accessory) {
      alert.show('Please select an accessory to add', { type: 'error' })
      return
    }
    if (!accessoryQuantity) {
      alert.show('Please set a quantity of this accessory to add', { type: 'error' })
      return
    }
    sendCreate({ variables: { input: {
      assetTypeId : id,
      accessoryId : accessory,
      quantity : parseInt(accessoryQuantity)
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved accessory', { type: 'success'})
        resetAccessory()
        resetAccessoryQuantity()
        refetch()
      }
    })
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted accessory', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Accessories</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Asset type</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Form.Control as='select' {...bindAccessory}>
                <option hidden disabled value=''></option>
                { data.availableAccessories.map((assetType) => (
                  <option key={assetType.id} value={assetType.id}>{assetType.name}</option>
                ))}
              </Form.Control>
            </td>
            <td>
              <Form.Control type='number' {...bindAccessoryQuantity} />
            </td>
            <td className='text-right'><RippleButton variant='success' onClick={handleCreate} /></td>
          </tr>
          { data.assetType.accessories.map((accessory) => (
            <tr key={accessory.id}>
              <td>{ accessory.accessory.name }</td>
              <td>{ accessory.quantity }</td>
              <td className='text-right'><RippleButton variant='danger' onClick={() => handleDelete(accessory.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default Accessories
