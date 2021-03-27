import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Project } from '../common/types'
import { getProjectsByEmployeeId } from '../services/projectService'
import WeeklyView from './WeeklyView'
import { useAPIErrorHandlerWithFinally } from '../services/errorHandlingService'
import { useUserContext } from '../context/UserContext'

const Dashboard: React.FC<{ debounceMs: number }> = ({ debounceMs }) => {
  const { t } = useTranslation()
  const { user } = useUserContext()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setLoading] = useState(true)

  const fetchProjects = useCallback(async () => {
    const projectResponse = await getProjectsByEmployeeId(user.id)
    setProjects(projectResponse)
  }, [user])

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
      {!isLoading && <WeeklyView projects={projects} debounceMs={debounceMs} />}
    </>
  )
}

export default Dashboard
