import React from 'react'
import { FormikErrors, FormikTouched } from 'formik'
import { Grid, makeStyles, Typography } from '@material-ui/core'
import { BillingReportFormValues } from '../common/types'

// TODO: tee datepicker error viesteistä enemmän formikin error viestien näköiset ja ehkä punaiset

const useStyles = makeStyles((theme) => ({
  dateErrorText: {
    width: theme.spacing(33.75),
  },
}))

interface DateErrorProps {
  errors: FormikErrors<Date> | undefined
  touched: FormikTouched<Date> | undefined
}

const DateError: React.FC<DateErrorProps> = ({ errors, touched }) => {
  const classes = useStyles()

  return (
    <Grid item className={classes.dateErrorText}>
      {errors && touched && <Typography variant="caption">{errors}</Typography>}
    </Grid>
  )
}

interface DateErrorsProps {
  errors: FormikErrors<BillingReportFormValues>
  touched: FormikTouched<BillingReportFormValues>
}

const DateErrors: React.FC<DateErrorsProps> = ({ errors, touched }) => {
  return (
    <Grid container item spacing={6}>
      <DateError errors={errors.startDate} touched={touched.startDate} />
      <DateError errors={errors.endDate} touched={touched.endDate} />
    </Grid>
  )
}

export default DateErrors
