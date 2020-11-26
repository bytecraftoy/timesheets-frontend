import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import { Project } from '../common/types'

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

const Tags: React.FC<{ tags: string[] | undefined }> = ({ tags }) => {
  if (tags) {
    return (
      <TableCell align="center">
        {tags.map((tag: string) => (
          <Chip size="small" key={tag} label={tag} />
        ))}
      </TableCell>
    )
  }
  return <TableCell />
}

const ProjectInfo: React.FC<{ project: Project }> = ({ project }) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const created = new Date(project.creationTimestamp).toString()
  const edited = new Date(project.lastEdited).toString()

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
        <TableCell align="right">{project.client}</TableCell>
        <TableCell align="center">
          <Avatar>
            {project.owner.firstName.charAt(0)}
            {project.owner.lastName.charAt(0)}
          </Avatar>
        </TableCell>
        <Tags tags={project.tags} />
        <TableCell align="right">
          <EditIcon />
          <DeleteIcon />
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
                    <TableCell>
                      {project.creator.firstName} {project.creator.lastName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Last modified</TableCell>
                    <TableCell>{edited}</TableCell>
                    <TableCell>
                      {project.lastEditor.firstName} {project.lastEditor.lastName}
                    </TableCell>
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
