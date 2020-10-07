import React, { useState, useEffect, Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import ComboBox from '../../../../elements/ComboBox'
import RippleButton from '../../../../elements/RippleButton'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../../elements/RippleSpinner'
import { useAlert } from 'react-alert'
import { useQuery } from '@apollo/react-hooks'
import { useMutation } from '../../../../../helpers/GraphQL'
import { useInput } from '../../../../../hooks/InputHook'
import CardBlock from '../../../../elements/CardBlock'
import Form from 'react-bootstrap/Form'

const getQuery = loader('./get.gql')
const createMutation = loader('./create.gql')
const deleteMutation = loader('./delete.gql')

const MaintenanceSchedules = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: maintenanceSchedule, reset: resetMaintenanceSchedule, bind: bindMaintenanceSchedule } = useInput('')

  const alert = useAlert()

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)

  const handleCreate = () => {
    if (!maintenanceSchedule) {
      alert.show('Please select a maintenance schedule to add', { type: 'error' })
      return
    }
    sendCreate({ variables: { input: {
      assetTypeId : id,
      maintenanceScheduleId : maintenanceSchedule,
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved maintenance schedule', { type: 'success'})
        resetMaintenanceSchedule()
        refetch()
      }
    })
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted maintenance schedule', { type: 'success'})
        refetch()
      }
    })
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2>Maintenance Schedules</h2>
      <Table responsive>
        <thead>
          <tr>
            <th>Summary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Form.Control as='select' {...bindMaintenanceSchedule}>
                <option hidden disabled value=''></option>
                { data.availableMaintenanceSchedules.map((maintenanceSchedule) => (
                  <option key={maintenanceSchedule.id} value={maintenanceSchedule.id}>{maintenanceSchedule.summary}</option>
                ))}
              </Form.Control>
            </td>
            <td className='text-right'><RippleButton variant='success' onClick={handleCreate} /></td>
          </tr>
          { data.assetType.maintenanceSchedules.map((maintenanceSchedule) => (
            <tr key={maintenanceSchedule.id}>
              <td>{ maintenanceSchedule.summary }</td>
              <td className='text-right'><RippleButton variant='danger' onClick={() => handleDelete(maintenanceSchedule.id)} /></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default MaintenanceSchedules
