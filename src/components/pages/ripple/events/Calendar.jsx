import React, { useState, useEffect, Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import Heading from '../../../elements/Heading'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'
import RippleSpinner from '../../../elements/RippleSpinner'
import { Link } from 'react-router-dom'

const calendarQuery = loader('./calendar.gql')

const Calendar = () => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const [startDate, setStartDate] = useState(new Date())
  const [firstDay, setFirstDay] = useState(0)
  const [calendarOffset, setCalendarOffset] = useState(4)
  const [headerDays, setHeaderDays] = useState([])
  const [content, setContent] = useState([])

  const { data, loading, refetch } = useQuery(calendarQuery, { variables: { date: startDate }})

  useEffect(() => {

    var date = startDate
    date.setDate(1)
    const firstDay = date.getDay()
    setFirstDay((firstDay + calendarOffset - 1) % 7)
  }, [startDate])

  useEffect(() => {
    var days = []
    for (var i = 0; i < 7; i++) {
      days.push(dayNames[(i + calendarOffset) % 7])
    }
    setHeaderDays(days)
  }, [calendarOffset])

  useEffect(() => {
    if (data) {
      console.log(data)
      // Copy the data because changing it later with shift shuffled things along too much
      var calendarContent = data.calendar.days.slice()
      const emptyDay = { events: [] }
      calendarContent.unshift(...Array(firstDay).fill(emptyDay))

      const currentDaysCount = calendarContent.length
      const daysDiff = (7 - (currentDaysCount % 7))
      const daysToAdd = daysDiff == 7 ? 0 : daysDiff

      for (var i = 0; i < daysToAdd; i++) {
        calendarContent.push(emptyDay)
      }

      var chunkedContent = []

      for (var i = 0; i < calendarContent.length; i += 7) {
        chunkedContent.push(calendarContent.slice(i, i + 7))
      }

      setContent(chunkedContent)
    }
  }, [data])

  useEffect(() => {
    refetch()
  }, [startDate])

  const handlePreviousMonth = () => {
    var date = startDate
    setStartDate(new Date(date.setMonth(date.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    var date = startDate
    setStartDate(new Date(date.setMonth(date.getMonth() + 1)))
  }

  if (loading) return <RippleSpinner />

  return (
    <Container fluid>
      <Heading title={`Calendar - ${startDate.toLocaleString('default', { month: 'long' })} ${startDate.getFullYear()}`}>
        <Button as={Link} to='/ripple/events/new' className='mr-3'>New</Button>
        <ButtonGroup>
          <Button onClick={handlePreviousMonth}><FontAwesomeIcon icon='caret-left' /></Button>
          <Button onClick={() => setStartDate(new Date())}>Today</Button>
          <Button onClick={handleNextMonth}><FontAwesomeIcon icon='caret-right' /></Button>
        </ButtonGroup>
      </Heading>
      <Row className='d-none d-md-flex'>
      {/* <Row> */}
        { headerDays.map((day) => (
          <Col>{ day }</Col>
        ))}
      </Row>
      { content.map((week) => (
        <Row className='px-3'>
          { week.map((day) => (
            <Fragment>
              <Col sm={12} className='p-0 d-md-none'>
                <Card className={`bg-transparent h-100 border-0`}>
                  <Card.Body className='p-0'>
                    <p className='h2 text-muted'>{ day.date ? `|${(new Date(day.date)).getDate()}` : '' }</p>
                    { day.events.length == 0 ? '' : day.events.map((event) => {
                      if (event.description == '') {
                        return <Button block disabled variant='white' className='text-white'>spacer</Button>
                      } else {
                        return <Button block className='rounded-0' as={Link} to={`/ripple/event/${event.id}`} >{ event.description }</Button>
                      }
                    })}
                  </Card.Body>
                </Card>
              </Col>
              <Col className='p-0 d-none d-md-block'>
                <Card className={`bg-transparent h-100 border-left-0 border-right-0 border-bottom-0 rounded-0`}>
                  <Card.Body className='p-0'>
                    <p className='h2 text-muted'>{ day.date ? `|${(new Date(day.date)).getDate()}` : '' }</p>
                    { day.events.length == 0 ? '' : day.events.map((event) => {
                      if (event.description == '') {
                        return <Button block disabled variant='white' className='text-white'>spacer</Button>
                      } else {
                        return <Button block className='rounded-0' as={Link} to={`/ripple/event/${event.id}`} >{ event.description }</Button>
                      }
                    })}
                  </Card.Body>
                </Card>
              </Col>
            </Fragment>
          ))}
        </Row>
      ))}
    </Container>
  )
}

export default Calendar
