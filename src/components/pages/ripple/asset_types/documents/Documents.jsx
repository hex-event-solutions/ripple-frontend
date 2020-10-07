import React, { Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../../elements/RippleSpinner'
import { useQuery } from '@apollo/react-hooks'
import CardBlock from '../../../../elements/CardBlock'
import Button from 'react-bootstrap/Button'

const getQuery = loader('./get.gql')

const Documents = (props) => {

  const { id } = props

  const { loading, error, data } = useQuery(getQuery, { variables: { id } })

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Documents</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Type</th>
            <th>Reference</th>
            <th>Date issued</th>
            <th>Date due</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { data.assetType.documents.map((document) => (
            <tr key={ document.id }>
              <td key='documentType.name'>{ document.documentType.name }</td>
              <td key='reference'>{ document.reference }</td>
              <td key='dateIssued'>{ document.dateIssued }</td>
              <td key='dateDue'>{ document.dateDue }</td>
              <td key='createdAt'>{ document.createdAt }</td>
              <td key='buttons' className='text-right'>
                <Button href={ document.url } >Regenerate</Button>
                <Button className='ml-2' href={ document.url } target='_blank' >Download</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default Documents
