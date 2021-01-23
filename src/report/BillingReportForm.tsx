import React, { useState, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Grid, makeStyles } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DatePicker from './DatePicker'
import { Client } from '../common/types'
import getAllClients from '../services/clientService'
import FormSelect from '../form/FormSelect'
import { clientToFormSelectItem } from '../form/formService'
import { getFirstDayOfLastMonth, getLastDayOfLastMonth } from './ReportService'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
}))

const BillingReportForm: React.FC = () => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [clients, setClients] = useState<Client[]>([])

  const formik = useFormik({
    initialValues: {
      startDate: getFirstDayOfLastMonth(),
      endDate: getLastDayOfLastMonth(),
      client: '',
    },
    onSubmit: async (values) => {
      // eslint-disable-next-line no-console
      console.log(values)
    },
    validate: (values) => {
      const errors = []
      if (values.client === '') {
        errors.push({ client: t('emptyClientErrorText') })
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

  useEffect(() => {
    fetchClients()
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-evenly">
            <DatePicker
              id="start-date-picker"
              label={t('startDateLabel')}
              value={formik.values.startDate}
              handleDateChange={(date) => {
                formik.setFieldValue('startDate', date)
              }}
            />
            {formik.errors.startDate && formik.touched.startDate && formik.errors.startDate}
            <DatePicker
              id="end-date-picker"
              label={t('endDateLabel')}
              value={formik.values.endDate}
              handleDateChange={(date) => {
                formik.setFieldValue('endDate', date)
              }}
            />
            {formik.errors.endDate && formik.touched.endDate && formik.errors.endDate}
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container justify="flex-start">
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
        <Grid>
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
