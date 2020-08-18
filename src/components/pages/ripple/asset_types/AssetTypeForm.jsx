import React, { useState, useEffect } from 'react'

import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import ColControl from '../../../elements/ColControl'
import ButtonToggle from '../../../elements/ButtonToggle'
import RippleButton from '../../../elements/RippleButton'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import ComboBox from '../../../elements/ComboBox'
import RippleSpinner from '../../../elements/RippleSpinner'

const getManufacturersQuery = loader('./getManufacturers.gql')
const getModelsQuery = loader('./getModels.gql')

const AssetTypeForm = (props) => {

  const { assetType, mutation, refetch } = props

  const { loading, data } = useQuery(getManufacturersQuery)

  const {value: manufacturer, setValue: setManufacturer, bind: bindManufacturer } = useInput('')
  const {value: model, setValue: setModel, bind: bindModel } = useInput('')
  const {value: rate, setValue: setRate, bind: bindRate } = useInput('')
  const {value: cost, setValue: setCost, bind: bindCost } = useInput('')
  const {value: weight, setValue: setWeight, bind: bindWeight } = useInput('')
  const {value: description, setValue: setDescription, bind: bindDescription } = useInput('')

  const { data: dataModels, refetch: refetchModels } = useQuery(getModelsQuery, { variables: { manufacturer: manufacturer } })

  const [displayOnWebsite, setDisplayOnWebsite] = useState(false)
  const [newId, setNewId] = useState(false)
  const [modelValues, setModelValues] = useState([])

  const alert = useAlert()

  useEffect(() => {
    if (assetType) {
      setManufacturer(assetType.manufacturer)
      setModel(assetType.model)
      setRate(assetType.rate)
      setCost(assetType.cost)
      setWeight(assetType.weight)
      setDescription(assetType.description || '')
      setDisplayOnWebsite(assetType.displayOnWebsite)
    }
  }, [assetType])

  useEffect(() => {
    if (manufacturer) {
      refetchModels()
    }
  }, [manufacturer])

  useEffect(() => {
    if (dataModels) {
      setModelValues(dataModels.models)
    }
  }, [dataModels])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (assetType) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const handleCreate = () => {
    mutation({ variables: { input: {
      manufacturer,
      model,
      rate: parseFloat(rate),
      cost: parseFloat(cost),
      weight: parseFloat(weight),
      displayOnWebsite,
      description
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully created asset type', { type: 'success'})
        setNewId(data.data.createAssetType.assetType.id)
      }
    })
  }

  const handleUpdate = () => {
    mutation({ variables: { input: {
      id: assetType.id,
      manufacturer,
      model,
      rate: parseFloat(rate),
      cost: parseFloat(cost),
      weight: parseFloat(weight),
      displayOnWebsite,
      description
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully updated asset type', { type: 'success'})
        refetch()
      }
    })
  }

  if (newId) return <Redirect to={`/ripple/asset-type/${newId}`} />
  if (loading) return <RippleSpinner />

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Details</h2>
      <Form.Row>
        <Form.Group as={Col} lg={6}>
          <Form.Label as='p'>Manufacturer</Form.Label>
          <ComboBox list='manufacturers' required={true} {...bindManufacturer}>
            { data.manufacturers.map((manufacturer) => (
              <option key={manufacturer}>{manufacturer}</option>
            ))}
          </ComboBox>
        </Form.Group>
        <Form.Group as={Col} lg={6}>
          <Form.Label as='p'>Model</Form.Label>
          <ComboBox list='models' required={true} {...bindModel}>
            { modelValues.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </ComboBox>
        </Form.Group>
        <ColControl lg={6} xl={3} prepend='£' label='Rate' required={true} type='number' step='0.01' {...bindRate} />
        <ColControl lg={6} xl={3} prepend='£' label='Cost' required={true} type='number' step='0.01' {...bindCost} />
        <ColControl lg={6} xl={3} append='kg' label='Weight' required={true} type='number' step='0.01' {...bindWeight} />
        <ColControl lg={6} xl={3} label='Display on website?'>
          <ButtonToggle callback={setDisplayOnWebsite} value={displayOnWebsite} />
        </ColControl>
        <ColControl sm={12} label='Description' as='textarea' rows={5} {...bindDescription} />
        <Form.Group as={Col} sm={12}>
          <RippleButton variant='success' type='submit' />
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

export default AssetTypeForm
