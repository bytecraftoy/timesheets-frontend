import React from 'react'
import { Button, Grid } from '@material-ui/core'
import { OutlinedButtonProps } from '../common/types'

const OutlinedButton: React.FC<OutlinedButtonProps> = ({ label, handleClick }) => {
  return (
    <Grid item>
      <Button variant="outlined" color="primary" onClick={handleClick}>
        {label}
      </Button>
    </Grid>
  )
}

export default OutlinedButton
