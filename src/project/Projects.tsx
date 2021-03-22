import React, { useState, useCallback } from 'react'
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom'
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
import { Employee, Project } from '../common/types'
import ProjectInfo from './ProjectInfo'
import ProjectForm from './ProjectForm'
import { getAllProjects } from '../services/projectService'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'
import { useUserContext } from '../context/UserContext'
import { getAllEmployees } from '../services/employeeService'

const ProjectsTableHead: React.FC = () => {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>Project name</TableCell>
        <TableCell align="right">Client</TableCell>
        <TableCell align="center">Owner</TableCell>
        <TableCell align="right">Actions</TableCell>
      </TableRow>
    </TableHead>
  )
}

const ProjectsTable: React.FC = () => {
  const [isLoading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const fetchProjects = useCallback(async () => {
    const projectPromise = getAllProjects()
    setEmployees(await getAllEmployees())
    setProjects(await projectPromise)
  }, [])

  useAPIErrorHandlerWithFinally(
    fetchProjects,
    useCallback(() => setLoading(false), [])
  )

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
        <ProjectsTableHead />
        <TableBody data-cy="projects-table">
          {projects.map((project: Project) => (
            <ProjectInfo key={project.id} project={project} employees={employees} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const ProjectsView: React.FC = () => {
  const { path, url } = useRouteMatch()
  const { t } = useTranslation()
  const { user } = useUserContext()

  return (
    <div>
      <Typography variant="h2" data-cy="projects-title">
        {t('project.title')}
      </Typography>
      <Switch>
        <Route exact path={path}>
          {user.isManager && (
            <Button
              variant="outlined"
              color="primary"
              data-cy="add-project-button"
              component={Link}
              to={`${url}/new-project`}
            >
              {t('project.addProject')}
            </Button>
          )}
          <ProjectsTable />
        </Route>
        <Route path={`${path}/new-project`}>
          {!user.isManager ? <Redirect to={path} /> : <ProjectForm />}
        </Route>
      </Switch>
    </div>
  )
}

export default ProjectsView
