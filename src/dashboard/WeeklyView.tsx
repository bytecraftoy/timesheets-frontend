import React, { useEffect, useState } from 'react'
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty'
import { getProjectHours, inputsToWeekInputsObject } from './DashboardService'
import TimeInputsForm from './TimeInputsForm'
import { Project, ProjectWithTimeInputs } from '../common/types'
import WeekRow from './WeekRow'
import WeekdaysRow from './WeekdaysRow'

const WeeklyView: React.FC<{
  projects: Project[]
  week: Date[]
  setWeek: React.Dispatch<React.SetStateAction<Date[]>>
  debounceMs: number
}> = ({ projects, week, setWeek, debounceMs }) => {
  const [projectsAndInputs, setProjectsAndInputs] = useState<ProjectWithTimeInputs[]>([])
  const [disableWeekChange, setDisableWeekChange] = useState(false)
  const [isLoading, setLoading] = useState(true)

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

  return (
    <>
      <WeekRow
        week={week}
        setWeek={setWeek}
        disableWeekChange={disableWeekChange}
        setDisableWeekChange={setDisableWeekChange}
      />
      <WeekdaysRow week={week} />
      {isLoading && (
        <div>
          <HourglassEmptyIcon />
        </div>
      )}
      {!isLoading && (
        // TODO: rename projects-> projectsAndInputs and setProjecs->setProjectsAndInputs in all child components
        <TimeInputsForm
          projects={projectsAndInputs}
          setProjects={setProjectsAndInputs}
          week={week}
          debounceMs={debounceMs}
          disableWeekChange={disableWeekChange}
        />
      )}
    </>
  )
}

export default WeeklyView
