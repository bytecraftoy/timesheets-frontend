import React, { useMemo, useState, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Collapse,
  TableRow,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
} from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { useTranslation } from 'react-i18next'
import { Client, Project } from '../common/types'
import { useUserContext } from '../context/UserContext'
import { getProjectsByClientId } from '../services/projectService'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'

const useStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  padding: {
    paddingBottom: 0,
    paddingTop: 0,
  },
})

const ClientInfo: React.FC<{ client: Client }> = ({ client }) => {
  const [isLoading, setLoading] = useState(true)
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjectsOfClient = useCallback(async () => {
    setProjects(await getProjectsByClientId(client.id))
  }, [client])

  useAPIErrorHandlerWithFinally(
    fetchProjectsOfClient,
    useCallback(() => setLoading(false), [])
  )

  const clientProjects: string = useMemo(() => projects.map((project) => project.name).join(', '), [
    projects,
  ])

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <>
      <TableRow className={classes.root}>
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
        <TableCell component="th" scope="row">
          <p>{client.name}</p>
        </TableCell>
        <TableCell align="right">
          <p>{client.email}</p>
        </TableCell>
        {user.isManager && (
          <TableCell align="right">
            <IconButton color="inherit" size="small" aria-label="edit-project" disabled>
              <EditIcon />
            </IconButton>
            <IconButton color="inherit" size="small" aria-label="delete-project" disabled>
              <DeleteOutlinedIcon />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {/* Collapsible part */}
      <TableRow>
        <TableCell className={classes.padding} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h5" gutterBottom component="div">
                {t('client.details')}
              </Typography>
              <Typography variant="h6">{t('project.labelPlural')}</Typography>
              <Typography variant="body1">{clientProjects}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>{t('client.time')}</TableCell>
                    <TableCell>{t('client.createdBy')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('client.created')}</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('project.modified')}</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default ClientInfo
