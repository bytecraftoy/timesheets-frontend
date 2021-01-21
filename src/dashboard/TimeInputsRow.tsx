import React from 'react'
import { Grid, TextField, makeStyles } from '@material-ui/core'
import { FastField, getIn, FormikErrors } from 'formik'
import { ProjectWithTimeInputs, WeekInputs } from '../common/types'
import { timeStringToNumber } from './DashboardService'

const validateTime = (value: string): string | undefined => {
  let error: string | undefined
  const number = timeStringToNumber(value)
  if (Number.isNaN(number)) {
    error = 'Number must be formated correctly'
  } else if (number < 0) {
    error = 'Number cannot be negative'
  } else if (number > 1440) {
    error = 'Number cannot be over 24 hours'
  }
  return error
}

const validateDescription = (value: string): string | undefined => {
  let error: string | undefined
  if (value.length > 100) {
    error = 'Description cannot be longer than 100 characters'
  }
  return error
}

const useStyles = makeStyles((theme) => ({
  descriptionField: {
    backgroundColor: theme.palette.common.white,
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    width: '100%',
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      '&:focus-within': {
        width: '24ch',
        zIndex: '1',
      },
    },
  },
}))

interface ProjectRowProps {
  i: number
  project: ProjectWithTimeInputs
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  errors: FormikErrors<{ projects: ProjectWithTimeInputs[] }>
  disable: boolean
  showDescription: boolean
}

const TimeInputsRow: React.FC<ProjectRowProps> = ({
  i,
  project,
  handleChange,
  handleBlur,
  errors,
  disable,
  showDescription,
}) => {
  const classes = useStyles()
  return (
    <Grid
      item
      xs={12}
      container
      spacing={0}
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Grid item xs={1}>
        {project.name}
      </Grid>
      {(Object.keys(project.inputs) as Array<keyof WeekInputs>).map((key) => {
        const timeName = `projects[${i}].inputs.${key}.time`
        const descriptionName = `projects[${i}].inputs.${key}.description`
        return (
          <Grid item xs={1} key={key}>
            <FastField name={timeName} validate={validateTime}>
              {() => (
                <TextField
                  id={timeName}
                  name={timeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={project.inputs[key].time}
                  error={Boolean(getIn(errors, timeName))}
                  variant="outlined"
                  size="small"
                  disabled={disable}
                  inputProps={{
                    className: 'mousetrap',
                  }}
                />
              )}
            </FastField>
            {showDescription && (
              <FastField name={descriptionName} validate={validateDescription}>
                {() => (
                  <TextField
                    className={classes.descriptionField}
                    id={descriptionName}
                    name={descriptionName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={project.inputs[key].description}
                    error={Boolean(getIn(errors, descriptionName))}
                    variant="outlined"
                    size="small"
                    disabled={disable}
                    inputProps={{
                      className: 'mousetrap',
                    }}
                  />
                )}
              </FastField>
            )}
          </Grid>
        )
      })}
    </Grid>
  )
}

export default TimeInputsRow
