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

const getQuery = loader('./get.gql')
const readValuesQuery = loader('./readValues.gql')
const createMutation = loader('./create.gql')
const deleteMutation = loader('./delete.gql')

const Specifications = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: specification, reset: resetSpecification, bind: bindSpecification } = useInput('')
  const {value: specificationValue, reset: resetSpecificationValue, bind: bindSpecificationValue } = useInput('')

  const { data: dataValues, refetch: refetchSpecificationValues } = useQuery(readValuesQuery, { variables: { name: specification } })

  const [specificationValues, setSpecificationValues] = useState([])

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)

  useEffect(() => {
    if (specification) {
      refetchSpecificationValues()
    }
  }, [specification])

  useEffect(() => {
    if (dataValues) {
      setSpecificationValues(dataValues.specificationValues)
    }
  }, [dataValues])

  const handleCreate = () => {
    if (!specification) {
      alert.show('Please select a specification to add', { type: 'error' })
      return
    }
    if (!specificationValue) {
      alert.show('Please set a value for this specification', { type: 'error' })
      return
    }
    sendCreate({ variables: { input: {
      assetTypeId: id,
      name : specification,
      value : specificationValue
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved specification', { type: 'success'})
        resetSpecification()
        resetSpecificationValue()
        refetch()
      }
    })
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted specification', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Specifications</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Property</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ComboBox list='specifications' {...bindSpecification}>
                { data.availableSpecifications.map((specification) => (
                  <option key={specification.name}>{specification.name}</option>
                ))}
              </ComboBox>
            </td>
            <td>
              <ComboBox list='specificationValues' {...bindSpecificationValue}>
                { specificationValues.map((specification) => (
                  <option key={specification}>{specification}</option>
                ))}
              </ComboBox>
            </td>
            <td className='text-right'><RippleButton variant='success' onClick={handleCreate} /></td>
          </tr>
          { data.assetType.assetTypeSpecifications.map((specification) => (
            <tr>
              <td>{ specification.specification.name }</td>
              <td>{ specification.value }</td>
              <td className='text-right'><RippleButton variant='danger' onClick={() => handleDelete(specification.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default Specifications
