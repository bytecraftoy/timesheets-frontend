import React from 'react'
import { TextField } from '@material-ui/core'
import { FormTextFieldProps } from '../common/types'

const FormTextField: React.FC<FormTextFieldProps> = ({
  className,
  name,
  label,
  handleChange,
  handleBlur,
  value,
  errors,
  touched,
  multiline = false,
  InputProps,
}) => {
  return (
    <TextField
      className={className}
      id={name}
      name={name}
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(errors && touched)}
      helperText={errors && touched && errors}
      multiline={multiline}
      rows={3}
      InputProps={InputProps}
    />
  )
}

export default FormTextField
