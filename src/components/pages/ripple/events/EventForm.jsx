import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import ColControl from '../../../elements/ColControl'
import RippleButton from '../../../elements/RippleButton'
import RippleSpinner from '../../../elements/RippleSpinner'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import RippleTooltip from '../../../elements/RippleTooltip'
import ComboBox from '../../../elements/ComboBox'

const autocompleteQuery = loader('./autocomplete.gql')

const EventForm = (props) => {
  const { event, mutation, refetch } = props

  const { error, data, loading } = useQuery(autocompleteQuery)

  const {value: client, setValue: setClient, bind: bindClient } = useInput('')
  const {value: description, setValue: setDescription, bind: bindDescription } = useInput('')
  const {value: details, setValue: setDetails, bind: bindDetails } = useInput('')
  const {value: location, setValue: setLocation, bind: bindLocation } = useInput('')

  const alert = useAlert()

  const [newId, setNewId] = useState(false)
  const [dateStart, setDateStart] = useState(new Date())
  const [dateEnd, setDateEnd] = useState(new Date())
  const [dateOut, setDateOut] = useState(new Date())
  const [dateReturn, setDateReturn] = useState(new Date())

  useEffect(() => {
    if (event) {
      setClient(event.client.id)
      setDateStart(Date.parse(event.dateStart))
      setDateEnd(Date.parse(event.dateEnd))
      setDateOut(Date.parse(event.dateOut))
      setDateReturn(Date.parse(event.dateReturn))
      setDescription(event.description)
      setDetails(event.details || '')
      setLocation(event.location)
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (event) {
      handleUpdate()
    } else {
      handleCreate()
    }
  }

  const handleCreate = () => {
    var params = {
      clientId : client,
      dateStart: (new Date(dateStart)).toISOString(),
      dateEnd: (new Date(dateEnd)).toISOString(),
      dateOut: (new Date(dateOut)).toISOString(),
      dateReturn: (new Date(dateReturn)).toISOString(),
      description,
      details,
      location
    }
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Event saved successfully', { type: 'success' })
        setNewId(data.data.createEvent.event.id)
      }
    })
  }

  const handleUpdate = () => {
    var params = {
      id : event.id,
      clientId : client,
      dateStart: (new Date(dateStart)).toISOString(),
      dateEnd: (new Date(dateEnd)).toISOString(),
      dateOut: (new Date(dateOut)).toISOString(),
      dateReturn: (new Date(dateReturn)).toISOString(),
      description,
      details,
      location
    }
    mutation({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Event saved successfully', { type: 'success' })
      }
    })
  }

  const datePickerProps = {
    showTimeSelect: true,
    timeIntervals: 15,
    dateFormat: 'dd/MM/yyyy HH:mm'
  }

  if (newId) return <Redirect to={`/ripple/event/${newId}`} />
  if (loading) return <RippleSpinner />

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} sm={12} xl={4}>
          <Form.Label as='p'>Client</Form.Label>
          <InputGroup>
            <Form.Control as='select' required={true} {...bindClient} >
              <option hidden disabled value=''></option>
              { data.clients.map((client) => (
                <option key={client.id} value={client.id}>{ `${client.organisationName} - ${client.clientType.name}` }</option>
              ))}
            </Form.Control>
            <InputGroup.Append>
              <Button variant='outline-primary' as={Link} to='/ripple/clients/new'>New</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <ColControl sm={12} xl={4} required={true} label='Description' {...bindDescription} />
        <Form.Group as={Col} sm={12} xl={4}>
          <Form.Label as='p'>Location</Form.Label>
          <ComboBox list='locations' required={true} {...bindLocation}>
            { data.locations.map((location) => (
              <option key={location}>{location}</option>
            ))}
          </ComboBox>
        </Form.Group>
        <ColControl sm={12} label='Details' as='textarea' rows={4} {...bindDetails} />

        <Form.Group as={Col} sm={12} lg={3}>
          <Form.Label as='p'>
            Out date <RippleTooltip title="What's this?">
              When your equipment is due to leave the warehouse
            </RippleTooltip>
          </Form.Label>
          <Form.Control as={DatePicker} required={true} selected={dateOut} onChange={setDateOut} {...datePickerProps} />
        </Form.Group>
        <Form.Group as={Col} sm={12} lg={3}>
          <Form.Label as='p'>
            Start date <RippleTooltip title="What's this?">
              When the client event starts
            </RippleTooltip>
          </Form.Label>
          <Form.Control as={DatePicker} required={true} selected={dateStart} onChange={setDateStart} {...datePickerProps} />
        </Form.Group>
        <Form.Group as={Col} sm={12} lg={3}>
          <Form.Label as='p'>
            End date <RippleTooltip title="What's this?">
              When the client event ends
            </RippleTooltip>
          </Form.Label>
          <Form.Control as={DatePicker} required={true} selected={dateEnd} onChange={setDateEnd} {...datePickerProps} />
        </Form.Group>
        <Form.Group as={Col} sm={12} lg={3}>
          <Form.Label as='p'>
            Return date <RippleTooltip title="What's this?">
              When your equipment is due back in the warehouse
            </RippleTooltip>
          </Form.Label>
          <Form.Control as={DatePicker} required={true} selected={dateReturn} onChange={setDateReturn} {...datePickerProps} />
        </Form.Group>
        <Form.Group as={Col} sm={12}>
          <RippleButton variant='success' type='submit' />
        </Form.Group>
      </Form.Row>
    </Form>
  )
}

export default EventForm
