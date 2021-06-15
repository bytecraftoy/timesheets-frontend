import React, { useState } from 'react'
import { TableRow, TableCell, IconButton } from '@material-ui/core'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Client } from '../common/types'
import { useUserContext } from '../context/UserContext'

const ClientInfo: React.FC<{ client: Client }> = ({ client }) => {
  const [open, setOpen] = useState(false)
  const { user } = useUserContext()

  return (
    <TableRow>
      <TableCell>
        <IconButton
          data-cy="expand-client-row"
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell>
        <p>{client.name}</p>
      </TableCell>
      <TableCell align="right">
        <p>{client.email}</p>
      </TableCell>
      {user.isManager && <TableCell />}
    </TableRow>
  )
}

export default ClientInfo
