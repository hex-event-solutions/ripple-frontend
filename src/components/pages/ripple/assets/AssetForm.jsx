import React, { useState, useEffect } from 'react'

import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import ColControl from '../../../elements/ColControl'
import ButtonToggle from '../../../elements/ButtonToggle'
import RippleButton from '../../../elements/RippleButton'
import RippleSpinner from '../../../elements/RippleSpinner'
import InputGroup from 'react-bootstrap/InputGroup'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const readAssetTypes = loader('./readAssetTypes.gql')

const AssetForm = (props) => {
  const { asset, mutation } = props

  const { data, loading } = useQuery(readAssetTypes)

  const {value: assetType, setValue: setAssetType, reset: resetAssetType, bind: bindAssetType } = useInput('')
  const {value: assetCase, setValue: setAssetCase, reset: resetAssetCase, bind: bindAssetCase } = useInput('')
  const {value: barcode, setValue: setBarcode, reset: resetBarcode, bind: bindBarcode } = useInput('')
  const {value: quantity, reset: resetQuantity, bind: bindQuantity } = useInput('1')

  const alert = useAlert()

  const [customBarcode, setCustomBarcode] = useState(false)

  useEffect(() => {
    if (asset) {
      setAssetType(asset.assetType.id)
      setAssetCase(asset.assetCase.id)
      setBarcode(asset.barcode)
    }
  }, [asset, setAssetType, setAssetCase, setBarcode])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (asset) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const handleCreate = () => {
    var params = {
      assetTypeId : assetType,
      quantity : parseInt(quantity)
    }
    if (assetCase != '') params.assetCaseId = assetCase
    if (customBarcode) params.barcode = barcode
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Asset(s) saved successfully', { type: 'success' })
        resetAssetType()
        resetAssetCase()
        resetBarcode()
        resetQuantity()
        setCustomBarcode(false)
      }
    })
  }

  const handleUpdate = () => {
    var params = {
      id : asset.id,
      assetTypeId : assetType
    }
    if (assetCase != '') params.assetCaseId = assetCase
    if (customBarcode) params.barcode = barcode
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Asset saved successfully', { type: 'success' })
      }
    })
  }

  const qtyInput = ( <ColControl label='Quantity' disabled={customBarcode} type='number' step='1' {...bindQuantity} /> )

  if (loading) return <RippleSpinner />

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} lg={6}>
          <Form.Label as='p'>Asset type</Form.Label>
          <InputGroup>
            <Form.Control as='select' {...bindAssetType} >
              <option hidden disabled value=''></option>
              { data.assetTypes.map((assetType) => (
                <option key={assetType.id} value={assetType.id}>{ assetType.name }</option>
              ))}
            </Form.Control>
            <InputGroup.Append>
              <Button variant='outline-primary' as={Link} to='/ripple/asset-types/new'>New</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} lg={6}>
          <Form.Label as='p'>Case</Form.Label>
          <Form.Control as='select' {...bindAssetCase} >
            <option value=''>New case</option>
            { data.assetCases.map((assetCase) => (
              <option key={assetCase.id} value={assetCase.id}>{ assetCase.barcode }</option>
            ))}
          </Form.Control>
        </Form.Group>
        <ColControl label='Use custom barcode?' lg={ asset ? 6 : 4 } >
          <ButtonToggle callback={setCustomBarcode} value={customBarcode} />
        </ColControl>
        <ColControl label='Barcode' disabled={!customBarcode} {...bindBarcode} lg={ asset ? 6 : 4 } />
        { asset ? '' : qtyInput }
        <Form.Group as={Col} sm={12}>
          <RippleButton variant='success' type='submit' />
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

export default AssetForm
