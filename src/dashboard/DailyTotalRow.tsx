import React, { useMemo } from 'react'
import { Grid, Typography, Container, makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ProjectAndInputs } from '../common/types'
import { sumTimeInputs } from './DashboardService'

const useStyles = makeStyles((theme) => ({
  totalHoursText: {
    paddingTop: theme.spacing(1),
  },
}))

const DailyTotalRow: React.FC<{ projectsAndInputs: ProjectAndInputs[] }> = ({
  projectsAndInputs,
}) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const dailyTotals = useMemo(() => {
    const projectsTimeInputs = projectsAndInputs.map((project) =>
      project.inputs.map((input) => input.time)
    )
    const totals: string[] = []
    for (let j = 0; j < 7; j += 1) {
      const dailyTimeInputs: string[] = []
      for (let i = 0; i < projectsTimeInputs.length; i += 1) {
        dailyTimeInputs.push(projectsTimeInputs[i][j])
      }
      totals.push(sumTimeInputs(dailyTimeInputs))
    }
    return totals
  }, [projectsAndInputs])
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
        <Typography className={classes.totalHoursText} variant="body2">
          {t('dashboard.dailyTotals')}
        </Typography>
      </Grid>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item key={i} xs zeroMinWidth>
          <Container disableGutters>
            <Typography className={classes.totalHoursText} align="center" variant="body2">
              {dailyTotals[i]}
            </Typography>
          </Container>
        </Grid>
      ))}
      <Grid item xs={1} />
    </Grid>
  )
}

export default DailyTotalRow
