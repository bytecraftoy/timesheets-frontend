import React, { useState, useCallback, useMemo, useLayoutEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { Button, FormControlLabel, Grid, Switch, Typography, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import SubmitButton from '../button/SubmitButton'
import { Client, Employee, Manager, ProjectFormValues } from '../common/types'
import { createProject } from '../services/projectService'
import { getAllClients } from '../services/clientService'
import { getAllEmployees } from '../services/employeeService'
import getAllManagers from '../services/managerService'
import notificationState from '../common/atoms'
import FormTextField from '../form/FormTextField'
import FormSelect from '../form/FormSelect'
import FormSelectMultiple from '../form/FormSelectMultiple'
import { clientToFormSelectItem, managerToFormSelectItem } from '../form/formService'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'

// TODO: refactor ProjectForm into smaller components

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 230,
  },
}))

const ProjectForm: React.FC = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [isLoading, setLoading] = useState(true)
  const [clients, setClients] = useState<Client[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [toNext, setToNext] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const initialValues: ProjectFormValues = {
    name: '',
    description: '',
    client: '',
    owner: '',
    employees: [],
    billable: true,
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await createProject(values)
        setNotification({
          message: t('project.message.success', { project: response.name }),
          severity: 'success',
        })
      } catch (error) {
        setNotification({ message: error, severity: 'error' })
      } finally {
        setToNext(true)
      }
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {}
      if (!values.name) {
        errors.name = t('project.error.name.empty')
      }
      if (values.name.length > 100) {
        errors.name = t('project.error.tooLong')
      }
      if (values.description.length > 400) {
        errors.description = t('project.description.error')
      }
      if (!values.client) {
        errors.client = t('client.error.chooseOne')
      }
      if (!values.owner) {
        errors.owner = t('owner.error')
      }
      return errors
    },
  })

  const fetchEmployeesManagersAndClients = useCallback(async () => {
    const clientPromise = getAllClients()
    const employeePromise = getAllEmployees()
    setManagers(await getAllManagers())
    setClients(await clientPromise)
    setEmployees(await employeePromise)
  }, [])

  useAPIErrorHandlerWithFinally(
    fetchEmployeesManagersAndClients,
    useCallback(() => setLoading(false), [])
  )

  const clientSelectItems = useMemo(() => clientToFormSelectItem(clients), [clients])
  const managerSelectItems = useMemo(() => managerToFormSelectItem(managers), [managers])
  const employeeSelectItems = useMemo(
    () =>
      managerToFormSelectItem(employees.filter((employee) => employee.id !== formik.values.owner)),
    [employees, formik.values.owner]
  )

  useLayoutEffect(() => {
    formik.values.employees = formik.values.employees.filter(
      (employee) => employee !== formik.values.owner
    )
  }, [formik.values])

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
        {t('project.createNew')}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
          <Grid item>
            <FormTextField
              name="name"
              label={t('project.form.nameLabel')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.name}
              errors={formik.errors.name}
              touched={formik.touched.name}
            />
          </Grid>
          <Grid item>
            <FormTextField
              name="description"
              multiline
              label={t('project.description.label')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.description}
              errors={formik.errors.description}
              touched={formik.touched.description}
            />
          </Grid>
          <Grid item container spacing={3}>
            <Grid item>
              <FormSelect
                objects={clientSelectItems}
                className={classes.formControl}
                name="client"
                label={t('client.label')}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.client}
                errors={formik.errors.client}
                touched={formik.touched.client}
              />
            </Grid>
            <Grid item>
              <FormSelect
                objects={managerSelectItems}
                className={classes.formControl}
                name="owner"
                label={t('owner.label')}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                value={formik.values.owner}
                errors={formik.errors.owner}
                touched={formik.touched.owner}
              />
            </Grid>
          </Grid>
          <Grid item>
            <FormSelectMultiple
              objects={employeeSelectItems}
              className={classes.formControl}
              name="employees"
              label={t('employee.label')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.employees}
              errors={formik.errors.employees}
              touched={formik.touched.employees}
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
              label={t('billable.label')}
            />
          </Grid>
          {toNext && <Redirect to="/projects" />}
          <Grid container item spacing={1}>
            <SubmitButton
              disabled={formik.isSubmitting}
              testId="projectFormSubmit"
              label={t('button.create')}
            />
            <Grid item>
              <Button
                disabled={formik.isSubmitting}
                variant="contained"
                onClick={() => setToNext(true)}
              >
                {t('button.cancel')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  )
}

export default ProjectForm
