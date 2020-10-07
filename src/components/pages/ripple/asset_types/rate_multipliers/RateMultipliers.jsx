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

const RateMultipliers = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: multiplierType, reset: resetMultiplierType, bind: bindMultiplierType } = useInput('')

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)

  const handleCreate = () => {
    if (!multiplierType) {
      alert.show('Please select a rate multiplier to add', { type: 'error' })
      return
    }
    sendCreate({ variables: { input: {
      assetTypeId : id,
      multiplierTypeId : multiplierType,
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved rate multiplier', { type: 'success'})
        resetMultiplierType()
        refetch()
      }
    })
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted rate multiplier', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Rate multipliers</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Hire duration</th>
            <th>Charge duration</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              <Form.Control as='select' {...bindMultiplierType}>
                <option hidden disabled value=''></option>
                { data.availableMultiplierTypes.map((multiplierType) => (
                  <option key={multiplierType.id} value={multiplierType.id}>{multiplierType.name} - { multiplierType.summary }</option>
                ))}
              </Form.Control>
            </td>
            <td className='text-right'><RippleButton variant='success' onClick={handleCreate} /></td>
          </tr>
          { data.assetType.assetTypeMultiplierTypes.map((multiplierType) => (
            <tr key={multiplierType.id}>
              <td>{ multiplierType.multiplierType.name }</td>
              <td>{ multiplierType.multiplierType.operandQuantity } { multiplierType.multiplierType.operandType }</td>
              <td>{ multiplierType.multiplierType.multiplier } { multiplierType.multiplierType.multiplierType }</td>
              <td className='text-right'><RippleButton variant='danger' onClick={() => handleDelete(multiplierType.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default RateMultipliers
