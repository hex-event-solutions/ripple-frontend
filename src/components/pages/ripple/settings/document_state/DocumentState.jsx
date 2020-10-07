import React, { useState, Fragment } from 'react'
import { loader } from 'graphql.macro'
import { useMutation, useQuery } from '@apollo/react-hooks'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAlert } from 'react-alert'

import { useInput } from '../../../../../hooks/InputHook'
import EditableField from '../EditableField'
import RippleSpinner from '../../../../elements/RippleSpinner'

const readQuery = loader('./read.gql')
const createMutation = loader('./create.gql')
const updateMutation = loader('./update.gql')
const deleteMutation = loader('./delete.gql')


const DocumentState = () => {
  const { loading, error, data, refetch } = useQuery(readQuery)

  const [mutationError, setMutationError] = useState(false)

  const alert = useAlert()

  const [createDocumentState] = useMutation(createMutation, alert)

  const {value: name, bind: bindName, reset: resetName } = useInput('')

  const handleSubmit = event => {
    event.preventDefault()
    const payload = {
      name: name
    }

    createDocumentState({ variables: { input: payload }}).then(() => {
      refetch()
      resetName()
    })
  }

  var createContent
  if (mutationError) {
    createContent = (
      <div>
        { mutationError }
        <Button className='ml-2' onClick={() => { setMutationError(false) }}><FontAwesomeIcon icon='check' /></Button>
      </div>
    )
  } else {
    createContent = (
      <Form inline onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Control className='mr-2' placeholder="Name" {...bindName} />
          <Button variant='success' type='submit' className='mr-2'><FontAwesomeIcon icon='check' /></Button>
        </Form.Group>
      </Form>
    )
  }

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Fragment>
      <Row>
        <Col>
          <h1>Document States</h1>
          <p>Document states allow you to keep track of what each document is currently doing</p>
          <Table responsive>
            <thead>
              <tr><th>Name</th><th width='20%'></th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  { createContent }
                </td>
              </tr>
              { data.documentStates.map(documentState => (
                <EditableField key={documentState.id} id={documentState.id} fields={{ name: documentState.name }} refetch={refetch} updateMutation={updateMutation} deleteMutation={deleteMutation} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  )
}

export default DocumentState
