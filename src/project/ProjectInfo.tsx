import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import { Project } from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'

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

const ProjectInfo: React.FC<{ project: Project }> = ({ project }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const created = new Date(project.creationTimestamp).toString()
  const edited = new Date(project.lastEdited).toString()

  const projectOwner: string = project.owner.firstName.charAt(0) + project.owner.lastName.charAt(0)

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {project.name}
        </TableCell>
        <TableCell align="right">{project.client.name}</TableCell>
        <TableCell align="center">
          <Avatar style={{ margin: 'auto' }}>{projectOwner}</Avatar>
        </TableCell>
        <TableCell align="right">
          <EditIcon />
          <DeleteOutlinedIcon />
        </TableCell>
      </TableRow>
      {/* Collapsible part */}
      <TableRow>
        <TableCell className={classes.padding} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Project Details
              </Typography>
              <p>Description: {project.description}</p>
              <p>Employees:</p>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Time</TableCell>
                    <TableCell>By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Created</TableCell>
                    <TableCell>{created}</TableCell>
                    <TableCell>{getEmployeeFullName(project.creator)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last modified</TableCell>
                    <TableCell>{edited}</TableCell>
                    <TableCell>{getEmployeeFullName(project.lastEditor)}</TableCell>
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

export default ProjectInfo
