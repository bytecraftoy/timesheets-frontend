import React, { useState, useEffect } from 'react'
import { Switch, Route, Link, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Project } from '../common/types'
import ProjectInfo from './ProjectInfo'
import ProjectForm from './ProjectForm'

const ProjectsTable: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  let backend = process.env.REACT_APP_BACKEND_URL
  if (backend != null) {
    backend += '/projects'
  }

  useEffect(() => {
    axios.get(backend || 'http://localhost:9000/projects').then((response) => {
      setProjects(response.data)
      setLoading(false)
    })
  })

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Project name</TableCell>
            <TableCell align="right">Client</TableCell>
            <TableCell align="center">Owner</TableCell>
            <TableCell align="center">Tags</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project: Project) => (
            <ProjectInfo key={project.id} project={project} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const ProjectsView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()

  return (
    <div>
      <Typography variant="h2">{t('projectsTitle')}</Typography>
      <Switch>
        <Route exact path={path}>
          <Button variant="outlined" color="primary" component={Link} to={`${url}/new-project`}>
            Add project
          </Button>
          <ProjectsTable />
        </Route>
        <Route path={`${path}/new-project`}>
          <ProjectForm />
        </Route>
      </Switch>
    </div>
  )
}

export default ProjectsView
