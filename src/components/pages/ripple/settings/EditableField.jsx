import React, { useState } from 'react'

import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ContentEditable from 'react-contenteditable'
import { useAlert } from 'react-alert'
import { useMutation } from '../../../../helpers/GraphQL'

const EditableField = (props) => {
  const { id, fields, refetch, updateMutation, deleteMutation } = props

  const [editing, setEditing] = useState(false)

  const [state, setState] = useState(fields)

  const [mutationError, setMutationError] = useState(null)

  const alert = useAlert()

  const [sendUpdate] = useMutation(updateMutation, alert)

  const [sendDelete] = useMutation(deleteMutation, alert)

  const enableEditor = () => {
    setEditing(true)
  }

  const handleChange = event => {
    const { currentTarget: { dataset: { field } }, target: { value } } = event

    setState({ ...state, [field]: value })
  }

  const handleUpdate = () => {
    sendUpdate({ variables: { input: { id: id, ...state } }}).then(() => {
      setEditing(false)
      refetch()
    })
  }

  const handleDelete = () => {
    sendDelete({ variables: { input: { id: id } }}).then(() => {
      setEditing(false)
      refetch()
    })
  }

  const plainPaste = (event) => {
    event.preventDefault()

    const text = event.clipboardData.getData('text/plain')
    document.execCommand('insertHTML', false, text)
  }

  // const reformat = (str) => {
  //   return str
  //     .replace(/&nbsp;/g, ' ')
  //     .replace(/&amp;/g, '&')
  //     .replace(/&gt;/g, '>')
  //     .replace(/&lt;/g, '<')
  //   }

  var tableContent = []
  for (const field in state) {
    tableContent.push(
      <td key={field}>
        <ContentEditable
          html={state[field]}
          disabled={!editing}
          className={`${editing ? 'border border-white rounded' : ''}`}
          data-field={field}
          onChange={handleChange}
          onPaste={plainPaste}
        />
      </td>
    )
  }
  if (editing) {
    tableContent.push(
      <td key='buttons'>
        <Button variant='success' onClick={handleUpdate} className='mr-2'><FontAwesomeIcon icon='check' /></Button>
        <Button variant='warning' onClick={() => { setState(fields); setEditing(false) }} className='mr-2'><FontAwesomeIcon icon='times' /></Button>
        <Button variant='danger' onClick={handleDelete} className='mr-2'><FontAwesomeIcon icon='trash' /></Button>
      </td>
    )
  } else {
    tableContent.push(
      <td key='buttons'><Button variant='secondary' onClick={enableEditor} className='mr-2'><FontAwesomeIcon icon='pencil-alt' /></Button></td>
    )
  }

  var content
  if (mutationError) {
    content = (
      <td colSpan={tableContent.length}>
        { mutationError }
        <Button className='ml-2' onClick={() => { setMutationError(false); setEditing(true) }}><FontAwesomeIcon icon='check' /></Button>
      </td>
    )
  } else {
    content = tableContent
  }

  return (
    <tr key={id}>
      { content }
    </tr>
  )
}

export default EditableField
