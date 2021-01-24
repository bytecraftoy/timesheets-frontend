import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@material-ui/core'
import { FormSelectMultipleProps } from '../common/types'

// ??? : is it possible to combine FormSelect and FormSelectMultiple???

const FormSelect: React.FC<FormSelectMultipleProps> = ({
  objects,
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
    <FormControl className={className}>
      <InputLabel id={`mui-component-select-${name}`}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(errors && touched)}
        inputProps={{
          id: name,
          name,
        }}
      >
        {objects.map((obj) => {
          return (
            <MenuItem key={obj.id} value={obj.id}>
              {obj.name}
            </MenuItem>
          )
        })}
      </Select>
      {errors && touched && <FormHelperText>{errors}</FormHelperText>}
    </FormControl>
  )
}

export default FormSelect
