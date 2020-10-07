import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'

import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAlert } from 'react-alert'

import { humanize } from '../../../../../helpers/String'
import { useMutation } from '../../../../../helpers/GraphQL'
import RippleSpinner from '../../../../elements/RippleSpinner'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
// import EditableField from '../EditableField'

const readQuery = loader('./read.gql')
const deleteMutation = loader('./delete.gql')

const DocumentType = () => {
  const { loading, error, data, refetch } = useQuery(readQuery)

  const alert = useAlert()

  const [sendDelete] = useMutation(deleteMutation, alert)

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id: id } }}).then(() => {
      refetch()
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Fragment>
      <Row>
        <Col>
          <h1>Document Templates</h1>
          <p>Document templates create a clean and reusable way of producing PDFs for your clients or staff</p>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th width='20%'></th>
              </tr>
            </thead>
            <tbody>
              <tr><td><Button as={Link} variant='primary' to='/ripple/document-types/new'>New</Button></td></tr>
              { data.documentTypes.map(documentType => (
                <tr key={documentType.id}>
                  <td>{documentType.name}</td>
                  <td>{ humanize(documentType.subject) }</td>
                  <td className='text-right'>
                    <ButtonGroup>
                      <Button as={Link} to={`/ripple/document-type/${documentType.id}`} variant='secondary'><FontAwesomeIcon icon='pencil-alt' /></Button>
                      <Button variant='danger' onClick={() => handleDelete(documentType.id)}><FontAwesomeIcon icon='trash' /></Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  )
}

export default DocumentType
