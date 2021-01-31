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
import { ProjectStub, EmployeeWithInputs } from '../common/types'
import { minutesToHoursAndMinutes } from './ReportService'
import ReportTableHead from './ReportTableHead'

const useStyles = makeStyles(() => ({
  summaryTable: {
    width: '40vw',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
}))

const CountTotalRow: React.FC<{ label: string; total: string }> = ({ label, total }) => {
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell align="right">{label}</TableCell>
      <TableCell align="right">{total}</TableCell>
    </TableRow>
  )
}

const EmployeeRow: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell>
        {employee.firstName} {employee.lastName}
      </TableCell>
      <TableCell align="right">{minutesToHoursAndMinutes(employee.employeeTotal)}</TableCell>
    </TableRow>
  )
}

const ProjectRows: React.FC<{ project: ProjectStub }> = ({ project }) => {
  const { t } = useTranslation()

  return (
    <>
      <TableRow>
        <TableCell colSpan={4}>
          <strong>{project.name}</strong>
        </TableCell>
      </TableRow>
      {project.employees.map((employee) => (
        <EmployeeRow key={employee.id} employee={employee} />
      ))}
      <CountTotalRow
        label={t('report.billing.preview.subTotal')}
        total={minutesToHoursAndMinutes(project.projectTotal)}
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

  return (
    <>
      <TableContainer component={Paper} className={classes.summaryTable}>
        <Table size="small">
          <ReportTableHead
            title={t('report.billing.preview.summary')}
            open={open}
            setOpen={setOpen}
          />
          {open && (
            <TableBody>
              {projects.map((project) => (
                <ProjectRows key={project.id} project={project} />
              ))}
              <CountTotalRow
                label={t('report.billing.preview.grandTotal')}
                total={minutesToHoursAndMinutes(grandTotal)}
              />
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default BillingReportSummaryTable
