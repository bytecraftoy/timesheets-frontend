import React, { useState } from 'react'
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography } from '@material-ui/core'
import ProjectForm from './ProjectForm'
import { useUserContext } from '../context/UserContext'
import FormSwitch from '../form/FormSwitch'
import ProjectsTable from './ProjectsTable'

const ProjectsView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { user } = useUserContext()

  const [showAllProjects, setShowAllProjects] = useState(false)

  const handleShowAllProjects = () => {
    setShowAllProjects(!showAllProjects)
  }

  return (
    <div>
      <Typography variant="h2" data-cy="projects-title">
        {t('project.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
          {user.isManager && (
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  data-cy="add-project-button"
                  component={Link}
                  to={`${url}/new-project`}
                >
                  {t('project.addProject')}
                </Button>
              </Grid>
              <Grid item>
                <FormSwitch
                  name="show-all-projects"
                  checked={showAllProjects}
                  handleChange={handleShowAllProjects}
                  ariaLabel="show-all-projects"
                  label={t('project.showAll')}
                />
              </Grid>
            </Grid>
          )}
          <ProjectsTable showAllProjects={showAllProjects} />
        </Route>
        <Route path={`${path}/new-project`}>
          {!user.isManager ? <Redirect to={path} /> : <ProjectForm />}
        </Route>
      </Switch>
    </div>
  )
}

export default ProjectsView
