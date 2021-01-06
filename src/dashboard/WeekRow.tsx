import React from 'react'
import { addDays, subDays, getISOWeek } from 'date-fns'
import { IconButton, Grid, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}))

const WeekRow: React.FC<{
  week: Date[]
  setWeek: React.Dispatch<React.SetStateAction<Date[]>>
  disableWeekChange: boolean
  setDisableWeekChange: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ week, setWeek, disableWeekChange, setDisableWeekChange }) => {
  const classes = useStyles()

  const changeWeek = (change: (a: Date) => Date): void => {
    if (disableWeekChange) {
      return
    }
    setDisableWeekChange(true)
    const newWeek = week.map((date) => change(date))
    setWeek(newWeek)
    setDisableWeekChange(false)
  }

  const changeWeekBackwards = () => changeWeek((a) => subDays(a, 7))

  const changeWeekForward = () => changeWeek((a) => addDays(a, 7))

  const getWeekNumber = (): number => {
    return getISOWeek(week[0])
  }

  return (
    <Grid container spacing={4} direction="row" justify="space-between" alignItems="center">
      <Grid item xs={1}>
        <IconButton
          color="primary"
          className={classes.button}
          onClick={changeWeekBackwards}
          disabled={disableWeekChange}
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid item xs={2}>
        <Typography align="center" variant="h5">
          {`Week ${getWeekNumber()}`}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          color="primary"
          className={classes.button}
          onClick={changeWeekForward}
          disabled={disableWeekChange}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default WeekRow
