import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import GenerateDocument from './generate_document/GenerateDocument'
import Table from 'react-bootstrap/Table'

const TableButton = (props) => {
  const { route, subject, id, breakpoint } = props

  return (
    <Fragment>
      <Button as={Link} to={`/ripple/${route}/${id}`} variant='secondary' className={`d-${breakpoint}-none`}>View</Button>
      <ButtonGroup className={`d-none d-${breakpoint}-inline`}>
        <Button as={Link} to={`/ripple/${route}/${id}`} variant='secondary'>View</Button>
        <GenerateDocument as={ButtonGroup} subject={subject} subjectId={id} />
      </ButtonGroup>
    </Fragment>
  )
}

export default TableButton

TableButton.defaultProps = {
  breakpoint: 'md'
}
