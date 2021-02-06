import React, { useState, useCallback } from 'react'
import { isBefore } from 'date-fns'
import { useFormik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { Grid, makeStyles } from '@material-ui/core'
import notificationState from '../common/atoms'
import {
  Employee,
  Client,
  Project,
  BillingReportFormValues,
  BillingReportData,
} from '../common/types'
import { getAllClients, getProjectsByClientId } from '../services/clientService'
import { getEmployeesByProjectIds } from '../services/projectService'
import FormSelect from '../form/FormSelect'
import FormSelectMultiple from '../form/FormSelectMultiple'
import {
  employeesToFormSelectItem,
  clientToFormSelectItem,
  projectsToFormSelectItem,
} from '../form/formService'
import { getBillingReportData, getFirstDayOfMonth, getLastDayOfLastMonth } from './ReportService'
import { useAPIErrorHandler } from '../services/errorHandlingService'
import TimeIntervalQuickSelects from './TimeIntervalQuickSelects'
import GenerateButton from './GenerateButton'
import SelectAllButton from './SelectAllButton'
import UnselectAllButton from './UnselectAllButton'
import TimeIntervalSelects from './TimeIntervalSelects'
import DateErrors from './DateErrors'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: theme.spacing(30),
  },
}))

const BillingReportForm: React.FC<{
  setReportData: React.Dispatch<React.SetStateAction<BillingReportData | undefined>>
}> = ({ setReportData }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [toNext, setToNext] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const initialValues: BillingReportFormValues = {
    startDate: getFirstDayOfMonth(1),
    endDate: getLastDayOfLastMonth(),
    client: '',
    projects: [],
    employees: [],
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await getBillingReportData(values)
        setReportData(response)
        setNotification({
          message: t('report.billing.message.success', { client: response.client.name }),
          severity: 'success',
        })
        setToNext(true)
      } catch {
        setNotification({ message: t('report.billing.message.error'), severity: 'error' })
      }
    },
    validate: (values) => {
      const errors = []
      if (!values.client) {
        errors.push({ client: t('client.error') })
      }
      if (values.projects.length === 0) {
        if (!values.client) {
          errors.push({ projects: t('project.error.client') })
        } else {
          errors.push({ projects: t('project.error.empty') })
        }
      }

      if (values.employees.length === 0) {
        if (!values.projects) {
          errors.push({ employees: t('employee.error.project') })
        } else {
          errors.push({ employees: t('employee.error.empty') })
        }
      }
      if (isBefore(values.endDate, values.startDate)) {
        errors.push({ startDate: t('startDate.error') })
        errors.push({ endDate: t('endDate.error') })
      }
      return Object.assign({}, ...errors)
    },
  })

  const fetchClients = useCallback(async () => {
    const clientResponse = await getAllClients()
    setClients(clientResponse)
  }, [])

  const fetchProjects = useCallback(async () => {
    if (formik.values.client) {
      const projectResponse = await getProjectsByClientId(formik.values.client)
      setProjects(projectResponse)
    }
  }, [formik.values.client])

  const fetchEmployees = useCallback(async () => {
    if (formik.values.projects.length !== 0) {
      const employeeResponse = await getEmployeesByProjectIds(formik.values.projects)
      setEmployees(employeeResponse)
    }
  }, [formik.values.projects])

  useAPIErrorHandler(fetchClients)

  useAPIErrorHandler(fetchProjects)

  useAPIErrorHandler(fetchEmployees)

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
        <Grid item>
          <FormSelect
            objects={clientToFormSelectItem(clients)}
            className={classes.formControl}
            name={t('client.name')}
            label={t('client.label')}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.client}
            errors={formik.errors.client}
            touched={formik.touched.client}
          />
        </Grid>
        <Grid item>
          <FormSelectMultiple
            objects={projectsToFormSelectItem(projects)}
            className={classes.formControl}
            name={t('project.name')}
            label={t('project.label')}
            handleChange={(evt) =>
              formik.setFieldValue(t('project.name'), evt.target.value as string[])
            }
            handleBlur={formik.handleBlur}
            value={formik.values.projects}
            errors={formik.errors.projects}
            touched={formik.touched.projects}
          />
        </Grid>
        <Grid container item spacing={2}>
          <SelectAllButton
            label={t('project.selectAll')}
            setFieldValue={formik.setFieldValue}
            objects={projects}
            fieldName={t('project.name')}
          />
          <UnselectAllButton
            label={t('project.unselectAll')}
            setFieldValue={formik.setFieldValue}
            fieldName={t('project.name')}
          />
        </Grid>
        <Grid item>
          <FormSelectMultiple
            objects={employeesToFormSelectItem(employees)}
            className={classes.formControl}
            name={t('employee.name')}
            label={t('employee.label_plural')}
            handleChange={(evt) =>
              formik.setFieldValue(t('employee.name'), evt.target.value as string[])
            }
            handleBlur={formik.handleBlur}
            value={formik.values.employees}
            errors={formik.errors.employees}
            touched={formik.touched.employees}
          />
        </Grid>
        <Grid container item spacing={2}>
          <SelectAllButton
            label={t('employee.selectAll')}
            setFieldValue={formik.setFieldValue}
            objects={employees}
            fieldName={t('employee.name')}
          />
          <UnselectAllButton
            label={t('employee.unselectAll')}
            setFieldValue={formik.setFieldValue}
            fieldName={t('employee.name')}
          />
        </Grid>
        <TimeIntervalQuickSelects setFieldValue={formik.setFieldValue} />
        <TimeIntervalSelects values={formik.values} setFieldValue={formik.setFieldValue} />
        {(formik.errors.startDate || formik.errors.endDate) && (
          <DateErrors errors={formik.errors} touched={formik.touched} />
        )}
        {toNext && <Redirect to="/reports/preview" />}
        <GenerateButton className={classes.button} disabled={formik.isSubmitting} />
      </Grid>
    </form>
  )
}

export default BillingReportForm
