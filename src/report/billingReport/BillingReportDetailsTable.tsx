import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import { ProjectStub, EmployeeWithInputs } from '../../common/types'
import ReportTableTitle from '../ReportTableTitle'
import DetailsTableHeaderRow from '../DetailsTableHeaderRow'
import TimeInputRow from '../TimeInputRow'
import NoHoursRow from '../NoHoursRow'

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
      {employee.timeInputs.length === 0 && <NoHoursRow numberOfIndent={2} />}
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
      {project.employees.length === 0 && <NoHoursRow numberOfIndent={1} />}
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
              <DetailsTableHeaderRow
                leftLabel={t('project.label')}
                centerLabel={t('employee.label')}
              />
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