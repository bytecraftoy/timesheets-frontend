import React from 'react'
import { FormikErrors } from 'formik'
import { Button, Grid } from '@material-ui/core'
import { BillingReportFormValues } from '../common/types'

interface UnselectAllButtonProps {
  label: string
  fieldName: string
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

const UnselectAllButton: React.FC<UnselectAllButtonProps> = ({
  label,
  setFieldValue,
  fieldName,
}) => {
  return (
    <Grid item>
      <Button variant="outlined" color="primary" onClick={() => setFieldValue(fieldName, [])}>
        {label}
      </Button>
    </Grid>
  )
}

export default UnselectAllButton
