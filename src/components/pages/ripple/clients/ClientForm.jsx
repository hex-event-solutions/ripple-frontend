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
import { Link, Redirect } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const readClientTypesQuery = loader('./readClientTypes.gql')

const ClientForm = (props) => {
  const { client, mutation } = props

  const { data, loading } = useQuery(readClientTypesQuery)

  const {value: organisationName, setValue: setOrganisationName, bind: bindOrganisationName } = useInput('')
  const {value: clientType, setValue: setClientType, bind: bindClientType } = useInput('')
  const {value: address1, setValue: setAddress1, bind: bindAddress1 } = useInput('')
  const {value: address2, setValue: setAddress2, bind: bindAddress2 } = useInput('')
  const {value: address3, setValue: setAddress3, bind: bindAddress3 } = useInput('')
  const {value: city, setValue: setCity, bind: bindCity } = useInput('')
  const {value: county, setValue: setCounty, bind: bindCounty } = useInput('')
  const {value: postcode, setValue: setPostcode, bind: bindPostcode } = useInput('')
  const {value: discount, setValue: setDiscount, bind: bindDiscount } = useInput('0')

  const alert = useAlert()

  const [newId, setNewId] = useState(false)

  useEffect(() => {
    if (client) {
      setOrganisationName(client.organisationName)
      setClientType(client.clientType.id)
      setAddress1(client.address1)
      setAddress2(client.address2)
      setAddress3(client.address3)
      setCity(client.city)
      setCounty(client.county)
      setPostcode(client.postcode)
      setDiscount(client.discount)
    }
  }, [client, setOrganisationName, setClientType, setAddress1, setAddress2, setAddress3, setCity, setCounty, setPostcode, setDiscount])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (client) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const handleCreate = () => {
    var params = {
      organisationName,
      clientTypeId : clientType,
      address1,
      address2 : (address2 == '' ? null : address2),
      address3 : (address3 == '' ? null : address3),
      city,
      county,
      postcode,
      discount : parseInt(discount)
    }
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Client saved successfully', { type: 'success' })
        setNewId(data.data.createClient.client.id)
      }
    })
  }

  const handleUpdate = () => {
    var params = {
      id : client.id,
      organisationName,
      clientTypeId : clientType,
      address1,
      address2,
      address3,
      city,
      county,
      postcode,
      discount : parseInt(discount)
    }
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Client saved successfully', { type: 'success' })
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (newId) return <Redirect to={`/ripple/client/${newId}`} />

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <ColControl lg={4} required={true} label='Organisation name' {...bindOrganisationName} />
        <Form.Group as={Col} lg={4}>
          <Form.Label as='p'>Client type</Form.Label>
          <Form.Control as='select' required={true} {...bindClientType} >
            <option hidden disabled value=''></option>
            { data.clientTypes.map((clientType) => (
              <option key={clientType.id} value={clientType.id}>{ clientType.name }</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} lg={4}>
          <Form.Label as='p'>Discount</Form.Label>
          <InputGroup>
            <Form.Control type='number' required={true} {...bindDiscount}/>
            <InputGroup.Append><InputGroup.Text>%</InputGroup.Text></InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <ColControl lg={4} label='Address line 1' required={true} {...bindAddress1} />
        <ColControl lg={4} label='Address line 2' {...bindAddress2} />
        <ColControl lg={4} label='Address line 3' {...bindAddress3} />
        <ColControl lg={4} label='City' required={true} {...bindCity} />
        <ColControl lg={4} label='County' required={true} {...bindCounty} />
        <ColControl lg={4} label='Postcode' required={true} {...bindPostcode} />
        <Form.Group as={Col} sm={12}>
          <RippleButton variant='success' type='submit' />
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

export default ClientForm
