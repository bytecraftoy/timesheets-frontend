import React, { useMemo } from 'react'
import { Grid, Typography, Container } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ProjectAndInputs } from '../common/types'
import { sumTimeInputs, minutesToHoursAndMinutes } from './dashboardService'

const DailyTotalRow: React.FC<{ projectsAndInputs: ProjectAndInputs[] }> = ({
  projectsAndInputs,
}) => {
  const { t } = useTranslation()
  const dailyNumberTotals = useMemo(() => {
    const projectsTimeInputs = projectsAndInputs.map((project) =>
      project.inputs.map((input) => input.time)
    )
    const totals: number[] = []
    for (let j = 0; j < 7; j += 1) {
      const dailyTimeInputs: string[] = []
      for (let i = 0; i < projectsTimeInputs.length; i += 1) {
        dailyTimeInputs.push(projectsTimeInputs[i][j])
      }
      totals.push(sumTimeInputs(dailyTimeInputs))
    }
    return totals
  }, [projectsAndInputs])
  const weeklyTotal = useMemo(
    () => minutesToHoursAndMinutes(dailyNumberTotals.reduce((a, b) => a + b, 0)),
    [dailyNumberTotals]
  )
  const dailyTotals = useMemo(
    () => dailyNumberTotals.map((total) => minutesToHoursAndMinutes(total)),
    [dailyNumberTotals]
  )
  return (
    <Grid
      item
      container
      spacing={0}
      direction="row"
      justify="space-between"
      alignItems="center"
      wrap="nowrap"
    >
      <Grid item xs={2}>
        <Typography variant="body2">
          <em>{t('dashboard.dailyTotals')}</em>
        </Typography>
      </Grid>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item key={i} xs zeroMinWidth>
          <Container disableGutters>
            <Typography align="center" variant="body2">
              <em>{dailyTotals[i]}</em>
            </Typography>
          </Container>
        </Grid>
      ))}
      <Grid item xs={1}>
        <Typography variant="body2">
          <em>
            <b>
              {t('dashboard.weeklyTotal')} {weeklyTotal}
            </b>
          </em>
        </Typography>
      </Grid>
    </Grid>
  )
}

export default DailyTotalRow
