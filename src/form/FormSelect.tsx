import React from 'react'
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import { FormSelectProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
}))

const FormSelect: React.FC<FormSelectProps> = ({
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
  const classes = useStyles()
  return (
    <FormControl className={className}>
      <InputLabel id={`mui-component-select-${name}`}>{label}</InputLabel>
      <Select
        data-cy={`select-${name}`}
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
              <Grid container alignItems="center">
                {obj.isManager && <SupervisorAccount className={classes.icon} fontSize="small" />}
                {obj.name}
              </Grid>
            </MenuItem>
          )
        })}
      </Select>
      {errors && touched && <FormHelperText>{errors}</FormHelperText>}
    </FormControl>
  )
}

export default FormSelect
