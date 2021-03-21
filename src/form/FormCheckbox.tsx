import React from 'react'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { FormCheckboxProps } from '../common/types'

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  checked,
  handleChange,
  ariaLabel,
  label,
}) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          id={name}
          name={name}
          checked={checked}
          onChange={handleChange}
          color="primary"
          inputProps={{ 'aria-label': ariaLabel }}
        />
      }
      label={label}
    />
  )
}

export default FormCheckbox
