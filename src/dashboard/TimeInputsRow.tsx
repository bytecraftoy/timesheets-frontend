import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { FastField, getIn, FormikErrors } from 'formik'
import { ProjectWithTimeInputs, WeekInputs } from '../common/types'
import { inputStringToNumber } from './DashboardService'

const validate = (value: string): string | undefined => {
  let error: string | undefined
  const number = inputStringToNumber(value)
  if (Number.isNaN(number)) {
    error = 'Number must be formated correctly'
  } else if (number < 0) {
    error = 'Number cannot be negative'
  } else if (number > 1440) {
    error = 'Number cannot be over 24 hours'
  }
  return error
}

interface ProjectRowProps {
  i: number
  project: ProjectWithTimeInputs
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  errors: FormikErrors<{ projects: ProjectWithTimeInputs[] }>
  disable: boolean
}

const TimeInputsRow: React.FC<ProjectRowProps> = ({
  i,
  project,
  handleChange,
  handleBlur,
  errors,
  disable,
}) => {
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
        const name = `projects[${i}].inputs.${key}`
        return (
          <Grid item xs={1} key={key}>
            <FastField name={name} validate={validate}>
              {() => (
                <TextField
                  id={name}
                  name={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={project.inputs[key]}
                  error={Boolean(getIn(errors, name))}
                  variant="outlined"
                  size="small"
                  disabled={disable}
                  inputProps={{
                    className: 'mousetrap',
                  }}
                />
              )}
            </FastField>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default TimeInputsRow