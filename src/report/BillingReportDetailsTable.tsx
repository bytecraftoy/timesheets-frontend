import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, getDay } from 'date-fns'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import { ProjectStub, EmployeeWithInputs, TimeInput } from '../common/types'
import { weekdays } from '../common/constants'
import { minutesToHoursAndMinutes } from '../services/dateAndTimeService'
import ReportTableTitle from './ReportTableTitle'

const useStyles = makeStyles((theme) => ({
  detailsTable: {
    maxWidth: theme.spacing(100),
    maxHeight: '80vh',
    overflowY: 'auto',
    marginTop: theme.spacing(2.5),
  },
  projectRow: {
    backgroundColor: indigo[100],
  },
  employeeRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const TableHeaderRow: React.FC = () => {
  const { t } = useTranslation()

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle1">{t('project.label')}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1">{t('employee.label')}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="subtitle1">{t('timeInput.label')}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const TimeInputRow: React.FC<{ timeInput: TimeInput }> = ({ timeInput }) => {
  const classes = useStyles()

  const formatDate = () => {
    const date = new Date(timeInput.date)
    const weekday = weekdays[getDay(date)]
    return `${weekday} ${format(date, 'd.M')}`
  }

  return (
    <TableRow className={classes.employeeRow}>
      <TableCell />
      <TableCell align="right">{formatDate()}</TableCell>
      <TableCell align="center">{minutesToHoursAndMinutes(timeInput.input)}</TableCell>
      <TableCell>{timeInput.description}</TableCell>
    </TableRow>
  )
}

const EmployeeRows: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  const classes = useStyles()

  return (
    <>
      <TableRow className={classes.employeeRow}>
        <TableCell />
        <TableCell colSpan={3}>
          <strong>
            {employee.firstName} {employee.lastName}
          </strong>
        </TableCell>
      </TableRow>
      {employee.timeInputs.map((timeInput) => (
        <TimeInputRow key={timeInput.id} timeInput={timeInput} />
      ))}
    </>
  )
}

const ProjectRows: React.FC<{ project: ProjectStub }> = ({ project }) => {
  const classes = useStyles()

  return (
    <>
      <TableRow className={classes.projectRow}>
        <TableCell colSpan={4}>
          <strong>{project.name}</strong>
        </TableCell>
      </TableRow>
      {project.employees.map((employee) => (
        <EmployeeRows key={employee.id} employee={employee} />
      ))}
    </>
  )
}

const BillingReportDetailsTable: React.FC<{ projects: ProjectStub[] }> = ({ projects }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  return (
    <>
      <TableContainer component={Paper} className={classes.detailsTable}>
        <Table size="small">
          <ReportTableTitle title={t('report.preview.details')} open={open} setOpen={setOpen} />
          {open && (
            <>
              <TableHeaderRow />
              <TableBody>
                {projects.map((project) => (
                  <ProjectRows key={project.id} project={project} />
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default BillingReportDetailsTable
