import React, { useMemo, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ClientWithProjectsAndInputs, ProjectWithInputsOfOneEmployee } from '../../common/types'
import { minutesToHoursAndMinutes } from '../../services/dateAndTimeService'
import ReportTableTitle from '../ReportTableTitle'
import SummaryTableHeaderRow from '../SummaryTableHeaderRow'
import CountTotalRow from '../CountTotalRow'
import SummaryTotalRow from '../SummaryTotalRow'

import useStyles from '../styles'

const ProjectRow: React.FC<{ project: ProjectWithInputsOfOneEmployee }> = ({ project }) => {
  const classes = useStyles()
  return (
    <SummaryTotalRow
      label={project.name}
      total={project.projectTotal}
      className={classes.stripedRow}
    />
  )
}

const ClientRows: React.FC<{ client: ClientWithProjectsAndInputs }> = ({ client }) => {
  const classes = useStyles()
  const { t } = useTranslation()

  const convertedClientTotal = useMemo(() => minutesToHoursAndMinutes(client.clientTotal), [client])

  return (
    <>
      <TableRow className={classes.darkerRow}>
        <TableCell colSpan={4}>
          <strong>{client.name}</strong>
        </TableCell>
      </TableRow>
      {client.projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
      <CountTotalRow
        className={classes.stripedRow}
        label={t('report.preview.clientSubTotal')}
        total={convertedClientTotal}
      />
    </>
  )
}

const SalaryReportSummaryTable: React.FC<{
  clients: ClientWithProjectsAndInputs[]
  grandTotal: number
}> = ({ clients, grandTotal }) => {
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
                leftLabel={t('client.label')}
                centerLabel={t('project.label')}
              />
              <TableBody>
                {clients.map((client) => (
                  <ClientRows key={client.id} client={client} />
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

export default SalaryReportSummaryTable
