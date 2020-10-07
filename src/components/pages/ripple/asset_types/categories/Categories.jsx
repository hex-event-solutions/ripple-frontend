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

const Categories = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: category, reset: resetCategory, bind: bindCategory } = useInput('')

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)

  const handleCreate = () => {
    if (!category) {
      alert.show('Please select a category to add', { type: 'error' })
      return
    }
    sendCreate({ variables: { input: {
      assetTypeId : id,
      categoryId : category,
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved category', { type: 'success'})
        resetCategory()
        refetch()
      }
    })
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted category', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Categories</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Form.Control as='select' {...bindCategory}>
                <option hidden disabled value=''></option>
                { data.availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.fullname}</option>
                ))}
              </Form.Control>
            </td>
            <td className='text-right'><RippleButton variant='success' onClick={handleCreate} /></td>
          </tr>
          { data.assetType.assetTypeCategories.map((category) => (
            <tr key={category.id}>
              <td>{ category.category.fullname }</td>
              <td className='text-right'><RippleButton variant='danger' onClick={() => handleDelete(category.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default Categories
