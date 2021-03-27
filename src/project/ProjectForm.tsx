import React, { useState, useCallback, useMemo, useLayoutEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import SubmitButton from '../button/SubmitButton'
import { Client, Employee, Manager, ProjectFormValues } from '../common/types'
import { createProject } from '../services/projectService'
import { getAllClients } from '../services/clientService'
import { getAllEmployees } from '../services/employeeService'
import getAllManagers from '../services/managerService'
import notificationState from '../common/atoms'
import * as constants from '../common/constants'
import FormTextField from '../form/FormTextField'
import FormSelect from '../form/FormSelect'
import FormSelectMultiple from '../form/FormSelectMultiple'
import { clientToFormSelectItem, employeesToFormSelectItem } from '../form/formService'
import { useAPIErrorHandler } from '../services/errorHandlingService'
import FormSwitch from '../form/FormSwitch'

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: 230,
  },
}))

const ProjectForm: React.FC = () => {
  const { t } = useTranslation()
  const classes = useStyles()

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
          message: t('project.message.createSuccess', { project: response.name }),
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
    setManagers(await getAllManagers())
    setClients(await getAllClients())
    setEmployees(await getAllEmployees())
  }, [])

  useAPIErrorHandler(fetchEmployeesManagersAndClients)

  const clientSelectItems = useMemo(() => clientToFormSelectItem(clients), [clients])
  const managerSelectItems = useMemo(() => employeesToFormSelectItem(managers), [managers])
  const employeeSelectItems = useMemo(
    () =>
      employeesToFormSelectItem(
        employees.filter((employee) => employee.id !== formik.values.owner)
      ),
    [employees, formik.values.owner]
  )

  useLayoutEffect(() => {
    formik.values.employees = formik.values.employees.filter(
      (employee) => employee !== formik.values.owner
    )
  }, [formik.values])

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
              name={constants.DESCRIPTION}
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
                name={constants.CLIENT}
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
                name={constants.OWNER}
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
              name={constants.EMPLOYEES}
              label={t('employee.label')}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.employees}
              errors={formik.errors.employees}
              touched={formik.touched.employees}
            />
          </Grid>
          <Grid item>
            <FormSwitch
              name={constants.BILLABLE}
              checked={formik.values.billable}
              handleChange={formik.handleChange}
              ariaLabel={constants.BILLABLE}
              label={t('billable.label')}
            />
          </Grid>
          {toNext && <Redirect to={constants.PATHS.projects} />}
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
