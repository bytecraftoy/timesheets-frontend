import React, { useState, useEffect } from 'react'
import { Redirect, Link as RouterLink } from 'react-router-dom'
import {
  InputLabel,
  Select,
  Switch,
  Button,
  TextField,
  MenuItem,
  Grid,
  makeStyles,
  FormControlLabel,
  FormControl,
} from '@material-ui/core'
import { useFormik } from 'formik'
import axios from 'axios'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Client, Manager } from '../common/types'

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
  const [isLoading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [toNext, setToNext] = useState(false)

  const formik = useFormik({
    initialValues: {
      projectName: '',
      clientName: '',
      managerName: '',
      billable: true,
    },
    onSubmit: (values) => {
      axios.post('http://localhost:8080/add_project', values)
      setToNext(true)
    },
  })

  const fetchManagerAndClients = async () => {
    const clientPromise = axios.get('http://localhost:8080/clients')
    const managerResponse = await axios.get('http://localhost:8080/managers')
    const clientResponse = await clientPromise
    setClients(clientResponse.data)
    setManagers(managerResponse.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchManagerAndClients()
  }, [])
  const classes = useStyles()

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit} className={classes.root}>
      <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
        <Grid item>
          <TextField
            id="projectName"
            name="projectName"
            label="Project's Name"
            value={formik.values.projectName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>

        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel>Client</InputLabel>
            <Select
              id="clientName"
              name="clientName"
              value={formik.values.clientName}
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
            <InputLabel>Manager</InputLabel>
            <Select
              id="managerName"
              name="managerName"
              value={formik.values.managerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              {managers.map((manager) => {
                return (
                  <MenuItem key={manager.id} value={manager.username}>
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
  )
}

export default ProjectForm
