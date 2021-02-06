import React from 'react'
import { Button, Grid } from '@material-ui/core'
import { SubmitButtonProps } from '../common/types'

const SubmitButton: React.FC<SubmitButtonProps> = ({ className, disabled, label, testId }) => {
  return (
    <Grid item>
      <Button
        className={className}
        disabled={disabled}
        variant="contained"
        type="submit"
        color="primary"
        data-testid={testId}
      >
        {label}
      </Button>
    </Grid>
  )
}

export default SubmitButton
