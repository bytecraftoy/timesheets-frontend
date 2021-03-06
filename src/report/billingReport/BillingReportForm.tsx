import React, { useState, useCallback } from 'react'
import { isBefore } from 'date-fns'
import { useFormik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { Grid } from '@material-ui/core'
import notificationState from '../../common/atoms'
import {
  Employee,
  Client,
  Project,
  BillingReportFormValues,
  BillingReportData,
} from '../../common/types'
import { getAllClients } from '../../services/clientService'
import { getProjectsByClientId } from '../../services/projectService'
import { getEmployeesByProjectIds } from '../../services/employeeService'
import FormSelect from '../../form/FormSelect'
import {
  employeesToFormSelectItem,
  clientToFormSelectItem,
  projectsToFormSelectItem,
} from '../../form/formService'
import { getBillingReportData } from '../reportService'
import { getFirstDayOfMonth, getLastDayOfLastMonth } from '../../services/dateAndTimeService'
import { useAPIErrorHandler } from '../../services/errorHandlingService'
import TimeIntervalQuickSelects from '../TimeIntervalQuickSelects'
import SubmitButton from '../../button/SubmitButton'
import TimeIntervalSelects from '../../form/TimeIntervalSelects'
import * as constants from '../../common/constants'
import FormSelectMultipleWithButtons from '../../form/FormSelectMultipleWithButtons'
import BillableCheckboxGroup from '../BillableCheckboxGroup'

import useStyles from '../styles'

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
    billable: true,
    nonBillable: true,
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
      const errors: { [key: string]: string } = {}
      if (!values.client) {
        errors.client = t('client.error.chooseOne')
      }
      if (values.projects.length === 0) {
        errors.projects = t('project.error.empty')
      }
      if (values.employees.length === 0) {
        errors.employees = t('employee.error.atLeastOne')
      }
      if (isBefore(values.endDate, values.startDate)) {
        errors.startDate = t('startDate.error')
        errors.endDate = t('endDate.error')
      }
      return errors
    },
  })

  const fetchClients = useCallback(async () => {
    const clientResponse = await getAllClients()
    setClients(clientResponse)
  }, [])

  const filterProjectValues = useCallback(
    (currentProjects: Project[]) => {
      return formik.values.projects.filter((item) => {
        return currentProjects.map((project) => project.id).includes(item)
      })
    },
    [formik.values.projects]
  )

  const fetchProjects = useCallback(async () => {
    if (formik.values.client) {
      const projectResponse = await getProjectsByClientId(formik.values.client)
      setProjects(projectResponse)
      formik.values.projects = filterProjectValues(projectResponse)
    }
  }, [filterProjectValues, formik.values])

  const filterEmployeeValues = useCallback(
    (currentEmployees: Employee[]) => {
      formik.values.employees = formik.values.employees.filter((item) => {
        return currentEmployees.map((employee) => employee.id).includes(item)
      })
    },
    [formik.values]
  )

  const fetchEmployees = useCallback(async () => {
    if (formik.values.projects.length !== 0) {
      const employeeResponse = await getEmployeesByProjectIds(formik.values.projects)
      setEmployees(employeeResponse)
      filterEmployeeValues(employeeResponse)
    } else {
      setEmployees([])
      filterEmployeeValues([])
    }
  }, [filterEmployeeValues, formik.values.projects])

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
            name={constants.CLIENT}
            label={t('client.label')}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.client}
            errors={formik.errors.client}
            touched={formik.touched.client}
          />
        </Grid>
        <FormSelectMultipleWithButtons
          formSelectItems={projectsToFormSelectItem(projects)}
          objects={projects}
          setFieldValue={formik.setFieldValue}
          handleBlur={formik.handleBlur}
          value={formik.values.projects}
          errors={formik.errors.projects}
          touched={formik.touched.projects}
          label={constants.PROJECT}
          name={constants.PROJECTS}
          className={classes.formControl}
        />
        <BillableCheckboxGroup
          billable={formik.values.billable}
          nonBillable={formik.values.nonBillable}
          handleChange={formik.handleChange}
        />
        <FormSelectMultipleWithButtons
          formSelectItems={employeesToFormSelectItem(employees)}
          objects={employees}
          setFieldValue={formik.setFieldValue}
          handleBlur={formik.handleBlur}
          value={formik.values.employees}
          errors={formik.errors.employees}
          touched={formik.touched.employees}
          label={constants.EMPLOYEE}
          name={constants.EMPLOYEES}
          className={classes.formControl}
        />
        <TimeIntervalQuickSelects setFieldValue={formik.setFieldValue} />
        <TimeIntervalSelects
          values={formik.values}
          setFieldValue={formik.setFieldValue}
          errors={formik.errors}
        />
        {toNext && <Redirect to={constants.PATHS.billingReportPreview} />}
        <SubmitButton
          className={classes.button}
          disabled={formik.isSubmitting}
          label={t('button.generate')}
          testId="billingReportFormGenerate"
        />
      </Grid>
    </form>
  )
}

export default BillingReportForm
