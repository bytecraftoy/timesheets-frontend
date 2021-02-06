import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { ProjectStub, EmployeeWithInputs } from '../common/types'
import { minutesToHoursAndMinutes } from '../services/dateAndTimeService'
import ReportTableTitle from './ReportTableTitle'

const useStyles = makeStyles((theme) => ({
  summaryTable: {
    maxWidth: theme.spacing(75),
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  projectRow: {
    backgroundColor: indigo[100],
  },
  employeeRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
  grandTotalRow: {
    backgroundColor: indigo[100],
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
        <TableCell />
        <TableCell align="right">
          <Typography variant="subtitle1">{t('timeInput.time.label')}</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

const EmployeeRow: React.FC<{ employee: EmployeeWithInputs }> = ({ employee }) => {
  const classes = useStyles()
  return (
    <TableRow className={classes.employeeRow}>
      <TableCell />
      <TableCell colSpan={2}>
        {employee.firstName} {employee.lastName}
      </TableCell>
      <TableCell align="right">{minutesToHoursAndMinutes(employee.employeeTotal)}</TableCell>
    </TableRow>
  )
}

const CountTotalRow: React.FC<{ className?: string; label: string; total: string }> = ({
  className,
  label,
  total,
}) => {
  return (
    <TableRow className={className}>
      <TableCell colSpan={2} />
      <TableCell align="right">
        <strong>{label}</strong>
      </TableCell>
      <TableCell align="right">
        <strong>{total}</strong>
      </TableCell>
    </TableRow>
  )
}

const ProjectRows: React.FC<{ project: ProjectStub }> = ({ project }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  return (
    <>
      <TableRow className={classes.projectRow}>
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
          <ReportTableTitle
            title={t('report.billing.preview.summary')}
            open={open}
            setOpen={setOpen}
          />
          {open && (
            <>
              <TableHeaderRow />
              <TableBody>
                {projects.map((project) => (
                  <ProjectRows key={project.id} project={project} />
                ))}
                <CountTotalRow
                  className={classes.grandTotalRow}
                  label={t('report.billing.preview.grandTotal')}
                  total={minutesToHoursAndMinutes(grandTotal)}
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
