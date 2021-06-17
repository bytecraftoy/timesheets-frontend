import React, { useState } from 'react'
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography } from '@material-ui/core'
import ClientForm from './ClientForm'
import { useUserContext } from '../context/UserContext'
import FormSwitch from '../form/FormSwitch'
import ClientsTable from './ClientsTable'

const ClientsView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { user } = useUserContext()

  const [showAllClients, setShowAllClients] = useState(false)

  const handleShowAllClients = () => {
    setShowAllClients(!showAllClients)
  }

  return (
    <div>
      <Typography variant="h2" data-cy="clients-title">
        {t('client.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
          {user.isManager && (
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  data-cy="add-client-button"
                  component={Link}
                  to={`${url}/new-client`}
                >
                  {t('client.addClient')}
                </Button>
              </Grid>
              <Grid item>
                <FormSwitch
                  name="show-all-clients"
                  checked={showAllClients}
                  handleChange={handleShowAllClients}
                  ariaLabel="show-all-clients"
                  label={t('client.showAll')}
                />
              </Grid>
            </Grid>
          )}
          <ClientsTable showAllClients={showAllClients} />
        </Route>
        <Route path={`${path}/new-client`}>
          {!user.isManager ? <Redirect to={path} /> : <ClientForm />}
        </Route>
      </Switch>
    </div>
  )
}

export default ClientsView
