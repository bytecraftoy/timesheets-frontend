import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Project } from '../common/types'
import { getAllProjects } from '../services/projectService'
import WeeklyView from './WeeklyView'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    const projectResponse = await getAllProjects()
    setProjects(projectResponse)
  }, [])

  useAPIErrorHandlerWithFinally(
    fetchProjects,
    useCallback(() => setLoading(false), [])
  )

  return (
    <>
      <Typography variant="h2" data-cy="input-hours-title">
        {t('timeInputs.title')}
      </Typography>
      {isLoading && (
        <div>
          <HourglassEmptyIcon />
        </div>
      )}
      {!isLoading && <WeeklyView projects={projects} debounceMs={2000} />}
    </>
  )
}

export default Dashboard
