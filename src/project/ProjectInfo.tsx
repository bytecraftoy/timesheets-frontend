import React, { useMemo, useReducer, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { useTranslation } from 'react-i18next'
import { Employee, Project } from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'
import EditEmployeesDialog from './EditEmployeesDialog'

const useStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  padding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
})

const ProjectInfo: React.FC<{ project: Project; employees: Employee[] }> = ({
  project,
  employees,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const created = useMemo(() => new Date(project.creationTimestamp).toString(), [
    project.creationTimestamp,
  ])
  const edited = useMemo(() => new Date(project.lastEdited).toString(), [project.lastEdited])

  const projectOwner = project.owner.firstName.charAt(0) + project.owner.lastName.charAt(0)

  const [editDialogOpen, toggleEditDialogOpen] = useReducer((value) => !value, false)

  const projectEmployees: string = useMemo(
    () => project.employees.map((employee) => getEmployeeFullName(employee)).join(', '),
    [project.employees]
  )

  return (
    <>
      <EditEmployeesDialog
        project={project}
        employees={employees}
        open={editDialogOpen}
        toggleOpen={toggleEditDialogOpen}
      />
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {project.name}
        </TableCell>
        <TableCell align="right">{project.client.name}</TableCell>
        <TableCell align="center">
          <Avatar style={{ margin: 'auto' }}>{projectOwner}</Avatar>
        </TableCell>
        <TableCell align="right">
          <EditIcon />
          <DeleteOutlinedIcon />
        </TableCell>
      </TableRow>
      {/* Collapsible part */}
      <TableRow>
        <TableCell className={classes.padding} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                {t('project.details')}
              </Typography>
              <Typography variant="body1">
                {t('project.description.label')}: {project.description}
              </Typography>
              <Typography variant="h6">
                {t('employee.labelPlural')}
                <IconButton color="inherit" size="small" onClick={toggleEditDialogOpen}>
                  <EditIcon />
                </IconButton>
              </Typography>
              <Typography variant="body1">{projectEmployees}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>{t('project.time')}</TableCell>
                    <TableCell>{t('project.createdBy')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('project.created')}</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{getEmployeeFullName(project.creator)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('project.modified')}</TableCell>
                    <TableCell>{edited}</TableCell>
                    <TableCell>{getEmployeeFullName(project.lastEditor)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default ProjectInfo
