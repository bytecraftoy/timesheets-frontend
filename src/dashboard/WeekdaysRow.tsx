import React from 'react'
import { Grid, Typography, Container, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { getWeekDays } from '../services/dateAndTimeService'

const useStyles = makeStyles((theme) => ({
  grayBackground: {
    backgroundColor: theme.palette.grey[300],
  },
  projectTotalsText: {
    paddingLeft: theme.spacing(0.2),
  },
}))

const WeekdaysRow: React.FC<{ week: Date[]; holidays: boolean[] }> = ({ week, holidays }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <Grid
      container
      spacing={0}
      direction="row"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography variant="overline">
          <strong>{t('project.label')}</strong>
        </Typography>
      </Grid>
      {getWeekDays(week).map((day, i) => {
        return (
          <Grid
            className={holidays[i] ? classes.grayBackground : ''}
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
      <Grid item xs={1}>
        <Typography className={classes.projectTotalsText} variant="body2">
          <em>{t('dashboard.projectTotals')}</em>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default WeekdaysRow
