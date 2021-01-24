/* eslint-disable no-console */
import React, { useState, useEffect, useCallback } from 'react'
import { isBefore } from 'date-fns'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Grid, Typography, makeStyles } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DatePicker from './DatePicker'
import { Client, Project } from '../common/types'
import { getAllClients, getProjectsByClientId } from '../services/clientService'
import FormSelect from '../form/FormSelect'
import FormSelectMultiple from '../form/FormSelectMultiple'
import { clientToFormSelectItem, projectsToFormSelectItem } from '../form/formService'
import {
  getFirstDayOfLastMonth,
  getLastDayOfLastMonth,
  getFirstDayOfLastTwoMonths,
  getFirstDayOfLastSixMonths,
  getFirstDayOfLastYear,
  getLastDayOfLastYear,
} from './ReportService'

// TODO: tee datepicker error viesteistä enemmän formikin error viestien näköiset ja ehkä punaiset
// TODO: olisi kiva, jos valittu asiakas/projekti/tms. näkyisi vähän selvemmällä taustavärillä.
// ??? Eli miten muutetaan taustaväriä?
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

interface BillingReportFormValues {
  startDate: Date
  endDate: Date
  client: string
  projects: string[]
}

const BillingReportForm: React.FC = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const initialValues: BillingReportFormValues = {
    startDate: getFirstDayOfLastMonth(),
    endDate: getLastDayOfLastMonth(),
    client: '',
    projects: [],
  }

  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      // eslint-disable-next-line no-console
      console.log(values)
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
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                formik.setFieldValue('startDate', getFirstDayOfLastTwoMonths())
                formik.setFieldValue('endDate', getLastDayOfLastMonth())
              }}
            >
              Last 2 months
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                formik.setFieldValue('startDate', getFirstDayOfLastSixMonths())
                formik.setFieldValue('endDate', getLastDayOfLastMonth())
              }}
            >
              Last 6 months
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                formik.setFieldValue('startDate', getFirstDayOfLastYear())
                formik.setFieldValue('endDate', getLastDayOfLastYear())
              }}
            >
              Last year
            </Button>
          </Grid>
        </Grid>
        <Grid container item spacing={6}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item>
              <DatePicker
                id="start-date-picker"
                label={t('startDateLabel')}
                value={formik.values.startDate}
                handleDateChange={(date) => {
                  formik.setFieldValue('startDate', date)
                }}
              />
            </Grid>
            <Grid item>
              <DatePicker
                id="end-date-picker"
                label={t('endDateLabel')}
                value={formik.values.endDate}
                handleDateChange={(date) => {
                  formik.setFieldValue('endDate', date)
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid container item spacing={6}>
          <Grid item className={classes.dateErrorText}>
            {formik.errors.startDate && formik.touched.startDate && (
              <Typography variant="caption">{formik.errors.startDate}</Typography>
            )}
          </Grid>
          <Grid item className={classes.dateErrorText}>
            {formik.errors.endDate && formik.touched.endDate && (
              <Typography variant="caption">{formik.errors.endDate}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid item>
          <Button
            className={classes.button}
            disabled={formik.isSubmitting}
            variant="contained"
            type="submit"
            color="primary"
          >
            {t('generateButtonLabel')}
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}

export default BillingReportForm
