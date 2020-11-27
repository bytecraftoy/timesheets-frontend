import React, { useState, useEffect } from 'react'
import { Redirect, Link as RouterLink } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { useFormik } from 'formik'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Client, Manager, ProjectFormValues } from '../common/types'
import { getAll, create } from './ProjectService'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  button: {
    margin: 8,
  },
}))

const ProjectForm: React.FC = () => {
  const classes = useStyles()

  const [isLoading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [toNext, setToNext] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      client: '',
      owner: '',
      billable: true,
    },
    onSubmit: (values) => {
      create<ProjectFormValues>(values).then(() => setToNext(true))
    },
  })

  const fetchManagerAndClients = async () => {
    const clientResponse = await getAll<Client[]>('clients')
    const managerResponse = await getAll<Manager[]>('managers')
    setClients(clientResponse)
    setManagers(managerResponse)
    setLoading(false)
  }

  useEffect(() => {
    fetchManagerAndClients()
  }, [])

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <>
      <Typography variant="h6">Create new project</Typography>
      <form onSubmit={formik.handleSubmit} className={classes.root}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
          <Grid item>
            <TextField
              id="name"
              name="name"
              label="Project's Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>
          <Grid item>
            <TextField
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Grid>

          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel>Client</InputLabel>
              <Select
                id="client"
                name="client"
                value={formik.values.client}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {clients.map((client) => {
                  return (
                    <MenuItem key={client.id} value={client.name}>
                      {client.name}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Owner</InputLabel>
              <Select
                id="owner"
                name="owner"
                value={formik.values.owner}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {managers.map((manager) => {
                  return (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.firstName} {manager.lastName}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControlLabel
              control={
                <Switch
                  id="billable"
                  name="billable"
                  checked={formik.values.billable}
                  onChange={formik.handleChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
              label="Is billable"
            />
          </Grid>

          {toNext && <Redirect to="/projects" />}
          <Grid item>
            <Button className={classes.button} variant="contained" type="submit" color="primary">
              Create
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              component={RouterLink}
              to="/projects"
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ProjectForm
