import React, { useCallback } from 'react'
import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  Grid,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import { FormSelectMultipleProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}))

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
  const classes = useStyles()
  const { t } = useTranslation()

  const getObject = useCallback((id: string) => objects.find((obj) => obj.id === id), [objects])

  return (
    <FormControl className={className}>
      <InputLabel id={`mui-component-select-${name}`}>{label}</InputLabel>
      <Select
        data-cy={`select-multiple-${name}`}
        multiple
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(errors && touched)}
        inputProps={{
          id: name,
          name,
        }}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((selectedValue) => {
              const obj = getObject(selectedValue)
              return (
                obj && (
                  <Chip
                    key={selectedValue}
                    avatar={obj.isManager ? <SupervisorAccount /> : undefined}
                    label={obj.name}
                    className={classes.chip}
                  />
                )
              )
            })}
          </div>
        )}
      >
        {objects.length === 0 && (
          <MenuItem disabled value="">
            {t('form.nothingToSelect')}
          </MenuItem>
        )}

        {objects.map((obj) => {
          return (
            <MenuItem key={obj.id} value={obj.id}>
              <Checkbox checked={value.indexOf(obj.id) > -1} color="primary" />
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
