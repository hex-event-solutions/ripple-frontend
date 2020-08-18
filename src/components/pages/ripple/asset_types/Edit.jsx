import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { loader } from 'graphql.macro'
import { useQuery } from '@apollo/react-hooks'
import { useAlert } from 'react-alert'
import md5 from 'js-md5'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Card from 'react-bootstrap/Card'
import Heading from '../../../elements/Heading'
import RippleSpinner from '../../../elements/RippleSpinner'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import { useInput } from '../../../../hooks/InputHook'
import { useMutation } from '../../../../helpers/GraphQL'
import ComboBox from '../../../elements/ComboBox'
import RippleButton from '../../../elements/RippleButton'
import BlurImage from '../../../elements/BlurImage'
import AssetTypeForm from './AssetTypeForm'

const getQuery = loader('./get.gql')
const getSpecificationValuesQuery = loader('./getSpecificationValues.gql')
const updateMutation = loader('./update.gql')
const createImageMutation = loader('./createImage.gql')
const uploadImageMutation = loader('./uploadImage.gql')
const deleteImageMutation = loader('./deleteImage.gql')
const createAccessoryMutation = loader('./createAccessory.gql')
const createAssetTypeCategoryMutation = loader('./createAssetTypeCategory.gql')
const createAssetTypeMultiplierTypeMutation = loader('./createAssetTypeMultiplierType.gql')
const createAssetTypeSpecificationMutation = loader('./createAssetTypeSpecification.gql')
const deleteAccessoryMutation = loader('./deleteAccessory.gql')
const deleteAssetTypeSpecificationMutation = loader('./deleteAssetTypeSpecification.gql')
const deleteAssetTypeCategoryMutation = loader('./deleteAssetTypeCategory.gql')
const deleteAssetTypeMultiplierTypeMutation = loader('./deleteAssetTypeMultiplierType.gql')

const Edit = () => {
  const { id } = useParams()
  const { loading, error, data, refetch } = useQuery(getQuery, { variables: { id } })

  const {value: specification, reset: resetSpecification, bind: bindSpecification } = useInput('')
  const {value: specificationValue, reset: resetSpecificationValue, bind: bindSpecificationValue } = useInput('')
  const {value: accessory, reset: resetAccessory, bind: bindAccessory } = useInput('')
  const {value: accessoryQuantity, reset: resetAccessoryQuantity, bind: bindAccessoryQuantity } = useInput('')
  const {value: multiplierType, reset: resetMultiplierType, bind: bindMultiplierType } = useInput('')
  const {value: category, reset: resetCategory, bind: bindCategory } = useInput('')

  const { data: dataSpecificationValues, refetch: refetchSpecificationValues } = useQuery(getSpecificationValuesQuery, { variables: { name: specification } })

  const [specificationValues, setSpecificationValues] = useState([])

  const [addingImage, setAddingImage] = useState(false)
  const [filePreview, setFilePreview] = useState(false)

  const alert = useAlert()

  const fileInput = useRef(null)

  const [sendUpdate] = useMutation(updateMutation, alert)
  const [sendCreateImage] = useMutation(createImageMutation, alert)
  const [sendUploadImage] = useMutation(uploadImageMutation, alert)
  const [sendDeleteImage] = useMutation(deleteImageMutation, alert)
  const [sendCreateAccessory] = useMutation(createAccessoryMutation, alert)
  const [sendCreateAssetTypeCategory] = useMutation(createAssetTypeCategoryMutation, alert)
  const [sendCreateAssetTypeMultiplierType] = useMutation(createAssetTypeMultiplierTypeMutation, alert)
  const [sendCreateAssetTypeSpecification] = useMutation(createAssetTypeSpecificationMutation, alert)
  const [sendDeleteAssetTypeSpecification] = useMutation(deleteAssetTypeSpecificationMutation, alert)
  const [sendDeleteAccessory] = useMutation(deleteAccessoryMutation, alert)
  const [sendDeleteAssetTypeCategory] = useMutation(deleteAssetTypeCategoryMutation, alert)
  const [sendDeleteAssetTypeMultiplierType] = useMutation(deleteAssetTypeMultiplierTypeMutation, alert)

  useEffect(() => {
    if (specification) {
      refetchSpecificationValues()
    }
  }, [specification])

  useEffect(() => {
    if (dataSpecificationValues) {
      setSpecificationValues(dataSpecificationValues.specificationValues)
    }
  }, [dataSpecificationValues])

  const handleImage = (e) => {
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

      sendUploadImage({ variables: { input: {
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

          fetch(blob.serviceUrl, {
            method: 'PUT',
            body: file,
            headers
          }).then((response) => {
            if (response.status != 200) {
              alert.show('Could not upload image', { type: 'error' })
            } else {
              sendCreateImage({ variables: { input: {
                blobId : blob.id,
                assetTypeId : id
              }}}).then((data) => {
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

  const handleImageDelete = (id) => {
    sendDeleteImage({ variables: { input: { id }}}).then((data) => {
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

  const handleSpecification = () => {
    if (!specification) {
      alert.show('Please select a specification to add', { type: 'error' })
      return
    }
    if (!specificationValue) {
      alert.show('Please set a value for this specification', { type: 'error' })
      return
    }
    sendCreateAssetTypeSpecification({ variables: { input: {
      assetTypeId : id,
      name : specification,
      value : specificationValue
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved specification', { type: 'success'})
        resetSpecification()
        resetSpecificationValue()
        refetch()
      }
    })
  }

  const handleSpecificationDelete = (id) => {
    sendDeleteAssetTypeSpecification({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted specification', { type: 'success'})
        refetch()
      }
    })
  }

  const handleAccessory = () => {
    if (!accessory) {
      alert.show('Please select an accessory to add', { type: 'error' })
      return
    }
    if (!accessoryQuantity) {
      alert.show('Please set a quantity of this accessory to add', { type: 'error' })
      return
    }
    sendCreateAccessory({ variables: { input: {
      assetTypeId : id,
      accessoryId : accessory,
      quantity : parseInt(accessoryQuantity)
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved accessory', { type: 'success'})
        resetAccessory()
        resetAccessoryQuantity()
        refetch()
      }
    })
  }

  const handleAccessoryDelete = (id) => {
    sendDeleteAccessory({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted accessory', { type: 'success'})
        refetch()
      }
    })
  }

  const handleCategory = () => {
    if (!category) {
      alert.show('Please select a category to add', { type: 'error' })
      return
    }
    sendCreateAssetTypeCategory({ variables: { input: {
      assetTypeId : id,
      categoryId : category,
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved category', { type: 'success'})
        resetCategory()
        refetch()
      }
    })
  }

  const handleCategoryDelete = (id) => {
    sendDeleteAssetTypeCategory({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted category', { type: 'success'})
        refetch()
      }
    })
  }

  const handleMultiplierType = () => {
    if (!multiplierType) {
      alert.show('Please select a rate multiplier to add', { type: 'error' })
      return
    }
    sendCreateAssetTypeMultiplierType({ variables: { input: {
      assetTypeId : id,
      multiplierTypeId : multiplierType,
    }}}).then((data) => {
      if (data) {
        alert.show('Successfully saved rate multiplier', { type: 'success'})
        resetMultiplierType()
        refetch()
      }
    })
  }

  const handleMultiplierTypeDelete = (id) => {
    sendDeleteAssetTypeMultiplierType({ variables: { input: { id }}}).then((data) => {
      if (data) {
        alert.show('Successfully deleted rate multiplier', { type: 'success'})
        refetch()
      }
    })
  }

  const filePreviewTag = <Form.Group as={Row}><Col><img className='img-fluid' style={{maxHeight: '150px'}} src={filePreview} /></Col></Form.Group>

  var addingImageContent
  if (addingImage) {
    addingImageContent = (
      <Form encType='multipart/form-data' onSubmit={handleImage}>
        <Form.Group as={Row}>
          <Col sm={10}><Form.File label='Choose an image' custom ref={fileInput} onChange={handleFileChange} /></Col>
          <Col sm={2} className='text-right'>
            <ButtonGroup>
              <RippleButton variant='success' type='submit' />
              <RippleButton variant='danger' icon='times' onClick={handleResetFileInput} />
            </ButtonGroup>
          </Col>
        </Form.Group>
        { filePreview ? filePreviewTag : '' }
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

  if (loading ) return <RippleSpinner />
  if (error) return `Error! ${error.message}`

  return (
    <Container fluid>
      <Heading title={ data.assetType.name } subject='AssetType' subjectId={id} />
      <Row>
        <Col sm={12} xl={8}>
          <AssetTypeForm assetType={data.assetType} mutation={sendUpdate} refetch={refetch} />
        </Col>
        <Col sm={12} xl={4}>
          <h2 className='pb-4'>Images</h2>
          <Row>
            { data.assetType.resourceImages.map((image) => (
              <Col sm={4} key={image.id}>
                <Card>
                  <BlurImage className='card-img-top p-3' image={image.image} />
                  <Card.Footer className='text-center'>
                    <RippleButton onClick={() => handleImageDelete(image.id)} variant='danger' />
                  </Card.Footer>
                </Card>
              </Col>
            ))}
            <Col sm={12}>
              { addingImageContent }
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col className='pr-xl-5' sm={12} xl={6}>
          <h2>Specifications</h2>
          <Table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ComboBox list='specifications' {...bindSpecification}>
                    { data.availableSpecifications.map((specification) => (
                      <option key={specification.name}>{specification.name}</option>
                    ))}
                  </ComboBox>
                </td>
                <td>
                  <ComboBox list='specificationValues' {...bindSpecificationValue}>
                    { specificationValues.map((specification) => (
                      <option key={specification}>{specification}</option>
                    ))}
                  </ComboBox>
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleSpecification} /></td>
              </tr>
              { data.assetType.assetTypeSpecifications.map((specification) => (
                <tr>
                  <td>{ specification.specification.name }</td>
                  <td>{ specification.value }</td>
                  <td className='text-right'><RippleButton variant='danger' onClick={() => handleSpecificationDelete(specification.id)} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col className='pl-xl-5' sm={12} xl={6}>
          <h2>Accessories</h2>
          <Table>
            <thead>
              <tr>
                <th>Asset type</th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control as='select' {...bindAccessory}>
                    <option hidden disabled value=''></option>
                    { data.availableAccessories.map((assetType) => (
                      <option key={assetType.id} value={assetType.id}>{assetType.name}</option>
                    ))}
                  </Form.Control>
                </td>
                <td>
                  <Form.Control type='number' {...bindAccessoryQuantity} />
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleAccessory} /></td>
              </tr>
              { data.assetType.accessories.map((accessory) => (
                <tr key={accessory.id}>
                  <td>{ accessory.accessory.name }</td>
                  <td>{ accessory.quantity }</td>
                  <td className='text-right'><RippleButton variant='danger' onClick={() => handleAccessoryDelete(accessory.id)} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col className='pr-xl-5' sm={12} xl={6}>
          <h2>Categories</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Form.Control as='select' {...bindCategory}>
                    <option hidden disabled value=''></option>
                    { data.availableCategories.map((category) => (
                      <option key={category.id} value={category.id}>{category.fullname}</option>
                    ))}
                  </Form.Control>
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleCategory} /></td>
              </tr>
              { data.assetType.assetTypeCategories.map((category) => (
                <tr key={category.id}>
                  <td>{ category.category.fullname }</td>
                  <td className='text-right'><RippleButton variant='danger' onClick={() => handleCategoryDelete(category.id)} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col className='pl-xl-5' sm={12} xl={6}>
          <h2>Rate multipliers</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hire duration</th>
                <th>Charge duration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3}>
                  <Form.Control as='select' {...bindMultiplierType}>
                    <option hidden disabled value=''></option>
                    { data.availableMultiplierTypes.map((multiplierType) => (
                      <option key={multiplierType.id} value={multiplierType.id}>{multiplierType.name} - { multiplierType.summary }</option>
                    ))}
                  </Form.Control>
                </td>
                <td className='text-right'><RippleButton variant='success' onClick={handleMultiplierType} /></td>
              </tr>
              { data.assetType.assetTypeMultiplierTypes.map((multiplierType) => (
                <tr key={multiplierType.id}>
                  <td>{ multiplierType.multiplierType.name }</td>
                  <td>{ multiplierType.multiplierType.operandQuantity } { multiplierType.multiplierType.operandType }</td>
                  <td>{ multiplierType.multiplierType.multiplier } { multiplierType.multiplierType.multiplierType }</td>
                  <td className='text-right'><RippleButton variant='danger' onClick={() => handleMultiplierTypeDelete(multiplierType.id)} /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Documents</h2>
          <Table>
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
        </Col>
      </Row>
    </Container>
  )
}

export default Edit
