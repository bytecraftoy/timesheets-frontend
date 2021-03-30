import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import { ProjectStub, EmployeeWithInputs } from '../../common/types'
import ReportTableTitle from '../ReportTableTitle'
import DetailsTableHeaderRow from '../DetailsTableHeaderRow'
import TimeInputRow from '../TimeInputRow'
import NoHoursRow from '../NoHoursRow'
import { getEmployeeFullName } from '../../services/employeeService'

import useStyles from '../styles'

const EmployeeRows: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  const classes = useStyles()

  return (
    <>
      <TableRow className={classes.stripedRow}>
        <TableCell />
        <TableCell align="center">
          <strong>{getEmployeeFullName(employee)}</strong>
        </TableCell>
        <TableCell colSpan={2} />
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
      <TableRow className={classes.darkerRow}>
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
