import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { ProjectWithTimeInputs, Project } from '../common/types'

import {
  getCurrentWeek,
  getProjects,
  getProjectHours,
  inputsToWeekInputsObject,
} from './DashboardService'
import HoursWeekInputs from './HoursWeekInputs'

const Dashboard: React.FC = () => {
  const [projects, setProjecst] = useState<Project[]>([])
  const [projectsAndInputs, setProjectsAndInputs] = useState<ProjectWithTimeInputs[]>([])
  const [isLoading, setLoading] = useState(true)
  const [week, setWeek] = useState<Date[]>(getCurrentWeek())

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsPromise = await getProjects()
      setProjecst(projectsPromise)
    }
    fetchProjects()
  }, [])

  useEffect(() => {
    const fetchTimeInputs = async () => {
      setLoading(true)
      const timeIntervalStartDate = week[0]
      const timeIntervalEndDate = week[week.length - 1]

      const projectsWithInputs = await Promise.all(
        projects.map(async (project) => ({
          id: project.id,
          name: project.name,
          inputs: inputsToWeekInputsObject(
            await getProjectHours(project.id, timeIntervalStartDate, timeIntervalEndDate),
            week
          ),
        }))
      )
      setProjectsAndInputs(projectsWithInputs)
      setLoading(false)
    }
    fetchTimeInputs()
  }, [projects, week])

  if (isLoading) {
    return (
      <div>
        <HourglassEmptyIcon />
      </div>
    )
  }

  return (
    <>
      <Typography variant="h2">Input hours</Typography>
      <HoursWeekInputs
        projects={projectsAndInputs}
        setProjects={setProjectsAndInputs}
        week={week}
        setWeek={setWeek}
        debounceMs={2000}
      />
    </>
  )
}

export default Dashboard
