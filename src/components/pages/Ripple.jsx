import React, { useEffect, useContext, useState } from 'react'
import { Switch, Route } from 'react-router-dom'

import { AppContext } from '../../state/AppContext'

import NotFound from './NotFound'
import Dashboard from './ripple/dashboard/Dashboard'
import Settings from './ripple/Settings'
import TemplatesEdit from './ripple/document_types/Edit'
import TemplatesCreate from './ripple/document_types/Create'
import AssetTypes from './ripple/asset_types/Index'
import AssetTypesCreate from './ripple/asset_types/Create'
import AssetTypeEdit from './ripple/asset_types/Edit'
import Assets from './ripple/assets/Index'
import AssetEdit from './ripple/assets/Edit'
import AssetsCreate from './ripple/assets/Create'
import MaintenanceEventCreate from './ripple/maintenance_events/Create'
import Cases from './ripple/cases/Index'
import CaseShow from './ripple/cases/Show'
import CreateDocument from './ripple/documents/Create'
import Events from './ripple/events/Index'
import EventsCreate from './ripple/events/Create'
import EventEdit from './ripple/events/Edit'
import EventsCalendar from './ripple/events/Calendar'
import Clients from './ripple/clients/Index'
import ClientsCreate from './ripple/clients/Create'
import ClientEdit from './ripple/clients/Edit'
import Unauthorized from './ripple/Unauthorized'
import { useQuery } from '@apollo/react-hooks'
import { loader } from 'graphql.macro'

const settingsQuery = loader('./settings.gql')

const Ripple = () => {
  const { setSsoRequired, setGlobalSettings } = useContext(AppContext)

  const { data } = useQuery(settingsQuery)

  const [loadedSettings, setLoadedSettings] = useState(false)

  useEffect(() => {
    if (data && !loadedSettings) {
      setGlobalSettings(data.settings)
      setLoadedSettings(true)
    }
  }, [data, loadedSettings])

  useEffect(() => {
    setSsoRequired(true)
  }, [setSsoRequired])

  return (
    <Switch>
      <Route exact key='/ripple' path={'/ripple'} component={Dashboard} />
      <Route exact key='/ripple/settings' path={'/ripple/settings'} component={Settings} />

      <Route exact key='/ripple/document-types/new' path={'/ripple/document-types/new'} component={TemplatesCreate} />
      <Route exact key='/ripple/document-type/:id' path={'/ripple/document-type/:id'} component={TemplatesEdit} />
      <Route exact key='/ripple/documents/:documentTypeId/new/:subjectId' path={'/ripple/documents/:documentTypeId/new/:subjectId'} component={CreateDocument} />

      <Route exact key='/ripple/asset-types' path={`/ripple/asset-types`} component={AssetTypes} />
      <Route exact key='/ripple/asset-types/new' path={`/ripple/asset-types/new`} component={AssetTypesCreate} />
      <Route exact key='/ripple/asset-type/:id' path={`/ripple/asset-type/:id`} component={AssetTypeEdit} />

      <Route exact key='/ripple/assets' path={`/ripple/assets`} component={Assets} />
      <Route exact key='/ripple/assets/new' path={`/ripple/assets/new`} component={AssetsCreate} />
      <Route exact key='/ripple/asset/:id' path={`/ripple/asset/:id`} component={AssetEdit} />
      <Route exact key='/ripple/asset/:assetId/maintenance/new/:scheduleId' path={`/ripple/asset/:assetId/maintenance/new/:scheduleId`} component={MaintenanceEventCreate} />

      <Route exact key='/ripple/cases' path={'/ripple/cases'} component={Cases} />
      <Route exact key='/ripple/case/:id' path={'/ripple/case/:id'} component={CaseShow} />

      <Route exact key='/ripple/events' path={`/ripple/events`} component={Events} />
      <Route exact key='/ripple/events/new' path={`/ripple/events/new`} component={EventsCreate} />
      <Route exact key='/ripple/events/calendar' path={`/ripple/events/calendar`} component={EventsCalendar} />
      <Route exact key='/ripple/event/:id' path={`/ripple/event/:id`} component={EventEdit} />

      <Route exact key='/ripple/clients' path={`/ripple/clients`} component={Clients} />
      <Route exact key='/ripple/clients/new' path={`/ripple/clients/new`} component={ClientsCreate} />
      <Route exact key='/ripple/client/:id' path={`/ripple/client/:id`} component={ClientEdit} />

      <Route exact key='/ripple/unauthorized' path={'/ripple/unauthorized'} component={Unauthorized} />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Ripple
