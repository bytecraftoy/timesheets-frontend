import React from 'react'
import { Grid } from '@material-ui/core'
import { FastField } from 'formik'
import { ProjectWithTimeInputs, weekInputs } from '../common/types'

const ProjectRow: React.FC<{ i: number; project: ProjectWithTimeInputs }> = ({ i, project }) => {
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
            <FastField id={name} name={name} />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default ProjectRow
