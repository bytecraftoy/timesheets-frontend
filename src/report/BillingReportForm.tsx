/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
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

// TODO: tee datepicker error viesteistä enemmän formikin error viestien näköiset ja ehkä punaiset
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  dateErrorText: {
    width: 270,
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
      >
        {t('generateButtonLabel')}
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
          message: `Billing report for ${response.client.name} created succesfully`,
          severity: 'success',
        })
        setToNext(true)
      } catch {
        setNotification({ message: 'Generating report failed.', severity: 'error' })
      } finally {
        setToNext(true)
      }
    },
    validate: (values) => {
      const errors = []
      if (values.client === '') {
        errors.push({ client: t('emptyClientErrorText') })
      }
      if (values.projects.length === 0) {
        if (values.client === '') {
          errors.push({ projects: t('chooseClientBeforeProjectText') })
        } else {
          errors.push({ projects: t('emptyProjectsErrorText') })
        }
      }
      if (isBefore(values.endDate, values.startDate)) {
        errors.push({ startDate: t('starDateErrorText') })
        errors.push({ endDate: t('endDateErrorText') })
      }
      return Object.assign({}, ...errors)
    },
  })

  const fetchClients = async () => {
    const clientResponse = await getAllClients()
    setClients(clientResponse)
  }

  const fetchProjects = useCallback(async () => {
    if (formik.values.client !== '') {
      const projectResponse = await getProjectsByClientId(formik.values.client)
      setProjects(projectResponse)
    }
  }, [formik.values.client])

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [formik.values.client, fetchProjects])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container direction="column" justify="flex-start" alignItems="flex-start" spacing={3}>
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
        </Grid>
        <Grid item>
          <FormSelectMultiple
            objects={projectsToFormSelectItem(projects)}
            className={classes.formControl}
            name="projects"
            label={t('projectsTitle')}
            handleChange={(evt) => formik.setFieldValue('projects', evt.target.value as string[])}
            handleBlur={formik.handleBlur}
            value={formik.values.projects}
            errors={formik.errors.projects}
            touched={formik.touched.projects}
          />
        </Grid>
        <Grid container item direction="row" spacing={1}>
          <PickTimeframeButton
            label={t('lastTwoMonthsLabel')}
            handleClick={() => {
              formik.setFieldValue(t('startDate'), getFirstDayOfMonth(2))
              formik.setFieldValue(t('endDate'), getLastDayOfLastMonth())
            }}
          />
          <PickTimeframeButton
            label={t('lastSixMonthsLabel')}
            handleClick={() => {
              formik.setFieldValue(t('startDate'), getFirstDayOfMonth(6))
              formik.setFieldValue(t('endDate'), getLastDayOfLastMonth())
            }}
          />
          <PickTimeframeButton
            label={t('lastYearLabel')}
            handleClick={() => {
              formik.setFieldValue(t('startDate'), getFirstDayOfLastYear())
              formik.setFieldValue(t('endDate'), getLastDayOfLastYear())
            }}
          />
        </Grid>
        <Grid container item spacing={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              id="start-date-picker"
              label={t('startDateLabel')}
              value={formik.values.startDate}
              handleDateChange={(date) => {
                formik.setFieldValue(t('startDate'), date)
              }}
            />
            <DatePicker
              id="end-date-picker"
              label={t('endDateLabel')}
              value={formik.values.endDate}
              handleDateChange={(date) => {
                formik.setFieldValue(t('endDate'), date)
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
