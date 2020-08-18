import React, { useEffect, useState, useContext } from 'react'

import './App.scss'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks'
import introspectionQueryResultData from './unionSchema.json'

import { Provider as AlertProvider } from 'react-alert'

import { HelmetProvider } from 'react-helmet-async'

import { AppContext } from './state/AppContext'
import config from './RippleConfig'

import RippleNavbar from './components/RippleNavbar'
import PublicNavbar from './components/PublicNavbar'
import Footer from './components/Footer'

import Ripple from './components/pages/Ripple'
import Public from './components/pages/Public'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(fas)

const AlertTemplate = ({ style, options, message, close }) => {
  var dict = {
    info: 'info',
    success: 'success',
    error: 'danger',
    warning: 'warning'
  }
  return (
    <div style={ { ...style, display: 'flex', justifyContent: 'space-between' } } className={` p-3 text-light bg-${dict[options.type]} border rounded`}>
      <p className='mb-0'>
        { options.type === 'info' && <FontAwesomeIcon icon='info-circle' /> }
        { options.type === 'success' && <FontAwesomeIcon icon='check-circle' /> }
        { options.type === 'error' && <FontAwesomeIcon icon='times-circle' /> }
        { options.type === 'warning' && <FontAwesomeIcon icon='info-circle' /> }
      </p>
      <p className='mb-0 px-3'>
        { message }
      </p>
      <button style={ { border: 'none', backgroundColor: 'transparent', color: 'white' } } onClick={ close }><FontAwesomeIcon icon='times' /></button>
    </div>
  )
}

const App = () => {
  const { loggedIn, rawToken } = useContext(AppContext)

  const httpLink = createHttpLink({
    uri: `${config.api_host}/graphql`,
  })

  const authLink = setContext((_, { headers }) => {
    if (rawToken !== '') {
      return {
        headers: {
          ...headers,
          'Authorization': `Bearer ${rawToken}`
        }
      }
    } else {
      return headers
    }
  })

  const fragmentMatcher = new IntrospectionFragmentMatcher({introspectionQueryResultData})

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({fragmentMatcher})
  })

  const alertOptions = {
    timeout: 4000,
    offset: '30px'
  }

  const [navbar, setNavbar] = useState('')

  useEffect(() => {
    if (loggedIn) {
      if (window.location.pathname.includes('/ripple')) {
        setNavbar(<RippleNavbar />)
      } else {
        setNavbar(<PublicNavbar />)
      }
    } else {
      setNavbar(<PublicNavbar />)
    }
  }, [loggedIn])

  return (
    <HelmetProvider>
      <ApolloProvider client={client}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <BrowserRouter>
            { navbar }
            <main role='main' className='flex-shrink-0'>
              <Switch>
                <Route path='/ripple' component={Ripple} />
                <Route component={Public} />
              </Switch>
            </main>
            <Footer />
          </BrowserRouter>
        </AlertProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

export default App
