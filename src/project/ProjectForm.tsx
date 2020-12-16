import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import { Button, FormControlLabel, Grid, Switch, Typography, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Client, Manager, ProjectFormValues } from '../common/types'
import { getAll, create } from './ProjectService'
import notificationState from '../common/atoms'
import { ProjectFormTextField } from './ProjectFormTextField'
import {
  clientToProjectFormSelectItem,
  managerToProjectFormSelectItem,
  ProjectFormSelect,
} from './ProjectFormSelect'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  textFieldWide: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '55ch',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(1),
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
      if (values.name.length > 100) {
        errors.push({ name: "Project's name cannot be over 100 letters long." })
      }
      if (values.description.length > 400) {
        errors.push({ description: "Project's description cannot be over 400 letters long." })
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
            <ProjectFormTextField
              className={classes.textField}
              name="name"
              label="Project's Name"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.name}
              errors={formik.errors.name}
              touched={formik.touched.name}
            />
          </Grid>
          <Grid item>
            <ProjectFormTextField
              className={classes.textFieldWide}
              name="description"
              label="Description"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.description}
              errors={formik.errors.description}
              touched={formik.touched.description}
            />
          </Grid>
          <Grid item>
            <ProjectFormSelect
              objects={clientToProjectFormSelectItem(clients)}
              className={classes.formControl}
              name="client"
              label="Client"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.client}
              errors={formik.errors.client}
              touched={formik.touched.client}
            />
            <ProjectFormSelect
              objects={managerToProjectFormSelectItem(managers)}
              className={classes.formControl}
              name="owner"
              label="Owner"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.owner}
              errors={formik.errors.owner}
              touched={formik.touched.owner}
            />
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
                  inputProps={{ 'aria-label': 'billable' }}
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
