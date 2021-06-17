import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'
import { Client } from '../common/types'
import { useUserContext } from '../context/UserContext'
import { getAllClients, getClientsByEmployeeId } from '../services/clientService'
import ClientInfo from './ClientInfo'

const ClientsTableHead: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useUserContext()

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        <TableCell>{t('client.clientName')}</TableCell>
        <TableCell align="right">Contact</TableCell>
        {user.isManager && <TableCell align="right">{t('project.actions')}</TableCell>}
      </TableRow>
    </TableHead>
  )
}

const ClientsTableBody: React.FC<{ clients: Client[] }> = ({ clients }) => {
  return (
    <TableBody data-cy="clients-table">
      {clients.map((client: Client) => (
        <ClientInfo key={client.id} client={client} />
      ))}
    </TableBody>
  )
}

const ClientsTable: React.FC<{ showAllClients: boolean }> = ({ showAllClients }) => {
  const [isLoading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [allClients, setAllClients] = useState<Client[]>([])
  const { user } = useUserContext()

  const fetchAllClients = useCallback(async () => {
    setAllClients(await getAllClients())
    setClients(await getClientsByEmployeeId(user.id))
  }, [user])

  const fetchOnlyEmployeesClients = useCallback(async () => {
    setClients(await getClientsByEmployeeId(user.id))
    setAllClients([])
  }, [user])

  useAPIErrorHandlerWithFinally(
    user.isManager ? fetchAllClients : fetchOnlyEmployeesClients,
    useCallback(() => setLoading(false), [])
  )

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <ClientsTableHead />
        {user.isManager && showAllClients && <ClientsTableBody clients={allClients} />}
        {(!user.isManager || !showAllClients) && <ClientsTableBody clients={clients} />}
      </Table>
    </TableContainer>
  )
}

export default ClientsTable
