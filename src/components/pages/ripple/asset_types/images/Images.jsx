import React, { useState, useEffect, Fragment, useRef } from 'react'
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
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import md5 from 'js-md5'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import BlurImage from '../../../../elements/BlurImage'

const getQuery = loader('./get.gql')
const createMutation = loader('./create.gql')
const deleteMutation = loader('./delete.gql')
const uploadMutation = loader('./upload.gql')

const Images = (props) => {

  const { id } = props

  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const [addingImage, setAddingImage] = useState(false)
  const [filePreview, setFilePreview] = useState(false)
  const [uploading, setUploading] = useState(false)

  const alert = useAlert()

  const fileInput = useRef(null)

  const [sendCreate] = useMutation(createMutation, alert)
  const [sendDelete] = useMutation(deleteMutation, alert)
  const [sendUpload] = useMutation(uploadMutation, alert)

  const handleCreate = (e) => {
    e.preventDefault()
    const file = fileInput.current.files[0]

    if (!file) {
      alert.show('Please select an image to upload', { type: 'warning' })
      return
    }

    var reader = new FileReader()

    reader.onload = function(event) {
      var binary = event.target.result
      var hash = Buffer.from(md5(binary), 'hex').toString('base64')

      sendUpload({ variables: { input: {
        assetTypeId : id,
        contentType : file.type,
        byteSize : file.size,
        checksum : hash
      }}}).then((data) => {
        if (data) {
          const blob = data.data.uploadImage.blob

          const rawHeaders = blob.headers
          var headers = {}
          for (const header of rawHeaders) {
            const [key, value] = header.split(':')
            headers[key] = value.trim()
          }

          setUploading(true)
          fetch(blob.serviceUrl, {
            method: 'PUT',
            body: file,
            headers
          }).then((response) => {
            if (response.status != 200) {
              alert.show('Could not upload image', { type: 'error' })
            } else {
              sendCreate({ variables: { input: {
                blobId : blob.id,
                assetTypeId : id
              }}}).then((data) => {
                setUploading(false)

                if (data) {
                  alert.show('Successfully saved image', { type: 'success' })
                  resetFileInput(fileInput.current)
                  refetch()
                }
              })
            }
          })
        }
      })
    }

    reader.readAsArrayBuffer(file)
  }

  const handleDelete = (id) => {
    sendDelete({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted image', { type: 'success'})
        refetch()
      }
    })
  }

  const handleFileChange = (event) => {
    const input = event.target
    const file = input.files[0]

    updateFileInputName(input)

    var reader = new FileReader()

    reader.onload = function(event) {
      setFilePreview(event.target.result)
    }

    reader.readAsDataURL(file)
  }

  const handleResetFileInput = () => {
    resetFileInput(fileInput.current)
  }

  const updateFileInputName = (input) => {
    var filename
    if (input.files.length > 0) {
      filename = input.files[0].name
      input.nextSibling.innerText = filename
    }
  }

  const resetFileInput = (input) => {
    input.nextSibling.innerText = 'Choose an image'
    setFilePreview(false)
    input.value = null
  }

  const previewTag = (
    <Form.Group as={Row}>
      <Col>
        <img className='img-fluid' style={{maxHeight: '150px'}} src={filePreview} />
        { uploading ? <RippleSpinner inline /> : '' }
      </Col>
    </Form.Group>
  )

  var addingImageContent
  if (addingImage) {
    addingImageContent = (
      <Form encType='multipart/form-data' onSubmit={handleCreate}>
        <Form.Group as={Row}>
          <Col sm={10}><Form.File label='Choose an image' custom ref={fileInput} onChange={handleFileChange} /></Col>
          <Col sm={2} className='text-right'>
            <ButtonGroup>
              <RippleButton variant='success' type='submit' />
              <RippleButton variant='danger' icon='times' onClick={handleResetFileInput} />
            </ButtonGroup>
          </Col>
        </Form.Group>
        { filePreview ? previewTag : '' }
      </Form>
    )
  } else {
    addingImageContent = (
      <Card className='mt-3'>
        <Card.Body>
          <Button variant='primary' block onClick={() => setAddingImage(true)}>Add an image</Button>
        </Card.Body>
      </Card>
    )
  }

  if (loading) return <RippleSpinner />
  if (error) return <CardBlock message={error.message.replace('GraphQL error:', 'Error:')} />

  return (
    <Fragment>
      <h2 className='pb-4'>Images</h2>
      <Row>
        { data.assetType.resourceImages.map((image) => (
          <Col sm={4} key={image.id}>
            <Card>
              <BlurImage className='card-img-top p-3' image={image.image} />
              <Card.Footer className='text-center'>
                <RippleButton onClick={() => handleDelete(image.id)} variant='danger' />
              </Card.Footer>
            </Card>
          </Col>
        ))}
        <Col sm={12}>
          { addingImageContent }
        </Col>
      </Row>
    </Fragment>
  )
}

export default Images
