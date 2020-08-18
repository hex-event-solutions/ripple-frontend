import React, { useState } from 'react'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'
import { humanize } from '../../../../helpers/String'
import { useMutation } from '../../../../helpers/GraphQL'
import { Redirect } from 'react-router-dom'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import ColControl from '../../../elements/ColControl'
import RippleButton from '../../../elements/RippleButton'
import ButtonToggle from '../../../elements/ButtonToggle'
import RippleTooltip from '../../../elements/RippleTooltip'

const readSubjects = loader('./subjects.gql')

const createMutation = loader('./create.gql')

const Create = () => {
  const { data, loading } = useQuery(readSubjects)

  const { value: name, bind: bindName } = useInput('')
  const { value: subject, bind: bindSubject } = useInput('')
  const { value: incrementPattern, bind: bindIncrementPattern } = useInput('(0000)')
  const { value: incrementStart, bind: bindIncrementStart } = useInput('1')

  const [newId, setNewId] = useState(false)
  const [incremental, setIncremental] = useState(true)
  const [dateIssued, setDateIssued] = useState(false)
  const [dateDue, setDateDue] = useState(false)

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)

  const handleSubmit = (e) => {
    e.preventDefault()
    sendCreate({ variables: { input: {
      name,
      subject,
      content: "content:\n- content:\n  - text: Default template",
      incrementPattern,
      incrementStart : parseInt(incrementStart),
      incremental,
      dateIssued,
      dateDue
    }}}).then((data) => {
      if (data) {
        console.log(data)
        alert.show('Template saved successfully', { type: 'success' })
        setNewId(data.data.createDocumentType.documentType.id)
      }
    })
  }



  if (newId) return <Redirect to={`/ripple/document-type/${newId}`} />
  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title='Create a new template' />
      <Row>
        <Col>
          <p>
            A document template allows you to design documents that get built for you from data in Ripple.
            Each template focuses on only one object type, such as Event or Asset Type, and each document has it's own numbering scheme.
            This numbering scheme can be customised with the Reference Pattern field below, or turned off completely for a custom reference for every document generated.
            It also provides a value to start at, to make switching to Ripple as smooth as possible.
          </p>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <ColControl label='Name' placeholder='Name' required={true} {...bindName} />
          <Form.Group as={Col}>
            <Form.Label as='p'>
              Document subject <RippleTooltip title="What's this?">
                The object that this document can be generated for
              </RippleTooltip>
            </Form.Label>
            <Form.Control as='select' className='mr-2' {...bindSubject} >
              <option hidden disabled value=''></option>
              { data?.__type?.enumValues.map((subject) => (
                <option key={subject.name} value={subject.name}>{ humanize(subject.name) }</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <ColControl sm={6} label='Incremental reference?'>
            <ButtonToggle callback={setIncremental} value={incremental} />
          </ColControl>
          <ColControl label='Has an issue date?'>
            <ButtonToggle callback={setDateIssued} value={dateIssued} />
          </ColControl>
          <ColControl label='Has a due date?'>
            <ButtonToggle callback={setDateDue} value={dateDue} />
          </ColControl>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label as='p'>
              Reference pattern <RippleTooltip title='How does this work?'>
                A pair of brackets will be replaced with the next number for each document. Add zeros between the brackets to pad the resulting number.<br/>
                <code className='h6'>INV(0000)</code> would result in a document reference INV0052 if the last reference was INV0051.
              </RippleTooltip>
            </Form.Label>
            <Form.Control disabled={!incremental} {...bindIncrementPattern} />
          </Form.Group>
          <ColControl label='Increment start' disabled={!incremental} {...bindIncrementStart} />
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <RippleButton variant='success' type='submit' />
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  )
}

export default Create
