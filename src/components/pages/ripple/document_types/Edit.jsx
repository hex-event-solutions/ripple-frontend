import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'
import { humanize } from '../../../../helpers/String'
import { useMutation } from '../../../../helpers/GraphQL'
import RippleSpinner from '../../../elements/RippleSpinner'
import Heading from '../../../elements/Heading'
import ColControl from '../../../elements/ColControl'
import ButtonToggle from '../../../elements/ButtonToggle'
import RippleButton from '../../../elements/RippleButton'
import RippleTooltip from '../../../elements/RippleTooltip'

const getQuery = loader('./get.gql')

const updateMutation = loader('./update.gql')
const testMutation = loader('./test.gql')

const Edit = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(getQuery, { variables: { id } })

  const {value: name, setValue: setName, bind: bindName } = useInput('')
  const {value: subject, setValue: setSubject, bind: bindSubject } = useInput('')
  const {value: header, setValue: setHeader, bind: bindHeader } = useInput('')
  const {value: footer, setValue: setFooter, bind: bindFooter } = useInput('')
  const {value: content, setValue: setContent, bind: bindContent } = useInput('')
  const {value: styles, setValue: setStyles, bind: bindStyles } = useInput('')
  const {value: incrementPattern, setValue: setIncrementPattern, bind: bindIncrementPattern } = useInput('')
  const {value: incrementStart, setValue: setIncrementStart, bind: bindIncrementStart } = useInput('')

  const alert = useAlert()

  const [incremental, setIncremental] = useState(false)
  const [dateIssued, setDateIssued] = useState(false)
  const [dateDue, setDateDue] = useState(false)

  useEffect(() => {
    if (data) {
      setName(data.documentType.name)
      setSubject(data.documentType.subject)
      setHeader(data.documentType.header || '')
      setFooter(data.documentType.footer || '')
      setContent(data.documentType.content)
      setStyles(data.documentType.styles || '')
      setIncrementPattern(data.documentType.incrementPattern || '(0000)')
      setIncrementStart(data.documentType.incrementStart || '1')
      setIncremental(data.documentType.incremental)
      setDateIssued(data.documentType.dateIssued)
      setDateDue(data.documentType.dateDue)
    }
  }, [data])

  const [testLoadingSpinner, setTestLoadingSpinner] = useState('')

  const [sendUpdate] = useMutation(updateMutation, alert)
  const [sendTest] = useMutation(testMutation, alert)

  const handleSubmit = (e) => {
    e.preventDefault()
    sendUpdate({ variables: { input: {
      id,
      name,
      subject,
      header,
      footer,
      content,
      styles,
      incremental,
      incrementPattern,
      incrementStart : parseInt(incrementStart),
      dateIssued,
      dateDue
    }}}).then((data) => {
      if (data) {
        alert.show('Template saved successfully', { type: 'success' })
      }
    })
  }

  const handleTest = () => {
    setTestLoadingSpinner(<RippleSpinner inline />)
    sendTest({ variables: { input: {
      id: id
    }}}).then((data) => {
      setTestLoadingSpinner('')
      if (data?.data?.testDocumentType) {
        var win = window.open(data.data.testDocumentType.document.serviceUrl, '_blank')
        win.focus()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title={`Edit ${ name }`} />
      <Row>
        <Col>
          <p>A document template forms the base for all documents generated against an object.</p>
          <p>
            The Header, Template and Footer are all rendered using the Mustache templating
            framework, allowing you to lay out your document as required, and dynamically populate
            it with content from Ripple. HTML is recommended, but you can use plain text if you'd
            prefer.
          </p>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <ColControl label='Name' placeholder='Name' required={true} {...bindName} />
          <Form.Group as={Col}>
            <Form.Label as='p'>
              Document subject - <span className='small'>The object that this document can be generated for</span>
            </Form.Label>
            <Form.Control as='select' className='mr-2' {...bindSubject} >
              { data.__type.enumValues.map((subject) => (
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
          <ColControl label='Increment start' disabled={!incremental} type='number' step='1' {...bindIncrementStart} />
        </Form.Row>
        <Form.Row>
          <ColControl label='Header - This template will appear below the company-wide document header' as='textarea' rows='4' {...bindHeader} />
        </Form.Row>
        <Form.Row>
          <ColControl label='Content - This template will populate the content of your document' as='textarea' rows='10' {...bindContent} />
        </Form.Row>
        <Form.Row>
          <ColControl label='Footer - This template will appear above the company-wide document footer' as='textarea' rows='4' {...bindFooter} />
        </Form.Row>
        <Form.Row>
          <ColControl label='Styles - This section allows you to override any styles the document will be rendered with' as='textarea' rows='4' {...bindStyles} />
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <RippleButton variant='success' type='submit' />
            <Button variant='primary' className='m-2' onClick={handleTest}>Test template</Button>
            { testLoadingSpinner }
          </Form.Group>
        </Form.Row>
      </Form>
    </Container>
  )
}

export default Edit
