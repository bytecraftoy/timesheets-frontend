import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { FastField, getIn, FormikErrors } from 'formik'
import { ProjectWithTimeInputs, weekInputs } from '../common/types'

const validate = (value: string): string | undefined => {
  let error: string | undefined
  if (Number.isNaN(Number(value))) {
    error = 'Value must be a number'
  }
  return error
}

interface ProjectRowProps {
  i: number
  project: ProjectWithTimeInputs
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  errors: FormikErrors<{ projects: ProjectWithTimeInputs[] }>
}

const ProjectRow: React.FC<ProjectRowProps> = ({
  i,
  project,
  handleChange,
  handleBlur,
  errors,
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
      {(Object.keys(project.inputs) as Array<keyof weekInputs>).map((key) => {
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
                />
              )}
            </FastField>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ProjectRow
