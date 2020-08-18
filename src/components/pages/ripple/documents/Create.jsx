import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useParams } from 'react-router-dom'

import Heading from '../../../elements/Heading'
import { useInput } from '../../../../hooks/InputHook'
import { useAlert } from 'react-alert'
import RippleSpinner from '../../../elements/RippleSpinner'
import { useMutation } from '../../../../helpers/GraphQL'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import ColControl from '../../../elements/ColControl'

const getDocumentTypeQuery = loader('./getDocumentType.gql')
const createMutation = loader('./create.gql')

const Create = () => {
  const { documentTypeId, subjectId } = useParams()

  const { loading, error, data } = useQuery(getDocumentTypeQuery, { variables: { id: documentTypeId } })

  const {value: reference, bind: bindReference } = useInput('')

  const [createData, setCreateData] = useState(null)
  const [download, setDownload] = useState('')
  const [dateIssued, setDateIssued] = useState(new Date())
  const [dateDue, setDateDue] = useState(new Date())

  const alert = useAlert()

  const [sendCreate, { loading: createLoading }] = useMutation(createMutation, alert)

  const handleSubmit = (e) => {
    e.preventDefault()
    var params = {
      documentTypeId,
      subjectId,
      reference
    }
    if (data.documentType.dateIssued) params.dateIssued = dateIssued
    if (data.documentType.dateDue) params.dateDue = dateDue
    sendCreate({ variables: { input: params }}).then((data) => {
      if (data) {
        alert.show('Successfully saved document', { type: 'success' })
        setCreateData(data)
      }
    })
  }

  useEffect(() => {
    if (createLoading) {
      setDownload(<RippleSpinner inline />)
    } else if (createData) {
      console.log(createData)
      const url = createData.data.createDocument.document.url
      setDownload(<Button variant='primary' className='ml-2' href={url} target='_blank'>Download</Button>)
    }
  }, [createData, createLoading])

  if (loading) return <RippleSpinner />
  if (error) return alert.show(error.message.replace('GraphQL error:', 'Error:'), { type: 'error' })

  return (
    <Container fluid>
      <Heading title={`New ${data.documentType.name}`}/>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Row>
              <ColControl label='Document reference' disabled={data.documentType.incremental} {...bindReference} />
              <Form.Group as={Col}>
                <Form.Label as='p'>Date issued</Form.Label>
                <Form.Control as={DatePicker} disabled={!data.documentType.dateIssued} selected={dateIssued} onChange={setDateIssued} dateFormat='dd/MM/yyyy' />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label as='p'>Date due</Form.Label>
                <Form.Control as={DatePicker} disabled={!data.documentType.dateDue} selected={dateDue} onChange={setDateDue} dateFormat='dd/MM/yyyy' />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Button variant='success' type='submit'><FontAwesomeIcon icon='check' /></Button>
                { download }
              </Form.Group>
            </Form.Row>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Create
