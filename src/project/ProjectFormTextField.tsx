import React from 'react'
import { TextField } from '@material-ui/core'

export interface ProjectFormTextFieldProps {
  className: string
  name: string
  label: string
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  value: string
  errors: string | undefined
  touched: boolean | undefined
}

const ProjectFormTextField: React.FC<ProjectFormTextFieldProps> = ({
  className,
  name,
  label,
  handleChange,
  handleBlur,
  value,
  errors,
  touched,
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
    />
  )
}

export { ProjectFormTextField }
