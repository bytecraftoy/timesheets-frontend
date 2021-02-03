/* eslint-disable no-console */
import React, { useState, useCallback } from 'react'
import { isBefore } from 'date-fns'
import { useFormik, FormikErrors, FormikTouched } from 'formik'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSetRecoilState } from 'recoil'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import notificationState from '../common/atoms'
import DatePicker from './DatePicker'
import { Client, Project, BillingReportFormValues, BillingReportData } from '../common/types'
import { getAllClients, getProjectsByClientId } from '../services/clientService'
import FormSelect from '../form/FormSelect'
import FormSelectMultiple from '../form/FormSelectMultiple'
import { clientToFormSelectItem, projectsToFormSelectItem } from '../form/formService'
import {
  getBillingReportData,
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from './ReportService'
import { useAPIErrorHandler } from '../services/errorHandlingService'

// TODO: tee datepicker error viesteistä enemmän formikin error viestien näköiset ja ehkä punaiset
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: theme.spacing(30),
  },
  dateErrorText: {
    width: theme.spacing(33.75),
  },
}))

interface PickTimeframeButtonProps {
  label: string
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PickTimeframeButton: React.FC<PickTimeframeButtonProps> = ({ label, handleClick }) => {
  return (
    <Grid item>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        {label}
      </Button>
    </Grid>
  )
}

interface GenerateButtonProps {
  className: string
  disabled: boolean | undefined
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ className, disabled }) => {
  const { t } = useTranslation()
  return (
    <Grid item>
      <Button
        className={className}
        disabled={disabled}
        variant="contained"
        type="submit"
        color="primary"
        data-testid="billingReportFormGenerate"
      >
        {t('button.generate')}
      </Button>
    </Grid>
  )
}

interface DateErrorsProps {
  className: string
  errors: FormikErrors<Date> | undefined
  touched: FormikTouched<Date> | undefined
}

const DateError: React.FC<DateErrorsProps> = ({ className, errors, touched }) => {
  return (
    <Grid item className={className}>
      {errors && touched && <Typography variant="caption">{errors}</Typography>}
    </Grid>
  )
}

const BillingReportForm: React.FC<{
  setReportData: React.Dispatch<React.SetStateAction<BillingReportData | undefined>>
}> = ({ setReportData }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [toNext, setToNext] = useState(false)
  const setNotification = useSetRecoilState(notificationState)

  const initialValues: BillingReportFormValues = {
    startDate: getFirstDayOfMonth(1),
    endDate: getLastDayOfLastMonth(),
    client: '',
    projects: [],
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

  useAPIErrorHandler(fetchClients)

  useAPIErrorHandler(fetchProjects)

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
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              formik.setFieldValue(
                t('project.name'),
                projects.map((project) => project.id)
              )
            }
          >
            {t('project.selectAll')}
          </Button>
        </Grid>
        <Grid container item direction="row" spacing={1}>
          <PickTimeframeButton
            label={t('button.lastTwoMonths')}
            handleClick={() => {
              formik.setFieldValue(t('startDate.name'), getFirstDayOfMonth(2))
              formik.setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
            }}
          />
          <PickTimeframeButton
            label={t('button.lastSixMonths')}
            handleClick={() => {
              formik.setFieldValue(t('startDate.name'), getFirstDayOfMonth(6))
              formik.setFieldValue(t('endDate.name'), getLastDayOfLastMonth())
            }}
          />
          <PickTimeframeButton
            label={t('button.lastYear')}
            handleClick={() => {
              formik.setFieldValue(t('startDate.name'), getFirstDayOfLastYear())
              formik.setFieldValue(t('endDate.name'), getLastDayOfLastYear())
            }}
          />
        </Grid>
        <Grid container item spacing={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              id="start-date-picker"
              label={t('startDate.label')}
              value={formik.values.startDate}
              handleDateChange={(date) => {
                formik.setFieldValue(t('startDate.name'), date)
              }}
            />
            <DatePicker
              id="end-date-picker"
              label={t('endDate.label')}
              value={formik.values.endDate}
              handleDateChange={(date) => {
                formik.setFieldValue(t('endDate.name'), date)
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        {(formik.errors.startDate || formik.errors.endDate) && (
          <Grid container item spacing={6}>
            <DateError
              className={classes.dateErrorText}
              errors={formik.errors.startDate}
              touched={formik.touched.startDate}
            />
            <DateError
              className={classes.dateErrorText}
              errors={formik.errors.endDate}
              touched={formik.touched.endDate}
            />
          </Grid>
        )}
        {toNext && <Redirect to="/reports/preview" />}
        <GenerateButton className={classes.button} disabled={formik.isSubmitting} />
      </Grid>
    </form>
  )
}

export default BillingReportForm
