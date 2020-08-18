import React from 'react'

import Card from 'react-bootstrap/Card'
import RowCard from './RowCard'

const Features = () => {
  return (
    <div>
      <RowCard span={8} offset={1} transparent icon='barcode' heading='Integrated asset manager'>
        <Card.Text>Keep track of all your equipment, where it's been, where it is, and where it's going next</Card.Text>
        <Card.Text>Automatically generate barcodes for every asset</Card.Text>
      </RowCard>
      <RowCard span={8} offset={3} transparent right icon='wrench' heading='Equipment maintenance tracker'>
        <Card.Text>File PAT reports, repairs, inspections and more against individual assets</Card.Text>
        <Card.Text>Get reminded of upcoming scheduled maintenance right on the dashboard</Card.Text>
      </RowCard>
      <RowCard span={8} offset={1} transparent icon='code' heading='Custom templated website'>
        <Card.Text>Utilise our platform to host a website that automatically updates as your hire inventory grows</Card.Text>
        <Card.Text>Customise every aspect with Mustache templates, tuning it to your brand</Card.Text>
      </RowCard>
      <RowCard span={8} offset={3} transparent right icon='clipboard-check' heading='Event planner'>
        <Card.Text>Keep on top of event resources, jobs, timetables and customer relations</Card.Text>
        <Card.Text>Allocate equipment, crew, transport and more</Card.Text>
      </RowCard>
      <RowCard span={8} offset={1} transparent icon='file-alt' heading='Document generator'>
        <Card.Text>Create clean invoices, quotes, maintenance reports, packing lists, event outlines, all from one system</Card.Text>
        <Card.Text>Customise the layout and design of every document to your needs</Card.Text>
      </RowCard>
    </div>
  )
}

export default Features
