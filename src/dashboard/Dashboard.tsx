import React, { useEffect, useState } from 'react'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { Typography } from '@material-ui/core'
import { ProjectWithTimeInputs } from '../common/types'
import { getCurrentWeek, getProjects } from './DashboardService'
import HoursWeekInputs from './HoursWeekInputs'

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectWithTimeInputs[]>([])
  const [isLoading, setLoading] = useState(true)
  const [week, setWeek] = useState<Date[]>([])

  const fetchProjectsAndGetWeek = async () => {
    const projectsPromise = getProjects()
    setWeek(getCurrentWeek())
    setProjects(
      (await projectsPromise).map((project) => {
        return {
          id: project.id,
          name: project.name,
          inputs: {
            mondayInput: '',
            tuesdayInput: '',
            wednesdayInput: '',
            thursdayInput: '',
            fridayInput: '',
            saturdayInput: '',
            sundayInput: '',
          },
        }
      })
    )
    setLoading(false)
  }

  useEffect(() => {
    fetchProjectsAndGetWeek()
  }, [])

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
        projects={projects}
        setProjects={setProjects}
        week={week}
        debounceMs={1000}
      />
    </>
  )
}

export default Dashboard
