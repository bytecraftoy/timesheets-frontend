import React from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography } from '@material-ui/core'
import ClientForm from './ClientForm'
import ClientsTable from './ClientsTable'

const ClientsView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <div>
      <Typography variant="h2" data-cy="clients-title">
        {t('client.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
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
          </Grid>
          <ClientsTable />
        </Route>
        <Route path={`${path}/new-client`}>
          <ClientForm />
        </Route>
      </Switch>
    </div>
  )
}

export default ClientsView
