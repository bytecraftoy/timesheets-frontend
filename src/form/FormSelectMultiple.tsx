import React from 'react'
import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { FormSelectMultipleProps } from '../common/types'

const useStyles = makeStyles((theme) => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
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

  const getObjectName = (id: string) => {
    return objects.find((obj) => obj.id === id)?.name
  }

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
        renderValue={(selected) => (
          <div className={classes.chips}>
            {(selected as string[]).map((selectedValue) => (
              <Chip
                key={selectedValue}
                label={getObjectName(selectedValue)}
                className={classes.chip}
              />
            ))}
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
              <ListItemText primary={obj.name} />
            </MenuItem>
          )
        })}
      </Select>
      {errors && touched && <FormHelperText>{errors}</FormHelperText>}
    </FormControl>
  )
}

export default FormSelect
