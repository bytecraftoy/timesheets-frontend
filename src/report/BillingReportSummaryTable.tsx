import React from 'react'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core'
import { ProjectStub, EmployeeWithInputs } from '../common/types'
import { minutesToHoursAndMinutes } from './ReportService'

const useStyles = makeStyles(() => ({
  summaryTable: {
    width: '30vw',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
}))

const GrandTotalRow: React.FC<{ grandTotal: string }> = ({ grandTotal }) => {
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell align="right">GRAND total</TableCell>
      <TableCell align="right">{grandTotal}</TableCell>
    </TableRow>
  )
}

const SubTotalRow: React.FC<{ subTotal: string }> = ({ subTotal }) => {
  return (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell align="right">Project subtotal</TableCell>
      <TableCell align="right">{subTotal}</TableCell>
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
      <SubTotalRow subTotal={minutesToHoursAndMinutes(project.projectTotal)} />
    </>
  )
}

const BillingReportSummaryTable: React.FC<{ projects: ProjectStub[]; grandTotal: number }> = ({
  projects,
  grandTotal,
}) => {
  const classes = useStyles()

  return (
    <>
      <Typography variant="h6">Summary</Typography>
      <TableContainer component={Paper} className={classes.summaryTable}>
        <Table size="small">
          <TableBody>
            {projects.map((project) => (
              <ProjectRows key={project.id} project={project} />
            ))}
            <GrandTotalRow grandTotal={minutesToHoursAndMinutes(grandTotal)} />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BillingReportSummaryTable
