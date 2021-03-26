import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Employee, Project } from '../common/types'
import ProjectInfo from './ProjectInfo'
import { getAllProjects, getProjectsByEmployeeId } from '../services/projectService'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'
import { useUserContext } from '../context/UserContext'
import { getAllEmployees } from '../services/employeeService'

const ProjectsTableHead: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useUserContext()

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>{t('project.projectName')}</TableCell>
        <TableCell align="right">{t('client.label')}</TableCell>
        <TableCell align="center">{t('owner.label')}</TableCell>
        {user.isManager && <TableCell align="right">{t('project.actions')}</TableCell>}
      </TableRow>
    </TableHead>
  )
}

const ProjectsTableBody: React.FC<{ projects: Project[]; employees: Employee[] }> = ({
  projects,
  employees,
}) => {
  return (
    <TableBody data-cy="projects-table">
      {projects.map((project: Project) => (
        <ProjectInfo key={project.id} project={project} employees={employees} />
      ))}
    </TableBody>
  )
}

const ProjectsTable: React.FC<{ showAllProjects: boolean }> = ({ showAllProjects }) => {
  const [isLoading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const { user } = useUserContext()

  const fetchAllProjectsAndEmployees = useCallback(async () => {
    setAllProjects(await getAllProjects())
    setProjects(await getProjectsByEmployeeId(user.id))
    setEmployees(await getAllEmployees())
  }, [user])

  const fetchOnlyEmployeesProjects = useCallback(async () => {
    setProjects(await getProjectsByEmployeeId(user.id))
    setAllProjects([])
    setEmployees([])
  }, [user])

  useAPIErrorHandlerWithFinally(
    user.isManager ? fetchAllProjectsAndEmployees : fetchOnlyEmployeesProjects,
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
        {user.isManager && showAllProjects && (
          <ProjectsTableBody projects={allProjects} employees={employees} />
        )}
        {(!user.isManager || !showAllProjects) && (
          <ProjectsTableBody projects={projects} employees={employees} />
        )}
      </Table>
    </TableContainer>
  )
}

export default ProjectsTable
