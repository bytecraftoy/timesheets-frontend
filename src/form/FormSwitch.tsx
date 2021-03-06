import React from 'react'
import { FormControlLabel, Switch } from '@material-ui/core'
import { FormSwitchProps } from '../common/types'

const FormSwitch: React.FC<FormSwitchProps> = ({
  name,
  checked,
  handleChange,
  ariaLabel,
  label,
  disabled,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          id={name}
          name={name}
          checked={checked}
          onChange={handleChange}
          color="primary"
          inputProps={{ 'aria-label': ariaLabel }}
          disabled={disabled}
        />
      }
      label={label}
    />
  )
}

export default FormSwitch
