import React from 'react'
import { FormikErrors } from 'formik'
import { Button, Grid } from '@material-ui/core'
import { BillingReportFormValues, Project } from '../common/types'

interface SelectAllButtonProps {
  label: string
  objects: Project[]
  fieldName: string
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

const SelectAllButton: React.FC<SelectAllButtonProps> = ({
  label,
  setFieldValue,
  objects,
  fieldName,
}) => {
  return (
    <Grid item>
      <Button
        variant="outlined"
        color="primary"
        onClick={() =>
          setFieldValue(
            fieldName,
            objects.map((obj) => obj.id)
          )
        }
      >
        {label}
      </Button>
    </Grid>
  )
}

export default SelectAllButton
