import React, { useEffect, useContext, Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'

import { AppContext } from '../../state/AppContext'

import Home from './public/Home'
import Features from './public/Features'
import Pricing from './public/Pricing'
import ContactUs from './public/ContactUs'
import Faqs from './public/Faqs'
import Support from './public/Support'
import NotFound from './NotFound'

const Public = () => {
  const { setSsoRequired } = useContext(AppContext)

  useEffect(() => {
    setSsoRequired(false)
  }, [setSsoRequired])

  return (
    <Fragment>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/home' component={Home} />
        <Route exact path='/features' component={Features} />
        <Route exact path='/pricing' component={Pricing} />
        <Route exact path='/contact-us' component={ContactUs} />
        <Route exact path='/faqs' component={Faqs} />
        <Route exact path='/support' component={Support} />
        <Route component={NotFound} />
      </Switch>
    </Fragment>
  )
}

export default Public
