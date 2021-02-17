/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react'
import { isBefore } from 'date-fns'
import { useFormik } from 'formik'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { Grid, makeStyles } from '@material-ui/core'
import notificationState from '../../common/atoms'
import { Client, Employee, SalaryReportData, SalaryReportFormValues } from '../../common/types'
import FormSelect from '../../form/FormSelect'
import TimeIntervalQuickSelects from '../../button/TimeIntervalQuickSelects'
import TimeIntervalSelects from '../../form/TimeIntervalSelects'
import SubmitButton from '../../button/SubmitButton'
import { getFirstDayOfMonth, getLastDayOfLastMonth } from '../../services/dateAndTimeService'
import { clientToFormSelectItem, employeesToFormSelectItem } from '../../form/formService'
import * as constants from '../../common/constants'
import FormSelectMultipleWithButtons from '../../form/FormSelectMultipleWithButtons'
import { getSalaryReportData } from '../ReportService'
import getAllEmployees from '../../services/employeeService'
import { getClientsByEmployeeId } from '../../services/clientService'
import { useAPIErrorHandler } from '../../services/errorHandlingService'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: theme.spacing(30),
  },
}))

const SalaryReportForm: React.FC<{
  setReportData: React.Dispatch<React.SetStateAction<SalaryReportData | undefined>>
}> = ({ setReportData }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [toNext, setToNext] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const initialValues: SalaryReportFormValues = {
    startDate: getFirstDayOfMonth(1),
    endDate: getLastDayOfLastMonth(),
    employee: '',
    clients: [],
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const response = await getSalaryReportData(values)
        setReportData(response)
        setNotification({
          message: t('report.salary.message.success', {
            employee: `${response.employee.firstName} ${response.employee.lastName}`,
          }),
          severity: 'success',
        })
        setToNext(true)
      } catch {
        setNotification({ message: t('report.salary.message.error'), severity: 'error' })
      }
    },
    validate: (values) => {
      const errors = []
      if (!values.employee) {
        errors.push({ employee: t('employee.error.chooseOne') })
      }
      if (values.clients.length === 0) {
        errors.push({ clients: t('client.error.atLeastOne') })
      }
      if (isBefore(values.endDate, values.startDate)) {
        errors.push({ startDate: t('startDate.error') })
        errors.push({ endDate: t('endDate.error') })
      }
      return Object.assign({}, ...errors)
    },
  })

  const fetchEmployees = useCallback(async () => {
    const employeeResponse = await getAllEmployees()
    setEmployees(employeeResponse)
  }, [])

  const fetchClients = useCallback(async () => {
    if (formik.values.employee) {
      const clientResponse = await getClientsByEmployeeId(formik.values.employee)
      setClients(clientResponse)
    }
  }, [formik.values.employee])

  useAPIErrorHandler(fetchEmployees)
  useAPIErrorHandler(fetchClients)

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
        <Grid item>
          <FormSelect
            objects={employeesToFormSelectItem(employees)}
            className={classes.formControl}
            name={constants.EMPLOYEE}
            label={t('employee.label')}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.employee}
            errors={formik.errors.employee}
            touched={formik.touched.employee}
          />
        </Grid>
        <FormSelectMultipleWithButtons
          formSelectItems={clientToFormSelectItem(clients)}
          objects={clients}
          setFieldValue={formik.setFieldValue}
          handleBlur={formik.handleBlur}
          value={formik.values.clients}
          errors={formik.errors.clients}
          touched={formik.touched.clients}
          label={constants.CLIENT}
          name={constants.CLIENTS}
          className={classes.formControl}
        />
        <TimeIntervalQuickSelects setFieldValue={formik.setFieldValue} />
        <TimeIntervalSelects
          values={formik.values}
          setFieldValue={formik.setFieldValue}
          errors={formik.errors}
          touched={formik.touched}
        />
        {toNext && <Redirect to="/reports/salary/preview" />}
        <SubmitButton
          className={classes.button}
          disabled={formik.isSubmitting}
          label={t('button.generate')}
          testId="salaryReportFormGenerate"
        />
      </Grid>
    </form>
  )
}

export default SalaryReportForm
