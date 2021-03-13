import React, { useMemo } from 'react'
import { Grid, Typography, makeStyles } from '@material-ui/core'
import { FieldArray } from 'formik'
import { TimeInputsRowProps } from '../common/types'
import TimeInputCell from './TimeInputCell'
import { sumTimeInputs, minutesToHoursAndMinutes } from './DashboardService'

const useStyles = makeStyles((theme) => ({
  totalHoursText: {
    paddingTop: theme.spacing(0.5),
  },
}))

const TimeInputsRow: React.FC<TimeInputsRowProps> = ({
  i,
  projectAndInputs,
  handleChange,
  handleBlur,
  errors,
  showDescription,
  holidays,
}) => {
  const classes = useStyles()
  const projectWeekHours = useMemo(
    () =>
      minutesToHoursAndMinutes(sumTimeInputs(projectAndInputs.inputs.map((input) => input.time))),
    [projectAndInputs]
  )
  return (
    <Grid
      item
      xs={12}
      container
      spacing={1}
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography style={{ wordWrap: 'break-word' }} variant="body1">
          {projectAndInputs.name}
        </Typography>
      </Grid>
      <FieldArray name={`projects[${i}].inputs`} validateOnChange={false}>
        {() =>
          [0, 1, 2, 3, 4, 5, 6].map((j) => (
            <TimeInputCell
              key={j}
              input={projectAndInputs.inputs[j]}
              timeInputName={`projects[${i}].inputs[${j}]`}
              handleChange={handleChange}
              handleBlur={handleBlur}
              errors={errors}
              showDescription={showDescription}
              isHoliday={holidays[j]}
            />
          ))
        }
      </FieldArray>
      <Grid item xs={1}>
        <Typography className={classes.totalHoursText} variant="body2">
          <em>{projectWeekHours}</em>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default TimeInputsRow
