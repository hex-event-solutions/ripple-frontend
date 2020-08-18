import React, { createContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/LocalStorageHook'
import Keycloak from 'keycloak-js'

import config from '../RippleConfig'

export const AppContext = createContext({})

const initialState = {
  loggedIn: false,
  companies: [],
  token: {},
  rawToken: '',
  username: '',
  name: '',
  email: '',
  groups: [],
  logoutUrl: '',
  loginUrl: '',
  accountUrl: ''
}

export const AppProvider = props => {
  const { children } = props

  const [loggedIn, setLoggedIn] = useLocalStorage('ripple.loggedIn', initialState.loggedIn)
  const [companies, setCompanies] = useLocalStorage('ripple.companies', initialState.companies)

  const [token, setToken] = useLocalStorage('ripple.token', initialState.token)
  const [rawToken, setRawToken] = useLocalStorage('ripple.rawToken', initialState.rawToken)
  const [username, setUsername] = useLocalStorage('ripple.username', initialState.username)
  const [name, setName] = useLocalStorage('ripple.name', initialState.name)
  const [email, setEmail] = useLocalStorage('ripple.email', initialState.email)
  const [groups, setGroups] = useLocalStorage('ripple.groups', initialState.groups)
  const [loginUrl, setLoginUrl] = useLocalStorage('ripple.loginUrl', initialState.loginUrl)
  const [logoutUrl, setLogoutUrl] = useLocalStorage('ripple.logoutUrl', initialState.logoutUrl)
  const [accountUrl, setAccountUrl] = useLocalStorage('ripple.accountUrl', initialState.accountUrl)
  const [ssoRequired, setSsoRequired] = useLocalStorage('ripple.ssoRequired', false)

  const keycloak = Keycloak(`/keycloak_${config.environment}.json`)

  keycloak.onTokenExpired = () => {
    console.log('SSO token has expired')
    keycloak.updateToken(30).success(() => {
      setRawToken(keycloak.token)
      console.log('Successfully refreshed SSO token')
    })
  }


  useEffect(() => {
    keycloak.init({onLoad: (ssoRequired ? 'login-required' : 'check-sso')}).then(authenticated => {
      if (authenticated) {
        login(keycloak)
      } else {
        logout()
        setLoginUrl(keycloak.createLoginUrl())
      }
    })
  }, [ssoRequired])

  const login = keycloak => {
    setRawToken(keycloak.token)
    const token = keycloak.tokenParsed
    setToken(token)
    setUsername(token.preferred_username)
    setName(token.name)
    setEmail(token.email)
    setGroups(token.groups)
    setCompanies(token.companies)
    setLogoutUrl(keycloak.createLogoutUrl({redirectUri: config.self_host}))
    setAccountUrl(keycloak.createAccountUrl())
    setLoggedIn(true)
  }

  const logout = () => {
    setRawToken(initialState.rawToken)
    setToken(initialState.token)
    setUsername(initialState.username)
    setName(initialState.name)
    setEmail(initialState.email)
    setGroups(initialState.groups)
    setCompanies(initialState.companies)
    setLogoutUrl(initialState.logoutUrl)
    setAccountUrl(initialState.accountUrl)
    setLoggedIn(false)
  }

  const appContext = {
    loggedIn,
    companies,
    token,
    rawToken,
    username,
    name,
    email,
    groups,
    loginUrl,
    logoutUrl,
    accountUrl,
    keycloak,
    setSsoRequired,
    login, logout
  }

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
}

export const { AppConsumer } = AppContext;
