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
  TableRow,
} from '@material-ui/core'
import { ProjectStub, EmployeeWithInputs, TimeInput } from '../common/types'
import weekdays from '../common/constants'
import { minutesToHoursAndMinutes } from './ReportService'
import ReportTableHead from './ReportTableHead'

const useStyles = makeStyles(() => ({
  detailsTable: {
    width: '50vw',
    maxHeight: '80vh',
    overflowY: 'auto',
    marginTop: '20px',
  },
}))

const TimeInputRow: React.FC<{ timeInput: TimeInput }> = ({ timeInput }) => {
  const formatDate = () => {
    const date = new Date(timeInput.date)
    const weekday = weekdays[getDay(date)]
    return `${weekday} ${format(date, 'd.M')}`
  }

  return (
    <TableRow>
      <TableCell />
      <TableCell align="right">{formatDate()}</TableCell>
      <TableCell align="center">{minutesToHoursAndMinutes(timeInput.input)}</TableCell>
      <TableCell>{timeInput.description}</TableCell>
    </TableRow>
  )
}

const EmployeeRows: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  return (
    <>
      <TableRow>
        <TableCell />
        <TableCell colSpan={3}>
          {employee.firstName} {employee.lastName}
        </TableCell>
      </TableRow>
      {employee.timeInputs.map((timeInput) => (
        <TimeInputRow key={timeInput.id} timeInput={timeInput} />
      ))}
    </>
  )
}

const ProjectRows: React.FC<{ project: ProjectStub }> = ({ project }) => {
  return (
    <>
      <TableRow>
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
          <ReportTableHead
            title={t('report.billing.preview.details')}
            open={open}
            setOpen={setOpen}
          />
          {open && (
            <TableBody>
              {projects.map((project) => (
                <ProjectRows key={project.id} project={project} />
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default BillingReportDetailsTable
