import React from 'react'
import { Grid, Typography, Container, makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { getWeekDays } from '../services/dateAndTimeService'

const useStyles = makeStyles((theme) => ({
  grayBackground: {
    backgroundColor: theme.palette.grey[300],
  },
}))

const WeekdaysRow: React.FC<{ week: Date[]; holidays: boolean[] }> = ({ week, holidays }) => {
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
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography align="center" variant="overline">
          <strong>Project</strong>
        </Typography>
      </Grid>
      {getWeekDays(week).map((day, i) => {
        return (
          <Grid
            className={clsx(holidays[i] && classes.grayBackground)}
            item
            key={day}
            xs
            zeroMinWidth
          >
            <Container>
              <Typography align="center" variant="overline" noWrap>
                <strong>{day}</strong>
              </Typography>
            </Container>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default WeekdaysRow
