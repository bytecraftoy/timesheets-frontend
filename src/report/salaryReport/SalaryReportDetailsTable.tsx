import React, { useState } from 'react'
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { indigo } from '@material-ui/core/colors'
import { ClientWithProjectsAndInputs, ProjectWithInputsOfOneEmployee } from '../../common/types'
import ReportTableTitle from '../ReportTableTitle'
import DetailsTableHeaderRow from '../DetailsTableHeaderRow'
import TimeInputRow from '../TimeInputRow'

const useStyles = makeStyles((theme) => ({
  detailsTable: {
    maxWidth: theme.spacing(100),
    maxHeight: '80vh',
    overflowY: 'auto',
    marginTop: theme.spacing(2.5),
  },
  clientRow: {
    backgroundColor: indigo[100],
  },
  projectRow: {
    '&:nth-of-type(odd)': {
      backgroundColor: indigo[50],
    },
  },
}))

const ProjectRows: React.FC<{ project: ProjectWithInputsOfOneEmployee }> = ({ project }) => {
  const classes = useStyles()

  return (
    <>
      <TableRow className={classes.projectRow}>
        <TableCell />
        <TableCell colSpan={3}>
          <strong>{project.name}</strong>
        </TableCell>
      </TableRow>
      {project.timeInputs.map((timeInput) => (
        <TimeInputRow key={timeInput.id} timeInput={timeInput} />
      ))}
    </>
  )
}

const ClientRows: React.FC<{ client: ClientWithProjectsAndInputs }> = ({ client }) => {
  const classes = useStyles()

  return (
    <>
      <TableRow className={classes.clientRow}>
        <TableCell colSpan={4}>
          <strong>{client.name}</strong>
        </TableCell>
      </TableRow>
      {client.projects.map((project) => (
        <ProjectRows key={project.id} project={project} />
      ))}
    </>
  )
}

const SalaryReportDetailsTable: React.FC<{
  clients: ClientWithProjectsAndInputs[]
}> = ({ clients }) => {
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
                leftLabel={t('client.label')}
                centerLabel={t('project.label')}
              />
              <TableBody>
                {clients.map((client) => (
                  <ClientRows key={client.id} client={client} />
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </TableContainer>
    </>
  )
}

export default SalaryReportDetailsTable
