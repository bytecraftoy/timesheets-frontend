import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Project } from '../common/types'
import { getAllProjects } from '../services/projectService'
import WeeklyView from './WeeklyView'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const [projects, setProjecst] = useState<Project[]>([])
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsPromise = await getAllProjects()
      setProjecst(projectsPromise)
    }
    fetchProjects()
    setLoading(false)
  }, [])

  return (
    <>
      <Typography variant="h2">{t('inputHoursTitle')}</Typography>
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
