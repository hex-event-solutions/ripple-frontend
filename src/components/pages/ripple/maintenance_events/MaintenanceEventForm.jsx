import React, { useState, Fragment } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ColControl from '../../../elements/ColControl'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import { useParams } from 'react-router-dom'
import RippleSpinner from '../../../elements/RippleSpinner'
import { useInput } from '../../../../hooks/InputHook'


const MaintenanceEventForm = (props) => {

  const { assetId, scheduleId, tasks } = props

  const { value: details, bind: bindDetails } = useInput('')

  const [taskValues, setTaskValues] = useState({})

  return (
    <Fragment>
      <Row>
        <ColControl label='Details' as='textarea' rows={3}/>
      </Row>
      { tasks.map((task) => (
        <Row>
          <Col>
            { task.name }
          </Col>
        </Row>
      ))}
    </Fragment>
  )
}

export default MaintenanceEventForm
