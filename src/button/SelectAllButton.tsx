import React from 'react'
import { Button, Grid } from '@material-ui/core'
import { SelectAllButtonProps } from '../common/types'

const SelectAllButton: React.FC<SelectAllButtonProps> = ({
  label,
  setFieldValue,
  objects,
  fieldName,
}) => {
  return (
    <Grid item>
      <Button
        data-cy={label.toLowerCase().split(' ').join('-')}
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
