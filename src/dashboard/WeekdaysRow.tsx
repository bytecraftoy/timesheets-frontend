import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { getWeekDays } from './DashboardService'

const WeekdaysRow: React.FC<{
  week: Date[]
}> = ({ week }) => {
  return (
    <Grid
      item
      xs={12}
      container
      spacing={3}
      direction="row"
      justify="space-between"
      alignItems="center"
    >
      <Grid item xs={1}>
        <Typography align="center" variant="overline">
          <strong>Project</strong>
        </Typography>
      </Grid>
      {getWeekDays(week).map((day) => {
        return (
          <Grid item key={day} xs={1}>
            <Typography align="center" variant="overline" noWrap>
              <strong>{day}</strong>
            </Typography>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default WeekdaysRow
