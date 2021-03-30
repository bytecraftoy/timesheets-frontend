import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import { ProjectStub, EmployeeWithInputs } from '../../common/types'
import { minutesToHoursAndMinutes } from '../../services/dateAndTimeService'
import { getEmployeeFullName } from '../../services/employeeService'
import ReportTableTitle from '../ReportTableTitle'
import SummaryTableHeaderRow from '../SummaryTableHeaderRow'
import CountTotalRow from '../CountTotalRow'
import SummaryTotalRow from '../SummaryTotalRow'

import useStyles from '../styles'

const EmployeeRow: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  const classes = useStyles()

  return (
    <SummaryTotalRow
      label={getEmployeeFullName(employee)}
      total={employee.employeeTotal}
      className={classes.stripedRow}
    />
  )
}

const ProjectRows: React.FC<{ project: ProjectStub }> = ({ project }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const convertedProjectTotal = useMemo(() => minutesToHoursAndMinutes(project.projectTotal), [
    project,
  ])

  return (
    <>
      <TableRow className={classes.darkerRow}>
        <TableCell colSpan={4}>
          <strong>{project.name}</strong>
        </TableCell>
      </TableRow>
      {project.employees.map((employee) => (
        <EmployeeRow key={employee.id} employee={employee} />
      ))}
      <CountTotalRow
        className={classes.stripedRow}
        label={t('report.preview.projectSubTotal')}
        total={convertedProjectTotal}
      />
    </>
  )
}

const BillingReportSummaryTable: React.FC<{ projects: ProjectStub[]; grandTotal: number }> = ({
  projects,
  grandTotal,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  const convertedGrandTotal = useMemo(() => minutesToHoursAndMinutes(grandTotal), [grandTotal])

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <ReportTableTitle title={t('report.preview.summary')} open={open} setOpen={setOpen} />
          {open && (
            <>
              <SummaryTableHeaderRow
                leftLabel={t('project.label')}
                centerLabel={t('employee.label')}
              />
              <TableBody>
                {projects.map((project) => (
                  <ProjectRows key={project.id} project={project} />
                ))}
                <CountTotalRow
                  className={classes.darkerRow}
                  label={t('report.preview.grandTotal')}
                  total={convertedGrandTotal}
                />
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default BillingReportSummaryTable
