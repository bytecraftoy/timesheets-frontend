import React from 'react'
import { Button, Grid } from '@material-ui/core'
import { UnselectAllButtonProps } from '../common/types'

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
