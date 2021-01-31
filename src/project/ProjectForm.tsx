import React, { useState, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { Button, FormControlLabel, Grid, Switch, Typography, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Client, Manager } from '../common/types'
import { createProject } from '../services/projectService'
import { getAllClients } from '../services/clientService'
import getAllManagers from '../services/managerService'
import notificationState from '../common/atoms'
import FormTextField from '../form/FormTextField'
import FormSelect from '../form/FormSelect'
import { clientToFormSelectItem, managerToFormSelectItem } from '../form/formService'
import useAPIErrorHandler from '../services/errorHandlingService'

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
  const { t } = useTranslation()
  const classes = useStyles()

  const [isLoading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [toNext, setToNext] = useState(false)
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
      try {
        const response = await createProject(values)
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
        errors.push({ name: t('projectFormEmptyNameErrorText') })
      }
      if (values.name.length > 100) {
        errors.push({ name: t('projectFormTooLongNameErrorText') })
      }
      if (values.description.length > 400) {
        errors.push({ description: t('projectFormTooLongDescriptionErrorText') })
      }
      if (values.client === '') {
        errors.push({ client: t('emptyClientErrorText') })
      }
      if (values.owner === '') {
        errors.push({ owner: t('projectFormEmptyOwnerErrorText') })
      }
      return Object.assign({}, ...errors)
    },
  })

  const fetchManagersAndClients = useCallback(async () => {
    const clientResponse = await getAllClients()
    const managerResponse = await getAllManagers()
    setClients(clientResponse)
    setManagers(managerResponse)
  }, [])

  useAPIErrorHandler(
    fetchManagersAndClients,
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
    <>
      <Typography variant="h6" data-cy="project-form-heading">
        {t('projectFormHeading')}
      </Typography>
      <form onSubmit={formik.handleSubmit} className={classes.root}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
          <Grid item>
            <FormTextField
              className={classes.textField}
              name="name"
              label={t('projectFormNameLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.name}
              errors={formik.errors.name}
              touched={formik.touched.name}
            />
          </Grid>
          <Grid item>
            <FormTextField
              className={classes.textFieldWide}
              name="description"
              label={t('projectFormDescriptionLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.description}
              errors={formik.errors.description}
              touched={formik.touched.description}
            />
          </Grid>
          <Grid item>
            <FormSelect
              objects={clientToFormSelectItem(clients)}
              className={classes.formControl}
              name="client"
              label={t('clientLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.client}
              errors={formik.errors.client}
              touched={formik.touched.client}
            />
            <FormSelect
              objects={managerToFormSelectItem(managers)}
              className={classes.formControl}
              name="owner"
              label={t('ownerLabel')}
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
              label={t('billableLabel')}
            />
          </Grid>
          {toNext && <Redirect to="/projects" />}
          <Grid item>
            <Button
              className={classes.button}
              disabled={formik.isSubmitting}
              variant="contained"
              type="submit"
              color="primary"
              data-testid="projectFormSubmit"
            >
              {t('createButtonLabel')}
            </Button>
            <Button
              className={classes.button}
              disabled={formik.isSubmitting}
              variant="contained"
              onClick={() => setToNext(true)}
            >
              {t('cancelButtonLabel')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ProjectForm
