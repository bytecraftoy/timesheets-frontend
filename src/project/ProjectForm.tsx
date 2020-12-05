import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

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
  FormHelperText,
} from '@material-ui/core'
import { useFormik } from 'formik'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Client, Manager, ProjectFormValues } from '../common/types'
import { getAll, create } from './ProjectService'
import notificationState from '../common/atoms'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '55ch',
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
  const [isSubmitting, setSubmitting] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      client: '',
      owner: '',
      billable: true,
    },
    onSubmit: async (values) => {
      setSubmitting(true)
      try {
        const response = await create<ProjectFormValues>(values)
        setNotification({
          message: `${response.name} created succesfully!`,
          severity: 'success',
        })
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      } finally {
        setToNext(true)
      }
    },
    validate: (values) => {
      const errors = []
      if (values.name === '') {
        errors.push({ name: 'Project must have a name.' })
      }
      if (values.client === '') {
        errors.push({ client: 'You must choose a client.' })
      }
      if (values.owner === '') {
        errors.push({ owner: 'You must choose an owner.' })
      }
      return Object.assign({}, ...errors)
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
              error={Boolean(formik.errors.name && formik.touched.name)}
              helperText={formik.errors.name && formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item>
            <TextField
              className={classes.textField}
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
                error={Boolean(formik.errors.client && formik.touched.client)}
              >
                {clients.map((client) => {
                  return (
                    <MenuItem key={client.id} value={client.name}>
                      {client.name}
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>
                {formik.errors.client && formik.touched.client && formik.errors.client}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Owner</InputLabel>
              <Select
                id="owner"
                name="owner"
                value={formik.values.owner}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.owner && formik.touched.owner)}
              >
                {managers.map((manager) => {
                  return (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.firstName} {manager.lastName}
                    </MenuItem>
                  )
                })}
              </Select>
              <FormHelperText>
                {formik.errors.owner && formik.touched.owner && formik.errors.owner}
              </FormHelperText>
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
            <Button
              className={classes.button}
              disabled={isSubmitting}
              variant="contained"
              type="submit"
              color="primary"
            >
              Create
            </Button>
            <Button
              className={classes.button}
              disabled={isSubmitting}
              variant="contained"
              onClick={() => setToNext(true)}
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
