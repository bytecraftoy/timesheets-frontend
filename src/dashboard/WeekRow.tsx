import React, { useEffect, useCallback } from 'react'
import { addDays, subDays, getISOWeek, getYear } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { IconButton, Grid, Typography } from '@material-ui/core'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { makeStyles } from '@material-ui/core/styles'
import Mousetrap from 'mousetrap'

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}))

const WeekRow: React.FC<{
  week: Date[]
  setWeek: React.Dispatch<React.SetStateAction<Date[]>>
  disableWeekChangeButtons: boolean
  setDisableWeekChange: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ week, setWeek, disableWeekChangeButtons, setDisableWeekChange }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const changeWeek = useCallback(
    (change: (a: Date) => Date): void => {
      if (disableWeekChangeButtons) {
        return
      }
      setDisableWeekChange(true)
      const newWeek = week.map((date) => change(date))
      setWeek(newWeek)
      setDisableWeekChange(false)
    },
    [week, setWeek, disableWeekChangeButtons, setDisableWeekChange]
  )

  const changeWeekBackwards = useCallback(() => changeWeek((a) => subDays(a, 7)), [changeWeek])

  const changeWeekForward = useCallback(() => changeWeek((a) => addDays(a, 7)), [changeWeek])

  const getWeekNumber = useCallback((): number => getISOWeek(week[0]), [week])

  const getYearNumber = useCallback((): number => getYear(week[0]), [week])

  useEffect(() => {
    Mousetrap.bind('ctrl+,', changeWeekBackwards)
    Mousetrap.bind('ctrl+.', changeWeekForward)
    return () => {
      Mousetrap.unbind('ctrl+,')
      Mousetrap.unbind('ctrl+.')
    }
  }, [changeWeekBackwards, changeWeekForward])

  return (
    <Grid container spacing={4} direction="row" justify="space-between" alignItems="center">
      <Grid item xs={1}>
        <IconButton
          color="primary"
          className={classes.button}
          onClick={changeWeekBackwards}
          disabled={disableWeekChangeButtons}
          data-testid="previousWeek"
        >
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid item xs={2}>
        <Typography align="center" variant="h5">
          {`${t('weekTitle')} ${getWeekNumber()}`}
        </Typography>
        <Typography align="center" variant="h5">
          {getYearNumber()}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <IconButton
          color="primary"
          className={classes.button}
          onClick={changeWeekForward}
          disabled={disableWeekChangeButtons}
          data-testid="nextWeek"
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default WeekRow
