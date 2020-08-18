import React from 'react'
import { Link } from 'react-router-dom'

import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import RippleSpinner from '../RippleSpinner'

const readQuery = loader('./read.gql')

const GenerateDocument = (props) => {
  const { subject, subjectId, ...others } = props
  const { loading, error, data } = useQuery(readQuery, { variables: { subject } })

  if (loading) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  if (data.documentTypes.length > 0) {
    return (
      <DropdownButton variant='primary' title='Generate document' {...others} >
        { data.documentTypes.map((documentType) => (
          <Dropdown.Item as={Link} key={documentType.id} to={`/ripple/documents/${documentType.id}/new/${subjectId}`}>{ documentType.name }</Dropdown.Item>
        ))}
      </DropdownButton>
    )
  } else {
    return ''
  }
}

export default GenerateDocument
